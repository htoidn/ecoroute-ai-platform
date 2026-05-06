# Database Setup Guide

## Current Status
The application is running but the `destinations` table doesn't exist yet in the PostgreSQL database. The API currently returns an empty list because we've added error handling for the missing table.

## Database Permissions Issue
The application user (`ecoroute_hdnh`) doesn't have permissions to create tables in the `public` schema. This is actually a security best practice - application users should have limited permissions.

## Solution 1: Using the Init Script (Recommended)

A database administrator or superuser should execute the initialization script:

```bash
# If you have psql installed and can connect as an admin user:
psql -U <admin_username> -d ecoroute -f backend/src/main/resources/db/init.sql
```

The init.sql file:
- Creates the `destinations` table
- Grants appropriate permissions to `ecoroute_hdnh`
- Inserts sample data for 40 German cities

File location: `backend/src/main/resources/db/init.sql`

## Solution 2: Manual SQL Execution

Connect to PostgreSQL database using a GUI tool (pgAdmin, DBeaver, etc.) or command line and execute the commands from `init.sql` manually as an admin/superuser.

## Solution 3: Grant Permissions to Application User

If you want the application user to have schema creation rights, a DBA can execute:

```sql
-- Connect as superuser/admin first
ALTER ROLE ecoroute_hdnh WITH SUPERUSER; -- or more restrictive permissions
-- Then re-run the application  (not recommended for production)
```

## Verifying the Setup

After running the init.sql script, verify the table exists:

```bash
psql -U ecoroute_hdnh -h localhost -d ecoroute -c "SELECT COUNT(*) FROM destinations;"
```

Then test the API:

```bash
curl http://localhost:8080/api/destinations
```

You should see a JSON array with 40 destination records.

## API Endpoints

Once the table is set up:

- **GET /api/destinations** - Get all destinations
- **POST /api/destinations** - Create a new destination
- **GET /api/destinations/{id}** - Get destination by ID

## Application Configuration

Current application settings (`application.yml`):
- JPA `ddl-auto` is set to `none` - Hibernate won't auto-create tables
- Datasource uses credentials from `.env` file
- Database: PostgreSQL 15.17

## Next Steps

1. Have a database administrator run the `init.sql` script
2. Restart the application
3. Call the API endpoints to verify everything works

