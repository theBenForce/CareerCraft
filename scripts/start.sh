#!/bin/bash

# Career Craft Startup Script
echo "🚀 Starting Career Craft..."

# Check if this is the first run
if [ ! -f "prisma/dev.db" ] && [ "$DATABASE_PROVIDER" = "sqlite" ]; then
    echo "📦 Setting up database for first time..."
    npm run db:push
    npm run db:seed
    echo "✅ Database initialized with sample data"
fi

# For PostgreSQL, check if database exists and initialize if needed
if [ "$DATABASE_PROVIDER" = "postgresql" ]; then
    echo "🐘 Setting up PostgreSQL database..."
    npm run db:push
    npm run db:seed
    echo "✅ PostgreSQL database initialized"
fi

# Start the application
echo "🌟 Starting the application..."
if [ "$NODE_ENV" = "production" ]; then
    npm start
else
    npm run dev
fi
