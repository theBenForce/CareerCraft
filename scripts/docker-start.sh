#!/bin/sh
set -e

echo "Running as user: $(whoami) ($(id))"

# Check required environment variables (from .env.example)
REQUIRED_VARS="DATABASE_PROVIDER DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL NODE_ENV UPLOADS_DIR"

for VAR in $REQUIRED_VARS; do
  if [ -z "$(eval echo \"\${$VAR}\")" ]; then
    echo "Error: Required environment variable $VAR is not set."
    MISSING_VAR=1
  fi
done
if [ ! -z "$MISSING_VAR" ]; then
  echo "Exiting due to missing environment variables."
  exit 1
fi

# Set DB_PATH for SQLite
if [ "$DATABASE_PROVIDER" = "sqlite" ]; then
  DB_PATH=$(echo "$DATABASE_URL" | sed 's|^file:||')
  echo "Database path: $DB_PATH"
  
  # Ensure parent directory exists
  DB_DIR="$(dirname "$DB_PATH")"
  echo "Database directory: $DB_DIR"
  
  if [ ! -d "$DB_DIR" ]; then
    echo "Creating parent directory $DB_DIR for SQLite database..."
    mkdir -p "$DB_DIR"
  fi
  
  # Fix permissions if needed (this handles volume mount permission issues)
  if [ ! -w "$DB_DIR" ]; then
    echo "Warning: Cannot write to database directory $DB_DIR"
    echo "Attempting to fix permissions..."
    ls -la "$DB_DIR"
    
    # Try to fix permissions if possible
    if [ "$(id -u)" = "0" ]; then
      chown -R nextjs:nodejs "$DB_DIR"
    else
      echo "Error: Cannot write to database directory and not running as root to fix permissions"
      echo "Please ensure the volume mount has proper permissions (UID:GID 1001:1001)"
      exit 1
    fi
  fi
  
  # Create SQLite database if it doesn't exist
  if [ ! -f "$DB_PATH" ]; then
    echo "SQLite database not found. Creating $DB_PATH..."
    touch "$DB_PATH"
    if [ ! -f "$DB_PATH" ]; then
      echo "Error: Failed to create database file $DB_PATH"
      exit 1
    fi
    echo "Database file created successfully"
  else
    echo "Database file already exists at $DB_PATH"
  fi
fi

# Select the correct schema file based on DATABASE_PROVIDER
if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
  echo "Using PostgreSQL schema..."
  if [ ! -f "prisma/schema-postgres.prisma" ]; then
    echo "Error: PostgreSQL schema file not found!"
    exit 1
  fi
  cp prisma/schema-postgres.prisma prisma/schema.prisma
else
  echo "Using SQLite schema (default)..."
  # Verify the SQLite schema exists and is valid
  if [ ! -f "prisma/schema.prisma" ]; then
    echo "Error: SQLite schema file not found!"
    exit 1
  fi
fi

# Validate schema before proceeding
echo "Validating Prisma schema..."
npx prisma validate || {
  echo "Error: Prisma schema validation failed!"
  exit 1
}

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate || {
  echo "Error: Failed to generate Prisma Client!"
  echo "This might be due to:"
  echo "1. Invalid schema syntax"
  echo "2. Missing dependencies"
  echo "3. Insufficient permissions"
  exit 1
}

# Run Prisma migrations
echo "Running Prisma migrations..."
if [ "$DATABASE_PROVIDER" = "sqlite" ]; then
  # For SQLite, we might need to reset the database if there are migration issues
  echo "Checking SQLite database state..."
  if npx prisma migrate deploy 2>&1 | grep -q "P3005\|not empty"; then
    echo "Database schema is not empty. Attempting to resolve..."
    npx prisma migrate resolve --applied "$(ls prisma/migrations | head -1)" 2>/dev/null || true
    npx prisma migrate deploy || {
      echo "Migration failed. Resetting database..."
      rm -f "$DB_PATH"
      touch "$DB_PATH"
      npx prisma migrate deploy
    }
  else
    npx prisma migrate deploy
  fi
else
  npx prisma migrate deploy
fi

# Seed initial user if needed
echo "Checking for initial user..."
npm run db:seed-initial-user

# Start the Next.js server
exec node server.js
