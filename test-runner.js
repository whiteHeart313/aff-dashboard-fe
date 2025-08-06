#!/usr/bin/env node

/**
 * Test Runner for Offers API
 * 
 * This script helps you run the offers API tests with your actual backend server.
 * 
 * Usage:
 * node test-runner.js [token] [backend-url]
 * 
 * Examples:
 * node test-runner.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... http://localhost:3001/api
 * node test-runner.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (uses default backend URL)
 * node test-runner.js (runs unit tests only)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const token = args[0];
const backendUrl = args[1] || 'http://localhost:3001/api';

console.log('🚀 Offers API Test Runner');
console.log('========================');

if (!token) {
  console.log('⚠️  No JWT token provided. Running unit tests only...');
  console.log('');
  console.log('To run integration tests with your backend:');
  console.log('node test-runner.js YOUR_JWT_TOKEN [BACKEND_URL]');
  console.log('');
  
  // Run unit tests only
  runTests(['__tests__/api/offers.test.ts']);
} else {
  console.log(`🔑 Using JWT token: ${token.substring(0, 20)}...`);
  console.log(`🌐 Backend URL: ${backendUrl}`);
  console.log('');
  
  // Update the integration test file with the actual token
  updateIntegrationTestToken(token, backendUrl);
  
  // Run all tests
  runTests();
}

function updateIntegrationTestToken(token, backendUrl) {
  const integrationTestFile = path.join(__dirname, '__tests__', 'api', 'offers.integration.test.ts');
  
  try {
    let content = fs.readFileSync(integrationTestFile, 'utf8');
    
    // Replace the token placeholder
    content = content.replace(
      /const VALID_JWT_TOKEN = 'your-valid-jwt-token-here'/,
      `const VALID_JWT_TOKEN = '${token}'`
    );
    
    // Update the backend URL
    content = content.replace(
      /process\.env\.BACKEND_API_URL = 'http:\/\/localhost:3001\/api'/,
      `process.env.BACKEND_API_URL = '${backendUrl}'`
    );
    
    fs.writeFileSync(integrationTestFile, content, 'utf8');
    console.log('✅ Integration test file updated with your token and backend URL');
  } catch (error) {
    console.error('❌ Error updating integration test file:', error.message);
    process.exit(1);
  }
}

function runTests(testFiles = []) {
  console.log('🧪 Running tests...');
  console.log('');
  
  const jestArgs = ['test'];
  if (testFiles.length > 0) {
    jestArgs.push('--', ...testFiles);
  }
  
  const testProcess = spawn('npm', jestArgs, {
    stdio: 'inherit',
    shell: true
  });
  
  testProcess.on('close', (code) => {
    console.log('');
    if (code === 0) {
      console.log('✅ All tests passed!');
      if (token) {
        console.log('');
        console.log('🎉 Your offers API is working correctly with the backend server!');
        console.log('');
        console.log('Next steps:');
        console.log('- Your API routes are properly authenticated');
        console.log('- JWT tokens are being sent correctly to the backend');
        console.log('- Error handling is working as expected');
        console.log('- You can now integrate this API with your frontend');
      }
    } else {
      console.log(`❌ Tests failed with exit code ${code}`);
      if (token) {
        console.log('');
        console.log('Possible issues:');
        console.log('- Backend server is not running');
        console.log('- JWT token is invalid or expired');
        console.log('- Backend API endpoints are not available');
        console.log('- Network connectivity issues');
      }
    }
  });
  
  testProcess.on('error', (error) => {
    console.error('❌ Error running tests:', error.message);
    process.exit(1);
  });
}
