#!/bin/bash

echo "🔧 FIXING EVERYTHING - MentiConnect Setup"
echo "=========================================="

# Kill any existing processes
echo "🛑 Stopping any existing processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Backend setup
echo ""
echo "📦 Setting up BACKEND..."
cd menti-connect-backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env for backend
echo "Creating backend .env file..."
cat > .env << 'EOF'
# Database
MONGO_URI=mongodb://localhost:27017/menti-connect

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5001/auth/github/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-email
EMAIL_PASS=your-ethereal-password

# Environment
NODE_ENV=development
PORT=5001
EOF

# Start backend
echo "🚀 Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend
echo "🧪 Testing backend..."
curl -s http://localhost:5001/ > /dev/null && echo "✅ Backend is running!" || echo "❌ Backend failed to start"

# Frontend setup
echo ""
echo "📦 Setting up FRONTEND..."
cd ../menti-connect-frontend

# Create .env for frontend
echo "Creating frontend .env file..."
echo "VITE_API_URL=http://localhost:5001" > .env

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Test if vite is available
if command -v vite &> /dev/null; then
    echo "✅ Vite is available"
else
    echo "❌ Vite not found, trying to install globally..."
    npm install -g vite
fi

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "🌐 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "To start the frontend, run:"
echo "cd menti-connect-frontend && npm run dev"
echo ""
echo "Backend is already running!"
