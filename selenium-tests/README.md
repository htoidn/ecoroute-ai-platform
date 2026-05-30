# Selenium Tests - EcoRoute Login & Logout

This folder contains comprehensive Selenium tests for the EcoRoute frontend, including login and logout workflows.

## 📋 Test Files

- **`test_login_logout_flow.py`** ⭐ NEW - Complete login/logout test suite (6 tests)
- **`test_regression.py`** - Existing regression tests (search, navigation)
- **`conftest.py`** - Test configuration and fixtures
- **`SELENIUM_HTML_GUIDE.md`** - Complete HTML element reference
- **`HTML_SNIPPETS.html`** - Quick reference card

## 🔧 Prerequisites

- Python 3.8+
- Google Chrome installed (ChromeDriver auto-managed by webdriver-manager)
- Frontend running on http://localhost:3000 or http://localhost:5173

## 📦 Installation

**Option 1: Using Virtual Environment (Recommended)**
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements-selenium.txt
```

**Option 2: Direct Installation**
```bash
pip install -r requirements-selenium.txt
```

## 🚀 Quick Start

### 1. Start Frontend

**Option A: Production Build (port 3000)**
```bash
cd frontend
npm run build
npm run preview -- --host 0.0.0.0 --port 3000
```

**Option B: Development Server (port 5173)**
```bash
cd frontend
npm run dev
# Remember to set BASE_URL when running tests:
BASE_URL=http://localhost:5173 pytest tests/selenium/test_login_logout_flow.py -v
```

### 2. Run Tests

```bash
# Run all login/logout tests (uses http://localhost:3000 by default)
pytest tests/selenium/test_login_logout_flow.py -v

# Run with visible browser (non-headless)
HEADLESS=0 pytest tests/selenium/test_login_logout_flow.py -v

# Run single test
pytest tests/selenium/test_login_logout_flow.py::test_logout_flow -v

# Generate HTML report
pytest tests/selenium/test_login_logout_flow.py --html=report.html --self-contained-html

# Run all selenium tests (including regression)
pytest tests/selenium -m selenium -v
```

### 3. Easy Way - Use Test Runner Script

```bash
# From repo root
./run-selenium-tests.sh                    # Uses defaults
./run-selenium-tests.sh --no-headless      # Show browser
./run-selenium-tests.sh --url http://localhost:5173
./run-selenium-tests.sh --no-headless --report --verbose
./run-selenium-tests.sh --help             # Show all options
```

## 🧪 Test Coverage

### Login Page Tests (`http://localhost:3000/login`)

| Test | What it does |
|------|-------------|
| `test_login_with_correct_credentials` | Login with admin/admin123 |
| `test_login_and_navigate_to_home_page` | Verify redirect after login |
| `test_login_with_incorrect_credentials` | Test error message |
| `test_login_button_text_is_correct` | Verify button label |

### Logout Tests (from Home page)

| Test | What it does |
|------|-------------|
| `test_logout_flow` | Complete logout workflow |
| `test_profile_dropdown_menu_items` | Verify dropdown contents |

## 📝 HTML Element Identifiers

### Login Form
```html
<input id="username" type="text" ... />           <!-- Username -->
<input id="password" type="password" ... />       <!-- Password -->
<button type="submit">🚀 Start Your Journey</button>  <!-- Login button -->
```

### Profile Dropdown
```html
<button>👤 admin</button>                         <!-- Profile button -->
<!-- Dropdown menu items -->
<button>👤 My Profile</button>
<button>⚙️ Settings</button>
<button>🚪 Logout</button>
```

For detailed selectors, see `SELENIUM_HTML_GUIDE.md`

## 🔐 Test Credentials

- **Username**: `admin`
- **Password**: `admin123`

## ⚙️ Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `BASE_URL` | `http://localhost:3000` | Frontend URL to test |
| `HEADLESS` | `1` | Run headless (0=show browser) |

