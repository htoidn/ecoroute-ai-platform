#!/bin/bash

# Start EcoRoute AI Platform Dev Server
# This script starts the frontend development server and opens it in the browser

cd /Users/hdee/development/git/ecoroute-ai-platform/frontend

echo "=================================="
echo "🚀 Starting EcoRoute AI Frontend"
echo "=================================="
echo ""
echo "Steps:"
echo "1. Starting development server..."
echo "2. Server will be at: http://localhost:5173"
echo "3. Log in with your credentials"
echo "4. You should see:"
echo "   ✓ Green navigation banner with menu items"
echo "   ✓ Top 5 Destinations on recommendation detail pages"
echo ""

# Kill any existing vite process
pkill -f "vite" 2>/dev/null || true

sleep 2

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the dev server
echo ""
echo "▶️  Starting dev server..."
npm run dev

