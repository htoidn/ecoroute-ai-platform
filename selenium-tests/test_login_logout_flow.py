"""
Selenium Test: Login and Logout Flow

Test the complete login and logout workflow:
1. Navigate to http://localhost:3000/login
2. Enter credentials in login form
3. Click "START YOUR JOURNEY" button
4. Verify successful login redirects to home page
5. Click on profile dropdown and logout
6. Verify logout redirects back to login page

HTML Snippets:
==============

Login Page Elements:
-------------------
Username Input:
<input id="username" type="text" placeholder="Enter your username" ... />

Password Input:
<input id="password" type="password" placeholder="Enter your password" ... />

Login Button:
<button type="submit" ...>🚀 Start Your Journey</button>

Home Page Dropdown:
-------------------
Profile Button (opens dropdown):
<button ...>👤 admin</button>

Dropdown Menu with Logout:
<div ...>
    <button>👤 My Profile</button>
    <button>⚙️ Settings</button>
    <button>🚪 Logout</button>
</div>
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def wait_for(driver, timeout=10):
    """Helper to create a WebDriverWait instance."""
    return WebDriverWait(driver, timeout)


@pytest.mark.selenium
def test_login_with_correct_credentials(driver, base_url):
    """Test successful login with admin/admin123."""
    driver.get(f"{base_url}/login")

    wait = wait_for(driver, 10)

    # Wait for username and password inputs to be visible
    wait.until(EC.presence_of_element_located((By.ID, "username")))
    wait.until(EC.presence_of_element_located((By.ID, "password")))

    username_input = driver.find_element(By.ID, "username")
    password_input = driver.find_element(By.ID, "password")

    # Clear and enter credentials
    username_input.clear()
    username_input.send_keys("admin")
    password_input.clear()
    password_input.send_keys("admin123")

    # Submit form by pressing Enter
    password_input.send_keys(Keys.ENTER)

    # For admin users, we expect redirect to /recommendations
    # For regular users, redirect to /
    try:
        wait.until(EC.url_contains("/recommendations"))
    except Exception:
        # Fallback: check if we're on home page or if admin user is logged in
        try:
            wait.until(EC.url_contains("/"))
            # Check that we see the profile button with admin username
            wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "button[data-testid='profile-button']")
            ))
        except Exception:
            raise AssertionError("Login failed: User was not redirected to expected page")

    # Verify we're no longer on login page
    assert "/login" not in driver.current_url, "Should not be on login page after successful login"


@pytest.mark.selenium
def test_login_and_navigate_to_home_page(driver, base_url):
    """Test login and verify navigation to home page."""
    driver.get(f"{base_url}/login")

    wait = wait_for(driver, 10)

    # Find and fill login form
    username_input = wait.until(EC.presence_of_element_located((By.ID, "username")))
    password_input = wait.until(EC.presence_of_element_located((By.ID, "password")))

    username_input.send_keys("admin")
    password_input.send_keys("admin123")
    password_input.send_keys(Keys.ENTER)

    # Wait for page to load after login
    wait.until(EC.url_changes(f"{base_url}/login"))

    current_url = driver.current_url
    print(f"Current URL after login: {current_url}")

    # Should be on either home page (/) or recommendations (/recommendations)
    assert "/login" not in current_url, f"Still on login page: {current_url}"
    assert ("/" in current_url or "/recommendations" in current_url), \
        f"Unexpected URL after login: {current_url}"


@pytest.mark.selenium
def test_logout_flow(driver, base_url):
    """Test complete logout flow from home page."""
    # First, login
    driver.get(f"{base_url}/login")
    wait = wait_for(driver, 10)

    username_input = wait.until(EC.presence_of_element_located((By.ID, "username")))
    password_input = wait.until(EC.presence_of_element_located((By.ID, "password")))

    username_input.send_keys("admin")
    password_input.send_keys("admin123")
    password_input.send_keys(Keys.ENTER)

    # Wait for successful login
    wait.until(EC.url_changes(f"{base_url}/login"))

    # Find and click the profile button (👤 admin)
    profile_button = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, "button[data-testid='profile-button']")
    ))
    profile_button.click()

    # Wait for dropdown menu to appear and find logout button
    # Prefer data-testid for reliable selection
    try:
        logout_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-testid='dropdown-logout']")))
    except Exception:
        logout_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Logout')]")
        ))
    logout_button.click()

    # After logout, we should be redirected to login page
    wait.until(EC.url_contains("/login"))

    current_url = driver.current_url
    assert "/login" in current_url, f"After logout, should redirect to login page, but got: {current_url}"

    # Verify that profile button is no longer visible (not logged in)
    profile_buttons = driver.find_elements(By.CSS_SELECTOR, "button[data-testid='profile-button']")
    if len(profile_buttons) > 0:
        # If profile button still exists, verify there's a login button as fallback
        login_buttons = driver.find_elements(By.CSS_SELECTOR, "button[data-testid='login-button']")
        assert len(login_buttons) > 0, "Should see Login button after logout"


@pytest.mark.selenium
def test_login_with_incorrect_credentials(driver, base_url):
    """Test login with incorrect credentials shows error."""
    driver.get(f"{base_url}/login")

    wait = wait_for(driver, 10)

    username_input = wait.until(EC.presence_of_element_located((By.ID, "username")))
    password_input = wait.until(EC.presence_of_element_located((By.ID, "password")))

    username_input.send_keys("wronguser")
    password_input.send_keys("wrongpassword")
    password_input.send_keys(Keys.ENTER)

    # Wait for error message to appear
    error_message = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//div[contains(., 'Invalid') or contains(., 'Error') or contains(., '⚠️')]")
    ))

    assert error_message is not None, "Should display error message for incorrect credentials"
    # Verify we're still on login page
    assert "/login" in driver.current_url, "Should remain on login page with incorrect credentials"


@pytest.mark.selenium
def test_login_button_text_is_correct(driver, base_url):
    """Verify the login button displays correct text."""
    driver.get(f"{base_url}/login")

    wait = wait_for(driver, 10)

    # Wait for login button to be visible
    login_button = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//button[contains(., 'Start Your Journey') or contains(., '🚀')]")
    ))

    button_text = login_button.text
    assert "Start Your Journey" in button_text, f"Button should have 'Start Your Journey' text, got: {button_text}"


@pytest.mark.selenium
def test_profile_dropdown_menu_items(driver, base_url):
    """Verify profile dropdown has correct menu items."""
    # Login first
    driver.get(f"{base_url}/login")
    wait = wait_for(driver, 10)

    username_input = wait.until(EC.presence_of_element_located((By.ID, "username")))
    password_input = wait.until(EC.presence_of_element_located((By.ID, "password")))

    username_input.send_keys("admin")
    password_input.send_keys("admin123")
    password_input.send_keys(Keys.ENTER)

    # Wait for successful login
    wait.until(EC.url_changes(f"{base_url}/login"))

    # Click profile button
    profile_button = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, "button[data-testid='profile-button']")
    ))
    profile_button.click()

    # Verify all dropdown items are visible
    my_profile = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//button[contains(., 'My Profile')]")
    ))
    assert my_profile is not None

    settings = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//button[contains(., 'Settings') or contains(., '⚙️')]")
    ))
    assert settings is not None

    logout = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//button[contains(., 'Logout') or contains(., '🚪')]")
    ))
    assert logout is not None

