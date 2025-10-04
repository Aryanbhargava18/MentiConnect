#!/bin/bash

echo "🚀 Starting Complete MentiConnect SaaS Platform"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "menti-connect-backend" ] || [ ! -d "menti-connect-frontend" ]; then
    print_error "Please run this script from the MentiConnect root directory"
    exit 1
fi

print_info "Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js and npm are available"

# Check if .env file exists in backend
if [ ! -f "menti-connect-backend/.env" ]; then
    print_warning ".env file not found in backend. Creating default .env..."
    cat > menti-connect-backend/.env << EOF
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/menticonnect
JWT_SECRET=your_jwt_secret_key_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=http://localhost:3000
EOF
    print_warning "Please update the .env file with your actual values"
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
cd menti-connect-backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_status "Backend dependencies already installed"
fi

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd ../menti-connect-frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_status "Frontend dependencies already installed"
fi

# Go back to root directory
cd ..

print_info "Starting the complete platform..."

# Function to cleanup background processes
cleanup() {
    print_info "Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
print_info "Starting backend server on port 5001..."
cd menti-connect-backend
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    print_status "Backend server started (PID: $BACKEND_PID)"
else
    print_error "Failed to start backend server"
    exit 1
fi

# Start frontend server
print_info "Starting frontend server on port 3000..."
cd ../menti-connect-frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    print_status "Frontend server started (PID: $FRONTEND_PID)"
else
    print_error "Failed to start frontend server"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Go back to root directory
cd ..

echo ""
echo "🎉 MentiConnect SaaS Platform is now running!"
echo "=============================================="
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📊 Health Check: http://localhost:5001/health"
echo ""
echo "📋 Available Features:"
echo "  • Dashboard with real-time analytics"
echo "  • Profile management with 5 tabs"
echo "  • Settings with 6 comprehensive sections"
echo "  • Goals tracking with sample data"
echo "  • Analytics with GitHub integration"
echo "  • Discovery with AI-powered matching"
echo "  • Real-time chat system"
echo ""
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait
