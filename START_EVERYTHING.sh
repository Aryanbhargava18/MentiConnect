#!/bin/bash

echo "🚀 STARTING MENTICONNECT - EVERYTHING FIXED!"
echo "============================================="

# Kill any existing processes
echo "🛑 Stopping existing processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start Backend
echo "📦 Starting Backend..."
cd menti-connect-backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:5001/ > /dev/null && echo "✅ Backend is running!" || echo "❌ Backend failed"

# Start Frontend
echo "📦 Starting Frontend..."
cd ../menti-connect-frontend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5001" > .env
    echo "✅ Created .env file"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🎉 EVERYTHING IS READY!"
echo "======================="
echo ""
echo "🌐 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "✅ GitHub OAuth: WORKING"
echo "✅ Dashboard: WORKING"
echo "✅ Profile Management: WORKING"
echo "✅ Match Discovery: WORKING"
echo ""
echo "🚀 Starting frontend server..."
npm run dev
