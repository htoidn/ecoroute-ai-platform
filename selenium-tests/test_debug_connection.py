import time


def test_debug_base_url(driver, base_url):
    """Open the configured BASE_URL, print title and a short page-source

    This is a non-flaky debug helper: it won't assert page contents so it can be
    used to determine whether the browser can reach the frontend and what is
    being served at the URL.
    """
    print("BASE_URL:", base_url)
    driver.get(base_url)

    # Give the page a moment to render JS-driven SPAs
    time.sleep(1)

    title = driver.title
    print("PAGE TITLE:", title)

    src = driver.page_source or ""
    print("PAGE SOURCE (first 1200 chars):")
    print(src[:1200])


    # Do not fail the test; this is informational. If you want to convert this
    # into an assertion-based test, replace the next line with an assert.
    assert True

