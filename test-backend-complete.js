#!/usr/bin/env node

console.log('🧪 Complete Backend Testing Script');
console.log('==================================');

const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./menti-connect-backend/models/User');
const connectDB = require('./menti-connect-backend/config/db');

const BASE_URL = 'http://localhost:5001';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabase() {
  log('🔗 Testing Database Connection...', 'blue');
  
  try {
    await connectDB();
    log('✅ Database connected successfully', 'green');
    
    // Test user creation
    const testUser = new User({
      githubId: 'test123456',
      username: 'testuser',
      email: 'test@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      githubAccessToken: 'test_token_123',
      role: 'mentee',
      skills: ['JavaScript', 'React', 'Node.js']
    });
    
    await testUser.save();
    log('✅ User created successfully', 'green');
    
    // Test user retrieval
    const foundUser = await User.findOne({ githubId: 'test123456' });
    if (foundUser) {
      log('✅ User found in database', 'green');
      log(`   Username: ${foundUser.username}`, 'blue');
      log(`   Email: ${foundUser.email}`, 'blue');
      log(`   Skills: ${foundUser.skills.join(', ')}`, 'blue');
    }
    
    // Clean up
    await User.deleteOne({ githubId: 'test123456' });
    log('✅ Test user cleaned up', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Database test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testBackendServer() {
  log('🚀 Testing Backend Server...', 'blue');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    if (healthResponse.status === 200) {
      log('✅ Health endpoint working', 'green');
    }
    
    // Test root endpoint
    const rootResponse = await axios.get(`${BASE_URL}/`);
    if (rootResponse.status === 200) {
      log('✅ Root endpoint working', 'green');
    }
    
    // Test GitHub OAuth endpoint
    try {
      const authResponse = await axios.get(`${BASE_URL}/auth/github`, { 
        maxRedirects: 0,
        validateStatus: (status) => status === 302 
      });
      log('✅ GitHub OAuth endpoint working (redirects properly)', 'green');
    } catch (error) {
      if (error.response && error.response.status === 302) {
        log('✅ GitHub OAuth endpoint working (redirects properly)', 'green');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    log(`❌ Backend server test failed: ${error.message}`, 'red');
    log('   Make sure the backend server is running:', 'yellow');
    log('   cd menti-connect-backend && npm start', 'yellow');
    return false;
  }
}

async function testProtectedEndpoints() {
  log('🔐 Testing Protected Endpoints...', 'blue');
  
  try {
    // Test protected endpoints without auth (should fail)
    const endpoints = [
      '/api/users/me',
      '/api/dashboard',
      '/api/goals',
      '/api/chat/conversations',
      '/api/matches',
      '/api/analytics/github'
    ];
    
    for (const endpoint of endpoints) {
      try {
        await axios.get(`${BASE_URL}${endpoint}`);
        log(`❌ ${endpoint} should require authentication`, 'red');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          log(`✅ ${endpoint} properly requires authentication`, 'green');
        } else {
          log(`⚠️  ${endpoint} unexpected error: ${error.message}`, 'yellow');
        }
      }
    }
    
    return true;
  } catch (error) {
    log(`❌ Protected endpoints test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testAnalyticsEndpoint() {
  log('📊 Testing Analytics Endpoint...', 'blue');
  
  try {
    // Test analytics endpoint without auth
    try {
      await axios.get(`${BASE_URL}/api/analytics/github`);
      log('❌ Analytics endpoint should require authentication', 'red');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        log('✅ Analytics endpoint properly requires authentication', 'green');
      }
    }
    
    return true;
  } catch (error) {
    log(`❌ Analytics test failed: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('🎯 Starting Complete Backend Tests', 'blue');
  log('=====================================', 'blue');
  
  const results = {
    database: false,
    server: false,
    protected: false,
    analytics: false
  };
  
  // Test database
  results.database = await testDatabase();
  
  // Test backend server
  results.server = await testBackendServer();
  
  // Test protected endpoints
  results.protected = await testProtectedEndpoints();
  
  // Test analytics
  results.analytics = await testAnalyticsEndpoint();
  
  // Summary
  log('\n📋 Test Results Summary', 'blue');
  log('=======================', 'blue');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${test.toUpperCase()}: ${status}`, color);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    log('\n🎉 All tests passed! Backend is working correctly.', 'green');
    log('\n📝 Next Steps:', 'blue');
    log('1. Start the backend server: cd menti-connect-backend && npm start', 'yellow');
    log('2. Test with Postman using the collection: MentiConnect_API_Collection.json', 'yellow');
    log('3. Use GitHub OAuth to get a JWT token for authenticated testing', 'yellow');
    log('4. Test the frontend connection: cd menti-connect-frontend && npm run dev', 'yellow');
  } else {
    log('\n❌ Some tests failed. Please check the errors above.', 'red');
    log('\n🔧 Troubleshooting:', 'blue');
    log('1. Make sure MongoDB is running', 'yellow');
    log('2. Check environment variables in .env file', 'yellow');
    log('3. Start the backend server: cd menti-connect-backend && npm start', 'yellow');
  }
  
  // Disconnect from database
  if (results.database) {
    await mongoose.disconnect();
    log('\n🔌 Database disconnected', 'blue');
  }
}

// Run the tests
runAllTests().catch(error => {
  log(`❌ Test runner failed: ${error.message}`, 'red');
  process.exit(1);
});
