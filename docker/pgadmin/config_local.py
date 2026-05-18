# pgAdmin local configuration to run in desktop/server-less mode
# This disables the login screen and keeps the UI available for development when running containerized pgAdmin.
# Use with caution — only for local development.

SERVER_MODE = False

# You can tweak session cookie settings if needed
SESSION_COOKIE_NAME = 'pgadmin_session'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = None

