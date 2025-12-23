# Notes Hub - Complete Setup Guide

This guide will walk you through setting up the Notes Hub application from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [PostgreSQL Setup](#postgresql-setup)
3. [Project Setup](#project-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 18+ - [Download here](https://nodejs.org/)
- **pnpm** 10+ - [Installation guide](https://pnpm.io/installation)
- **PostgreSQL** 12+ - [Download here](https://www.postgresql.org/download/)
- **Git** (optional, for cloning)

### Check Installed Versions

```bash
node --version       # Should be v18.0.0 or higher
pnpm --version       # Should be 10.0.0 or higher
psql --version       # Should be PostgreSQL 12 or higher
```

## PostgreSQL Setup

### macOS (Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify PostgreSQL is running
psql --version
```

### Windows

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. During installation:
   - Set password for `postgres` user (remember this!)
   - Keep the default port `5432`
   - Enable `pgAdmin 4` if desired
4. PostgreSQL will start automatically

### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Verify it's running
sudo systemctl status postgresql
```

### Docker (Alternative)

If you have Docker installed, you can run PostgreSQL in a container:

```bash
docker run --name postgres-notes \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=notes_hub \
  -p 5432:5432 \
  -d postgres:15
```

## Create Database and User

### Using psql Command Line

1. **Connect to PostgreSQL**
   ```bash
   psql -U postgres
   ```
   (You may be prompted for the password you set during installation)

2. **Create the database**
   ```sql
   CREATE DATABASE notes_hub;
   ```

3. **Create user (if not using default postgres user)**
   ```sql
   CREATE USER notes_user WITH PASSWORD 'secure_password_here';
   GRANT ALL PRIVILEGES ON DATABASE notes_hub TO notes_user;
   ```

4. **Verify the database**
   ```sql
   \l
   ```
   You should see `notes_hub` in the list.

5. **Exit psql**
   ```sql
   \q
   ```

### Using pgAdmin (GUI)

1. Open pgAdmin 4
2. Right-click on "Databases"
3. Create → Database
4. Name: `notes_hub`
5. Click "Create"

## Project Setup

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd notes-hub

# Or extract the downloaded ZIP file
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all Node.js dependencies listed in `package.json`.

### 3. Verify Installation

```bash
pnpm --version
node --version
```

## Environment Configuration

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Database Connection

Edit `.env` file with your PostgreSQL credentials:

```env
# Database Configuration
# These values must match your PostgreSQL setup
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notes_hub

# API Configuration
# This should point to your development server
VITE_API_BASE_URL=http://localhost:8080

# Server Configuration (optional)
PING_MESSAGE=pong
```

### Example Configurations

**If using Docker PostgreSQL:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notes_hub
```

**If using custom user:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=notes_user
DB_PASSWORD=secure_password_here
DB_NAME=notes_hub
```

**If PostgreSQL is on different machine:**
```env
DB_HOST=192.168.1.100
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=notes_hub
```

## Running the Application

### Development Server

Start the development server with hot reload:

```bash
pnpm dev
```

The application will be available at:
- **Local**: http://localhost:8080
- **Network**: http://your-ip:8080

### Initial Console Output

You should see something like:

```
Failed to initialize database: Error: connect ECONNREFUSED
(This is OK - it will initialize when you first access the app)

  VITE v7.1.2  ready in 266 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://your-ip:8080/
```

The error about database initialization is normal if PostgreSQL isn't ready yet. The database will initialize on the first API request.

## Verification

### 1. Check Frontend

Open http://localhost:8080 in your browser.

You should see:
- **Notes Hub** logo in the top left
- **Navigation menu** with Dashboard and Create Note links
- **"No notes yet"** empty state message

### 2. Check Database Connection

Once the frontend loads, click "Create Your First Note" and:

1. Enter a title (e.g., "Test Note")
2. Enter content (e.g., "This is a test")
3. Click "Create Note"

If successful:
- You'll be redirected to the dashboard
- Your note will appear in the list
- The database connection is working!

### 3. Test All Features

**Dashboard:**
- View list of notes
- Click note cards to view details
- Edit notes
- Delete notes

**Create Note:**
- Fill form and create a new note
- Validation errors appear for invalid input

**View Note:**
- See full note content
- Timestamp information
- Edit or delete buttons

**Edit Note:**
- Modify title and content
- Save changes
- See updated timestamp

## Build for Production

### Create Production Build

```bash
pnpm build
```

This creates:
- Frontend build in `dist/spa/`
- Server build in `dist/server/`

### Run Production Server

```bash
pnpm start
```

The server will start on port 8080 (or the port specified in your config).

## Troubleshooting

### Database Connection Errors

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Services app for PostgreSQL service
   ```

2. Verify credentials in `.env` file match your setup

3. Test connection with psql:
   ```bash
   psql -h localhost -U postgres -d notes_hub
   ```

4. Restart PostgreSQL:
   ```bash
   # macOS
   brew services restart postgresql@15
   
   # Linux
   sudo systemctl restart postgresql
   ```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::8080`

**Solution:** Kill the process using port 8080:
```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Dependencies Installation Failed

**Error:** When running `pnpm install`

**Solutions:**
1. Clear cache:
   ```bash
   pnpm store prune
   pnpm install
   ```

2. Use npm instead:
   ```bash
   npm install
   ```

### Vite Config Error

**Error:** `Cannot find package 'pg'`

**Solution:** Reinstall dependencies with --no-frozen-lockfile:
```bash
pnpm install --no-frozen-lockfile
```

### API Requests Failing

**Error:** In browser console: `Failed to create note`

**Solutions:**
1. Check server console for detailed error
2. Verify PostgreSQL is running
3. Verify `.env` database credentials
4. Check network tab in browser DevTools

### Blank Page Loading

**Solutions:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)
2. Clear browser cache
3. Check browser console (F12) for JavaScript errors
4. Check that dev server is running

## Environment Variables Reference

| Variable | Purpose | Default | Example |
|----------|---------|---------|---------|
| `DB_HOST` | PostgreSQL host | - | `localhost` |
| `DB_PORT` | PostgreSQL port | - | `5432` |
| `DB_USER` | PostgreSQL username | - | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | - | `postgres` |
| `DB_NAME` | Database name | - | `notes_hub` |
| `VITE_API_BASE_URL` | Frontend API base URL | - | `http://localhost:8080` |
| `PING_MESSAGE` | Ping endpoint response | `ping` | `pong` |

## Next Steps

Once your setup is complete:

1. **Create your first note** to test the full flow
2. **Explore the codebase** in the documented structure
3. **Review the README.md** for API documentation
4. **Customize** the design and features as needed
5. **Deploy** using your preferred hosting platform

## Support & Documentation

- **Main README**: See `README.md` for feature overview
- **API Docs**: See "API Endpoints" section in `README.md`
- **Code Structure**: See "Project Structure" section in `README.md`
- **Browser Console**: Check for JavaScript errors (F12)
- **Server Logs**: Check terminal where `pnpm dev` is running

## Common Questions

### Q: Can I use MySQL instead of PostgreSQL?

A: The current setup uses PostgreSQL. To use MySQL, you would need to:
1. Replace the `pg` package with `mysql2`
2. Update the database initialization SQL syntax
3. Update the connection string format

### Q: How do I reset the database?

A: To clear all notes:
```bash
psql -U postgres -d notes_hub
DROP TABLE IF EXISTS notes;
```

### Q: Can I deploy this to production?

A: Yes! The setup is production-ready. For deployment:
1. Use `pnpm build` to create optimized builds
2. Set up PostgreSQL on your production server
3. Update `.env` with production credentials
4. Run `pnpm start` to start the server
5. Configure your domain/hosting

### Q: What's the minimum hardware needed?

A: Very minimal:
- CPU: 1 core minimum
- RAM: 512MB minimum (1GB recommended)
- Disk: 100MB minimum
- Database: PostgreSQL 12+

---

**You're all set! Happy note-taking! 📝**
