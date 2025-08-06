#!/usr/bin/env node

/**
 * Backend Connection Test
 * 
 * This script tests the connection to your backend server and validates
 * that the required endpoints are available.
 * 
 * Usage:
 * node test-backend.js [backend-url] [jwt-token]
 * 
 * Examples:
 * node test-backend.js http://localhost:3001/api
 * node test-backend.js http://localhost:3001/api your-jwt-token
 */

const args = process.argv.slice(2);
const backendUrl = args[0] || 'http://localhost:3001/api';
const jwtToken = args[1];

console.log('🔍 Backend Connection Test');
console.log('=========================');
console.log(`🌐 Backend URL: ${backendUrl}`);
console.log(`🔑 JWT Token: ${jwtToken ? jwtToken.substring(0, 20) + '...' : 'Not provided'}`);
console.log('');

async function testBackendConnection() {
  // Test 1: Health check or basic connectivity
  console.log('1. Testing basic connectivity...');
  try {
    const response = await fetch(`${backendUrl}/health`);
    if (response.ok) {
      console.log('✅ Health endpoint is available');
    } else {
      console.log('⚠️  Health endpoint returned non-200 status');
    }
  } catch (error) {
    console.log('⚠️  Health endpoint not available (this is optional)');
  }

  // Test 2: Test offers endpoint without token
  console.log('\\n2. Testing offers endpoint without authentication...');
  try {
    const response = await fetch(`${backendUrl}/getAffDashboard?page=1&limit=5`);
    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('✅ Endpoint correctly requires authentication');
    } else if (response.status === 200) {
      console.log('⚠️  Endpoint allows unauthenticated access');
    } else {
      console.log('⚠️  Unexpected response status');
    }
  } catch (error) {
    console.log('❌ Error accessing offers endpoint:', error.message);
  }

  // Test 3: Test with JWT token if provided
  if (jwtToken) {
    console.log('\\n3. Testing offers endpoint with JWT token...');
    try {
      const response = await fetch(`${backendUrl}/getAffDashboard?page=1&limit=5`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📊 Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully authenticated and retrieved data');
        console.log(`📈 Data structure:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Authentication failed or other error');
        console.log(`📝 Error:`, errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }

    // Test 4: Test create offer endpoint
    console.log('\\n4. Testing create offer endpoint...');
    try {
      const testOffer = {
        title: `Test Offer ${Date.now()}`,
        description: 'Test offer created by backend test script',
        payoutModel: 'CPA',
        payout: 10.00,
        status: 'active'
      };

      const response = await fetch(`${backendUrl}/createOffer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testOffer)
      });

      console.log(`📊 Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully created test offer');
        console.log(`📝 Created offer ID:`, data.data?.id || 'Unknown');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Failed to create offer');
        console.log(`📝 Error:`, errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }

  // Summary
  console.log('\\n📋 Summary');
  console.log('===========');
  console.log('If you see ✅ marks above, your backend is ready for testing!');
  console.log('If you see ❌ marks, check:');
  console.log('- Backend server is running');
  console.log('- Backend URL is correct');
  console.log('- JWT token is valid');
  console.log('- Required endpoints are implemented');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run unit tests: npm test -- __tests__/api/offers.test.ts');
  if (jwtToken) {
    console.log('2. Run integration tests: node test-runner.js ' + jwtToken);
  } else {
    console.log('2. Run integration tests: node test-runner.js YOUR_JWT_TOKEN');
  }
  console.log('3. Run all tests: npm test');
}

// Global fetch polyfill for older Node.js versions
if (typeof globalThis.fetch === 'undefined') {
  console.log('⚠️  Fetch not available. Installing node-fetch...');
  try {
    const { default: fetch } = require('node-fetch');
    globalThis.fetch = fetch;
  } catch (error) {
    console.log('❌ node-fetch not installed. Please run: npm install node-fetch');
    process.exit(1);
  }
}

testBackendConnection().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
