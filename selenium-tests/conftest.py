"""Pytest fixtures for Selenium tests.

Fixtures:
 - base_url: configurable base URL (env BASE_URL), default http://localhost:5173
 - driver: selenium webdriver (Chrome) using webdriver-manager
"""
import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager


@pytest.fixture(scope="session")
def base_url() -> str:
    """
    Get base URL from environment or use defaults.
    For frontend development (Vite): http://localhost:5173
    For production/docker: http://localhost:3000
    """
    return os.getenv("BASE_URL", "http://localhost:3000")


@pytest.fixture(scope="session")
def driver():
    """Create a Chrome webdriver for the session and quit at the end."""
    chrome_options = Options()
    # Default to headless unless explicitly disabled
    headless_env = os.getenv("HEADLESS", "1").lower()
    if headless_env in ("1", "true", "yes", "on"):
        chrome_options.add_argument("--headless=new")
    # Common recommended options for CI/headless
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1600,1200")

    driver_path = ChromeDriverManager().install()
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.maximize_window()
    yield driver
    try:
        driver.quit()
    except Exception:
        pass

