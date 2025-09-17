const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test Admin',
  email: 'testadmin@rapidaid.com',
  password: 'password123',
  role: 'SuperAdmin'
};

let authToken = '';

// Test functions
async function testHealthCheck() {
  try {
    console.log('🔍 Testing health check...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  try {
    console.log('\n🔍 Testing user registration...');
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registration passed:', response.data.message);
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error === 'User already exists') {
      console.log('ℹ️  User already exists, continuing...');
      return true;
    }
    console.error('❌ User registration failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUserLogin() {
  try {
    console.log('\n🔍 Testing user login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = response.data.token;
    console.log('✅ User login passed:', response.data.message);
    console.log('🔑 Token received:', authToken.substring(0, 20) + '...');
    return true;
  } catch (error) {
    console.error('❌ User login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetCurrentUser() {
  try {
    console.log('\n🔍 Testing get current user...');
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get current user passed:', response.data.message);
    console.log('👤 User data:', {
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role,
      status: response.data.user.status
    });
    return true;
  } catch (error) {
    console.error('❌ Get current user failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetUsers() {
  try {
    console.log('\n🔍 Testing get users (requires Manager+ role)...');
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get users passed:', response.data.message);
    console.log(`📊 Found ${response.data.users.length} users out of ${response.data.total} total`);
    return true;
  } catch (error) {
    console.error('❌ Get users failed:', error.response?.data || error.message);
    return false;
  }
}

async function testUserStats() {
  try {
    console.log('\n🔍 Testing user statistics...');
    const response = await axios.get(`${BASE_URL}/users/stats/overview`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User stats passed:', response.data.message);
    console.log('📈 Statistics:', response.data.stats);
    return true;
  } catch (error) {
    console.error('❌ User stats failed:', error.response?.data || error.message);
    return false;
  }
}

async function testChangePassword() {
  try {
    console.log('\n🔍 Testing password change...');
    const response = await axios.put(`${BASE_URL}/auth/change-password`, {
      currentPassword: testUser.password,
      newPassword: 'newpassword123'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Password change passed:', response.data.message);
    
    // Change back to original password
    await axios.put(`${BASE_URL}/auth/change-password`, {
      currentPassword: 'newpassword123',
      newPassword: testUser.password
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('🔄 Password changed back to original');
    return true;
  } catch (error) {
    console.error('❌ Password change failed:', error.response?.data || error.message);
    return false;
  }
}

async function testLogout() {
  try {
    console.log('\n🔍 Testing logout...');
    const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Logout passed:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ Logout failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting RapidAid Authentication System Tests\n');
  
  const tests = [
    testHealthCheck,
    testUserRegistration,
    testUserLogin,
    testGetCurrentUser,
    testGetUsers,
    testUserStats,
    testChangePassword,
    testLogout
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const result = await test();
    if (result) passedTests++;
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('='.repeat(50));
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testUser
};
