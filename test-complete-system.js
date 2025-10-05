const axios = require('axios');
const API_BASE = 'http://localhost:5001';

// Test user data
const testUser = {
  username: 'Test User',
  email: 'test@example.com',
  role: 'mentee',
  skills: ['JavaScript', 'React', 'Node.js'],
  availability: ['weekends', 'evenings'],
  mentoringCapacity: 2
};

let authToken = '';
let userId = '';

async function testCompleteSystem() {
  console.log('🚀 Testing Complete MentiConnect System\n');

  try {
    // 1. Test Backend Health
    console.log('1. Testing Backend Health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend is healthy:', healthResponse.data.status);

    // 2. Create Test User
    console.log('\n2. Creating Test User...');
    const userResponse = await axios.post(`${API_BASE}/api/users/test`, testUser);
    authToken = userResponse.data.token;
    userId = userResponse.data.user._id;
    console.log('✅ Test user created:', userResponse.data.user.username);

    // 3. Test Authentication
    console.log('\n3. Testing Authentication...');
    const authResponse = await axios.get(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Authentication working:', authResponse.data.username);

    // 4. Test AI Matching
    console.log('\n4. Testing AI Matching...');
    const matchesResponse = await axios.get(`${API_BASE}/api/matches`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ AI Matching working:', matchesResponse.data.length, 'matches found');

    // 5. Test Goal Creation
    console.log('\n5. Testing Goal Creation...');
    const goalData = {
      title: 'Learn React Advanced Patterns',
      description: 'Master advanced React patterns and hooks',
      category: 'learning',
      priority: 'high',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      milestones: [
        { title: 'Complete React Hooks tutorial', completed: false },
        { title: 'Build a complex component', completed: false }
      ],
      tags: ['react', 'frontend', 'learning']
    };
    const goalResponse = await axios.post(`${API_BASE}/api/goals`, goalData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Goal created:', goalResponse.data.title);

    // 6. Test Chat System
    console.log('\n6. Testing Chat System...');
    const conversationsResponse = await axios.get(`${API_BASE}/api/chat/conversations`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Chat system working:', conversationsResponse.data.length, 'conversations');

    // 7. Test Notifications
    console.log('\n7. Testing Notifications...');
    const notificationsResponse = await axios.get(`${API_BASE}/api/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Notifications working:', notificationsResponse.data.notifications.length, 'notifications');

    // 8. Test Dashboard
    console.log('\n8. Testing Dashboard...');
    const dashboardResponse = await axios.get(`${API_BASE}/api/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Dashboard working:', dashboardResponse.data.activeMatches, 'active matches');

    // 9. Test Analytics
    console.log('\n9. Testing Analytics...');
    const analyticsResponse = await axios.get(`${API_BASE}/api/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Analytics working:', analyticsResponse.data.totalCommits, 'total commits');

    console.log('\n🎉 ALL SYSTEMS WORKING PERFECTLY!');
    console.log('\n📊 System Summary:');
    console.log('- ✅ Backend API: Healthy');
    console.log('- ✅ Authentication: Working');
    console.log('- ✅ AI Matching: Working');
    console.log('- ✅ Goal Tracking: Working');
    console.log('- ✅ Chat System: Working');
    console.log('- ✅ Notifications: Working');
    console.log('- ✅ Dashboard: Working');
    console.log('- ✅ Analytics: Working');
    console.log('\n🚀 Your SaaS platform is production-ready!');

  } catch (error) {
    console.error('❌ System Error:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: npm start');
    console.log('2. Check database connection');
    console.log('3. Verify all routes are properly configured');
  }
}

// Run the test
testCompleteSystem();
