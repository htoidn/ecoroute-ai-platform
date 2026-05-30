import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def do_login(driver, base_url, username="admin", password="admin123"):
    driver.get(f"{base_url}/login")
    wait = WebDriverWait(driver, 10)
    wait.until(EC.visibility_of_element_located((By.NAME, "username"))).send_keys(username)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    # Wait for an element visible only after login (adjust selector)
    wait.until(EC.visibility_of_element_located((By.ID, "logoutBtn")))


def test_login_success(driver, base_url):
    do_login(driver, base_url)
    # Assert logged-in UI presence or redirect
    assert "login" not in driver.current_url.lower()
    assert driver.find_element(By.ID, "logoutBtn").is_displayed()


def test_search_munich(driver, base_url):
    do_login(driver, base_url)
    driver.get(f"{base_url}/")  # or /search
    wait = WebDriverWait(driver, 10)
    wait.until(EC.visibility_of_element_located((By.NAME, "q"))).send_keys("Munich")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    results = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".result-item")))
    assert len(results) > 0, "No results displayed for 'Munich'"
    assert any("Munich" in r.text for r in results), "No result contains 'Munich'"


def test_logout(driver, base_url):
    do_login(driver, base_url)
    driver.find_element(By.ID, "logoutBtn").click()
    # After logout, login form should be visible
    wait = WebDriverWait(driver, 10)
    wait.until(EC.visibility_of_element_located((By.NAME, "username")))
    assert driver.find_element(By.NAME, "username").is_displayed()

