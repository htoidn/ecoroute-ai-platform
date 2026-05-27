"""
Basic Selenium Regression Tests for EcoRoute AI Platform

This file contains a simplified set of regression tests.
For comprehensive test coverage, see test_regression_suite.py

These tests verify core functionality:
- User login with valid credentials
- Search functionality
- User logout

Note: Many tests in this file are consolidated into test_regression_suite.py
which provides more detailed test cases with better error handling.
Use test_regression_suite.py for comprehensive regression testing.
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def wait_for(driver, timeout=10):
    return WebDriverWait(driver, timeout)


@pytest.mark.selenium
def test_login_and_logout_flow(driver, base_url):
    """Verify that a user can log in with admin/admin123 and then log out successfully.

    This is a basic version. For more detailed testing, see:
    - test_login_logout_flow.py::test_login_with_correct_credentials
    - test_regression_suite.py::TestLogoutFunctionality::test_logout_flow_returns_to_login_page
    """
    driver.get(f"{base_url}/login")
    wait = wait_for(driver, 10)

    # Wait for login form
    wait.until(EC.presence_of_element_located((By.ID, "username")))
    username = driver.find_element(By.ID, "username")
    password = driver.find_element(By.ID, "password")

    username.clear()
    username.send_keys("admin")
    password.clear()
    password.send_keys("admin123")

    # Submit the form
    password.send_keys(Keys.ENTER)

    # After successful login the app navigates to /recommendations or /
    try:
        wait.until(EC.url_contains("/recommendations"))
    except Exception:
        # fallback: wait for profile button showing the username
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[data-testid='profile-button']")))

    assert "/login" not in driver.current_url, "Should not be on login page after successful login"

    # Open profile dropdown and click Logout
    profile_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-testid='profile-button']")))
    profile_btn.click()

    # Prefer data-testid for logout, fallback to visible text
    try:
        logout_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-testid='dropdown-logout']")))
    except Exception:
        logout_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Logout')]") ))
    logout_btn.click()

    # After logout, the navigation should show the Login button
    login_btn = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "button[data-testid='login-button']")))
    assert login_btn is not None


@pytest.mark.selenium
def test_search_for_munich_shows_results(driver, base_url):
    """Search for 'Munich' from the home page and verify the search results area displays.

    This is a basic version. For more detailed testing, see:
    - test_regression_suite.py::TestSearchFunctionality::test_search_for_munich_displays_results
    """
    driver.get(base_url + "/")
    wait = wait_for(driver, 15)

    # Wait for the search input to appear
    search_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Search']")))

    # Enter the keyword and trigger search via Enter
    search_input.clear()
    search_input.send_keys("Munich")
    search_input.send_keys(Keys.ENTER)

    # Wait for the Search Results title to appear
    results_title = wait.until(EC.presence_of_element_located((By.XPATH, "//h3[contains(., 'Munich') or contains(., 'Search Results')]")))
    assert results_title is not None

    # Verify that either actual result cards appear or an empty message is shown
    result_cards = driver.find_elements(By.XPATH, "//h3[contains(., 'Search Results')]/following::h3")
    empty_messages = driver.find_elements(By.XPATH, "//p[contains(., 'No destinations') or contains(., 'No destinations match')]")

    assert len(result_cards) > 0 or len(empty_messages) > 0, "Should show either results or empty message"


