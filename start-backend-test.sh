#!/bin/bash

echo "🚀 Starting Backend Server for Testing"
echo "======================================="

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
if [ ! -d "menti-connect-backend" ]; then
    print_error "Please run this script from the MentiConnect root directory"
    exit 1
fi

# Go to backend directory
cd menti-connect-backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
fi

# Start the backend server
print_info "Starting backend server on port 5001..."
print_info "The server will run in the background"
print_info "Press Ctrl+C to stop the server"
print_info ""

# Start server in background
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    print_status "Backend server started successfully (PID: $SERVER_PID)"
    print_info "Server URL: http://localhost:5001"
    print_info "Health Check: http://localhost:5001/health"
    print_info "API Root: http://localhost:5001/"
    print_info ""
    print_info "🧪 Testing Server Endpoints..."
    
    # Test health endpoint
    if curl -s http://localhost:5001/health > /dev/null; then
        print_status "Health endpoint working"
    else
        print_warning "Health endpoint not responding"
    fi
    
    # Test root endpoint
    if curl -s http://localhost:5001/ > /dev/null; then
        print_status "Root endpoint working"
    else
        print_warning "Root endpoint not responding"
    fi
    
    # Test GitHub OAuth endpoint
    if curl -s -I http://localhost:5001/auth/github | grep -q "302"; then
        print_status "GitHub OAuth endpoint working (redirects properly)"
    else
        print_warning "GitHub OAuth endpoint not responding correctly"
    fi
    
    print_info ""
    print_info "🎯 Backend is ready for testing!"
    print_info ""
    print_info "📋 Available Endpoints:"
    print_info "  • GET  /health - Health check"
    print_info "  • GET  / - API root"
    print_info "  • GET  /auth/github - GitHub OAuth login"
    print_info "  • GET  /api/users/me - Get current user (requires auth)"
    print_info "  • GET  /api/dashboard - Dashboard data (requires auth)"
    print_info "  • GET  /api/goals - User goals (requires auth)"
    print_info "  • GET  /api/analytics/github - GitHub analytics (requires auth)"
    print_info "  • GET  /api/matches - Potential matches (requires auth)"
    print_info "  • GET  /api/chat/conversations - Chat conversations (requires auth)"
    print_info ""
    print_info "🔐 To test authenticated endpoints:"
    print_info "  1. Visit http://localhost:5001/auth/github"
    print_info "  2. Complete GitHub OAuth flow"
    print_info "  3. Use the JWT token in Authorization header"
    print_info ""
    print_info "📱 To test with frontend:"
    print_info "  1. Open another terminal"
    print_info "  2. cd menti-connect-frontend"
    print_info "  3. npm run dev"
    print_info "  4. Visit http://localhost:3000"
    print_info ""
    print_info "🛑 Press Ctrl+C to stop the server"
    
    # Wait for user to stop
    wait $SERVER_PID
else
    print_error "Failed to start backend server"
    exit 1
fi