**Example:**
```bash
BASE_URL=http://localhost:5173 HEADLESS=0 pytest tests/selenium/test_login_logout_flow.py -v -s
```

## 📊 Generate Test Report

```bash
# Generate HTML report
pytest tests/selenium/test_login_logout_flow.py \
  --html=tests/selenium/report.html \
  --self-contained-html

# View report in browser
open tests/selenium/report.html
```

## 🐛 Troubleshooting

### Connection Refused Error
```
ERROR: Connection refused to http://localhost:3000
```
**Fix**: Make sure frontend is running
```bash
cd frontend
npm run build
npm run preview -- --host 0.0.0.0 --port 3000
```

### Timeout Waiting for Elements
**Cause**: Frontend is slow or has errors
**Fix 1**: Check browser console for JavaScript errors:
```bash
HEADLESS=0 pytest tests/selenium/test_login_logout_flow.py -v -s
```
**Fix 2**: Increase timeout in test (change 10 to 20):
```python
wait = WebDriverWait(driver, 20)
```

### Tests Pass Locally but Fail in CI/CD
**Fix**: Ensure Chrome/Chromium is installed:
```bash
# Ubuntu/Debian
sudo apt-get install chromium-browser

# macOS (homebrew)
brew install chromium
```

### Browser Window Doesn't Close
**Normal behavior**: When using `HEADLESS=0`, manually close browser after test or press Ctrl+C

## 📚 Documentation

- **`SELENIUM_HTML_GUIDE.md`** - Full guide with UI elements, selectors, and examples
- **`HTML_SNIPPETS.html`** - Quick HTML reference
- **`../requirements-selenium.txt`** - Dependencies list

## 🔄 Running Tests in CI/CD

Example GitHub Actions workflow:
```yaml
- name: Run Selenium Tests
  env:
    BASE_URL: http://localhost:3000
    HEADLESS: 1
  run: |
    pip install -r tests/selenium/requirements-selenium.txt
    pytest tests/selenium/test_login_logout_flow.py -v --html=report.html
```

## 📖 What Each Component Tests

### LoginPage.tsx
- Username input field (`id="username"`)
- Password input field (`id="password"`)
- Login button with text "🚀 Start Your Journey"
- Error message for invalid credentials

### Navigation.tsx
- Profile button showing username (`👤 admin`)
- Dropdown menu with options:
  - `👤 My Profile`
  - `⚙️ Settings`
  - `🚪 Logout`

### AuthContext
- Login/logout state management
- Token handling
- User authentication

## ✅ Checklist Before Running Tests

- [ ] Chrome/Chromium browser installed
- [ ] Python 3.8+ installed
- [ ] Dependencies installed: `pip install -r requirements-selenium.txt`
- [ ] Frontend running on http://localhost:3000
- [ ] Admin account available (admin/admin123)
- [ ] No firewalls blocking localhost:3000

## 🎯 Common Commands

```bash
# Quick test (headless)
pytest tests/selenium/test_login_logout_flow.py -q

# Verbose with browser visible
HEADLESS=0 pytest tests/selenium/test_login_logout_flow.py -v -s

# Only logout test with custom URL
BASE_URL=http://localhost:5173 pytest tests/selenium/test_login_logout_flow.py::test_logout_flow -v

# With report generation
pytest tests/selenium/test_login_logout_flow.py --html=report.html --self-contained-html

# Quiet mode
pytest tests/selenium/test_login_logout_flow.py -q

# Stop on first failure
pytest tests/selenium/test_login_logout_flow.py -x

# Show print statements
pytest tests/selenium/test_login_logout_flow.py -s
```

## 📞 Support

For issues with selectors or element identification, check:
1. `SELENIUM_HTML_GUIDE.md` - Full reference guide
2. `HTML_SNIPPETS.html` - Quick snippets
3. Run tests with `HEADLESS=0` to visually inspect

---

**Last Updated**: May 2026  
**Framework**: Selenium 4.8+  
**Browser**: Chrome (via webdriver-manager)

