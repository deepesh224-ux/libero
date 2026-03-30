#!/bin/bash

# LIBERO Italia Setup Script
# This script automates the setup of both client and server environments.

set -e

echo "🚀 Starting LIBERO Italia setup..."

# 1. Install Server Dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# 2. Setup Database
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma migrate dev --name init
node src/seed.js

# 3. Install Client Dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

echo "✨ Setup complete! You can now start developed mode with 'npm run dev' in both directories."
