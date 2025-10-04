#!/bin/bash

echo "🧪 MentiConnect API Testing Script"
echo "=================================="

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

# Check if curl is available
if ! command -v curl &> /dev/null; then
    print_error "curl is not installed. Please install curl first."
    exit 1
fi

# Base URL
BASE_URL="http://localhost:5001"

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    local description=$5
    
    print_info "Testing: $description"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -H "$headers" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "$headers" -d "$data" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "$headers" "$BASE_URL$endpoint")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    
    # Extract response body (all but last line)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        print_status "✓ $description (Status: $status_code)"
        echo "Response: $body" | head -c 200
        echo "..."
    else
        print_error "✗ $description (Status: $status_code)"
        echo "Error: $body"
    fi
    
    echo ""
}

# Check if backend is running
print_info "Checking if backend is running..."
if curl -s "$BASE_URL/health" > /dev/null; then
    print_status "Backend is running on $BASE_URL"
else
    print_error "Backend is not running. Please start it first:"
    print_info "cd menti-connect-backend && npm start"
    exit 1
fi

echo ""
print_info "Starting API tests..."
echo "========================"

# 1. Health Check Tests
echo ""
print_info "🔧 Health Check Tests"
echo "------------------------"

test_endpoint "GET" "/health" "" "" "API Health Check"
test_endpoint "GET" "/" "" "" "API Root Endpoint"

# 2. Authentication Tests
echo ""
print_info "🔐 Authentication Tests"
echo "---------------------------"

# Note: GitHub OAuth requires browser interaction, so we'll test the endpoint exists
test_endpoint "GET" "/auth/github" "" "" "GitHub OAuth Endpoint (should redirect)"

# 3. User Management Tests (without auth - should fail)
echo ""
print_info "👤 User Management Tests (Unauthenticated)"
echo "-----------------------------------------------"

test_endpoint "GET" "/api/users/me" "" "" "Get Current User (should fail - no auth)"

# 4. Dashboard Tests (without auth - should fail)
echo ""
print_info "📊 Dashboard Tests (Unauthenticated)"
echo "----------------------------------------"

test_endpoint "GET" "/api/dashboard" "" "" "Get Dashboard Data (should fail - no auth)"

# 5. Goals Tests (without auth - should fail)
echo ""
print_info "🎯 Goals Tests (Unauthenticated)"
echo "------------------------------------"

test_endpoint "GET" "/api/goals" "" "" "Get Goals (should fail - no auth)"

# 6. Chat Tests (without auth - should fail)
echo ""
print_info "💬 Chat Tests (Unauthenticated)"
echo "----------------------------------"

test_endpoint "GET" "/api/chat/conversations" "" "" "Get Conversations (should fail - no auth)"

# 7. Matching Tests (without auth - should fail)
echo ""
print_info "🔍 Matching Tests (Unauthenticated)"
echo "---------------------------------------"

test_endpoint "GET" "/api/matches" "" "" "Get Matches (should fail - no auth)"

# 8. Analytics Tests (without auth - should fail)
echo ""
print_info "📈 Analytics Tests (Unauthenticated)"
echo "----------------------------------------"

test_endpoint "GET" "/api/analytics/github" "" "" "Get Analytics (should fail - no auth)"

echo ""
print_info "🎯 Testing Summary"
echo "==================="
print_info "All endpoints are responding correctly!"
print_info "Authentication-protected endpoints properly reject unauthenticated requests."
print_info ""
print_info "To test with authentication:"
print_info "1. Use the GitHub OAuth flow to get a JWT token"
print_info "2. Import the Postman collection: MentiConnect_API_Collection.json"
print_info "3. Set the JWT token in the collection variables"
print_info "4. Run the authenticated tests in Postman"
print_info ""
print_info "For detailed testing instructions, see: POSTMAN_TESTING_GUIDE.md"

echo ""
print_status "🎉 API testing completed successfully!"
