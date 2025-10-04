#!/bin/bash

echo "🚀 Starting MentiConnect Frontend..."

cd menti-connect-frontend

# Create .env file
echo "VITE_API_URL=http://localhost:5001" > .env

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting Vite development server..."
npm run dev
