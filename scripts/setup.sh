#!/bin/bash

# LIBERO Italia Setup Script
# This script automates the setup of both client and server environments.

set -e

echo "🚀 Starting LIBERO Italia setup..."

# 1. Install Server Dependencies
echo "📦 Installing server dependencies..."
mkdir -p server/node_modules
cd server
npm install

# 2. Setup Database
echo "🗄️ Setting up database..."
npx prisma generate
if [ ! -f "dev.db" ]; then
    echo "Initializing database..."
    npx prisma migrate dev --name init
    node src/seed.js
else
    echo "Database already exists. Running migrate deploy for idempotency..."
    npx prisma migrate deploy
fi

# 3. Install Client Dependencies
echo "📦 Installing client dependencies..."
cd ../client
mkdir -p node_modules
npm install --legacy-peer-deps

echo "✨ Setup complete! You can now start developed mode with 'npm run dev' in both directories."
