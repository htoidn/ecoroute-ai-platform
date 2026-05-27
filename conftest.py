#!/usr/bin/env python3
import os
import pytest
import urllib.request
import urllib.error
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

@pytest.fixture(scope="session")
def base_url():
    """Return the base URL used by tests.

    Default now points to the exact login page URL requested by the project
    maintainers: http://localhost:3000/login. Tests may still navigate to
    the site root (http://localhost:3000/) for home/search/logout flows, so
    the fixtures compute the site root when needed.
    """
    raw = os.getenv("BASE_URL", "http://localhost:3000/login")
    # remove trailing slash if present
    if raw.endswith("/"):
        raw = raw[:-1]
    return raw

@pytest.fixture(scope="session")
def driver(base_url):
    options = Options()
    if os.getenv("HEADLESS", "1") == "1":
        options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    # Compute the site root from the provided base_url so we can attempt
    # fallbacks (e.g. load root and pushState) when tests request a path.
    parsed = urllib.parse.urlparse(base_url)
    site_root = f"{parsed.scheme}://{parsed.netloc}"

    # Quick pre-check: ensure either the configured base_url or the site root
    # is reachable before starting the browser. This provides an early, clear
    # error instead of obscure WebDriver connection failures.
    try:
        try:
            urllib.request.urlopen(base_url, timeout=3)
        except Exception:
            # try site root as a fallback
            urllib.request.urlopen(site_root + "/", timeout=3)
    except (urllib.error.URLError, ConnectionRefusedError) as exc:
        raise RuntimeError(
            f"Unable to reach the application at {base_url!r} or {site_root!r}.\n"
            "Start the frontend (dev server or docker) before running selenium tests.\n"
            "Example (dev server):\n  cd frontend && npm install && npm run dev\n"
            "Or, if using docker-compose:\n  docker-compose up -d --build\n"
        ) from exc

    # Support a remote Selenium server (useful when running selenium/standalone in
    # Docker). If SELENIUM_REMOTE_URL is set we connect remotely, otherwise use
    # webdriver-manager to install a local chromedriver.
    selenium_remote = os.environ.get("SELENIUM_REMOTE_URL")
    if selenium_remote:
        caps = DesiredCapabilities.CHROME.copy()
        caps["goog:chromeOptions"] = {"args": ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"]}
        driver = webdriver.Remote(command_executor=selenium_remote, desired_capabilities=caps)
    else:
        svc = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=svc, options=options)
    driver.set_window_size(1280, 800)
    # Wrap driver.get to handle server setups where direct routes (e.g. /login)
    # return 404 (common when an nginx/static server doesn't fallback to
    # index.html). If the requested path returns 404 but the root serves the
    # SPA, load the root and use history.pushState so the SPA client router
    # can render the expected route. This prevents tests from failing when the
    # server isn't configured for SPA fallback.
    original_get = driver.get

    def smart_get(url):
        try:
            # Only inspect same-origin URLs
            if url.startswith(base_url):
                # quick HEAD/GET to check for 404
                try:
                    resp = urllib.request.urlopen(url, timeout=2)
                    code = getattr(resp, 'getcode', lambda: None)()
                except Exception:
                    code = None
                # If the server returned 404 for this path but root is OK,
                # load root and pushState to the desired path so client-side
                # routing takes over.
                if code == 404:
                    original_get(f"{base_url}/")
                    # compute path portion
                    parsed = urllib.parse.urlparse(url)
                    path = parsed.path or '/'
                    # use pushState to update URL and notify SPA
                    script = (
                        "window.history.pushState({}, '', '" + path + "');"
                        "window.dispatchEvent(new PopStateEvent('popstate'));"
                    )
                    try:
                        driver.execute_script(script)
                        # Give the client router and JS a short moment to handle the
                        # popstate and render the route. This is best-effort; tests
                        # still use explicit waits for elements.
                        import time
                        for _ in range(6):
                            try:
                                state = driver.execute_script("return document.readyState")
                            except Exception:
                                state = None
                            if state == 'complete':
                                break
                            time.sleep(0.25)
                    except Exception:
                        # best-effort; if execute_script fails, fall back to original_get
                        original_get(url)
                    return
        except Exception:
            # if anything weird happens, fall back to the original get
            pass
        return original_get(url)

    driver.get = smart_get
    yield driver
    driver.quit()

# Save screenshots on test failure
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        driver = item.funcargs.get("driver")
        if driver:
            path = os.path.join("screenshots", f"{item.name}.png")
            os.makedirs(os.path.dirname(path), exist_ok=True)
            driver.save_screenshot(path)
            print(f"[SCREENSHOT SAVED] {path}")

