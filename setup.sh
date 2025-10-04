#!/bin/bash

echo "🚀 Setting up MentiConnect Full Stack..."

# Backend setup
echo "📦 Setting up backend..."
cd menti-connect-backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Create .env for backend if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cat > .env << EOF
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

# Email Configuration (for notifications)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-ethereal-email
EMAIL_PASS=your-ethereal-password

# Environment
NODE_ENV=development
PORT=5001
EOF
    echo "✅ Backend .env created"
fi

# Start backend in background
echo "🚀 Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Frontend setup
echo "📦 Setting up frontend..."
cd ../menti-connect-frontend

# Create .env for frontend
if [ ! -f .env ]; then
    echo "VITE_API_URL=http://localhost:5001" > .env
    echo "✅ Frontend .env created"
fi

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "To start the frontend, run:"
echo "cd menti-connect-frontend && npm run dev"
echo ""
echo "Backend is already running in the background!"
