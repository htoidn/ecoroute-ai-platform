# pgAdmin local configuration to run in desktop/server-less mode
# This disables the login screen and keeps the UI available for development when running containerized pgAdmin.
# Use with caution — only for local development.
SERVER_MODE = False

# Disable enhanced cookie protection to allow auto-login in desktop mode
ENHANCED_COOKIE_PROTECTION = False

# Session cookie settings
SESSION_COOKIE_NAME = 'pgadmin_session'
SESSION_COOKIE_HTTPONLY = False
SESSION_COOKIE_SAMESITE = 'Lax'

# Set session default timeout to a high value (in minutes)
SESSION_DEFAULT_TIMEOUT = 1440

# Set master password for desktop mode
MASTER_PASSWORD = 'admin123'

# Disable password check for desktop mode
ALLOW_SAVE_PASSWORD = True

