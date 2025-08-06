# Offers API Testing Guide

This guide explains how to test the offers API routes with both unit tests and integration tests against your real backend server.

## Test Files Overview

### 1. Unit Tests (`__tests__/api/offers.test.ts`)
- **Purpose**: Test the API route logic with mocked dependencies
- **Coverage**: Authentication, error handling, request/response validation
- **Dependencies**: None (all external services are mocked)
- **Runtime**: Fast (< 1 second)

### 2. Integration Tests (`__tests__/api/offers.integration.test.ts`)
- **Purpose**: Test the API routes against your actual backend server
- **Coverage**: Real network requests, backend authentication, actual data flow
- **Dependencies**: Running backend server, valid JWT token
- **Runtime**: Slower (network requests)

## Quick Start

### Run Unit Tests Only
```bash
npm test -- __tests__/api/offers.test.ts
```

### Run Integration Tests with Backend
```bash
# Method 1: Using the test runner script
node test-runner.js YOUR_JWT_TOKEN http://localhost:3001/api

# Method 2: Manual setup
# 1. Edit __tests__/api/offers.integration.test.ts
# 2. Replace VALID_JWT_TOKEN with your actual token
# 3. Update BACKEND_API_URL if needed
# 4. Run: npm test -- __tests__/api/offers.integration.test.ts
```

### Run All Tests
```bash
npm test
```

## Getting a JWT Token

You'll need a valid JWT token from your backend server. Here are common ways to get one:

### Option 1: Login Through Your App
1. Start your backend server
2. Login through your frontend application
3. Open browser dev tools → Application → Cookies
4. Find the `token` cookie and copy its value

### Option 2: Direct API Call
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "password": "your-password"}'
```

### Option 3: Backend Admin Panel
If your backend has an admin panel or token generation endpoint, use that to create a test token.

## Backend Requirements

Your backend server must have these endpoints:

### GET /api/getAffDashboard
- **Purpose**: Retrieve offers with pagination
- **Authentication**: Bearer token required
- **Query Parameters**: `page`, `limit`, `search`, `status`, `payoutModel`, `mobileOperator`
- **Response Format**:
```json
{
  "message": "Success",
  "data": {
    "offers": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### POST /api/createOffer
- **Purpose**: Create a new offer
- **Authentication**: Bearer token required
- **Request Body**: Offer data (title, description, payoutModel, etc.)
- **Response Format**:
```json
{
  "message": "Offer created successfully",
  "data": {
    "id": "123",
    "title": "New Offer",
    ...
  }
}
```

### GET /api/health (Optional)
- **Purpose**: Health check endpoint
- **Authentication**: Not required
- **Response**: Any 200 status response

## Test Configuration

### Environment Variables
The tests use these environment variables:
- `BACKEND_API_URL`: Your backend API base URL (default: http://localhost:3001/api)
- `NEXTAUTH_SECRET`: NextAuth secret (set in jest.setup.js)
- `NEXTAUTH_URL`: NextAuth URL (set in jest.setup.js)

### Jest Configuration
- **Config File**: `jest.config.js`
- **Setup File**: `jest.setup.js`
- **Test Environment**: Node.js
- **Timeout**: 10 seconds (30 seconds for integration tests)

## Understanding Test Results

### Unit Test Results
```
✅ should return 401 if no session
✅ should return 401 if no token in cookies
✅ should successfully fetch offers from backend
✅ should handle backend API errors
✅ should handle fetch exceptions
✅ should handle query parameters correctly
```

### Integration Test Results
```
✅ should successfully fetch real offers from backend
✅ should handle backend authentication errors
✅ should handle query parameters with real backend
✅ should successfully create offer with real backend
✅ should handle validation errors from real backend
✅ should handle authentication errors for POST
✅ should be able to connect to backend server
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors
```bash
npm install --save-dev @types/jest
```

#### 2. "Network error" or "ECONNREFUSED"
- Ensure your backend server is running
- Check the backend URL in the test configuration
- Verify firewall/network settings

#### 3. "401 Unauthorized" errors
- Verify your JWT token is valid and not expired
- Check if the token format matches what your backend expects
- Ensure the `Authorization: Bearer TOKEN` header is correct

#### 4. "Timeout" errors
- Increase timeout in jest.config.js
- Check if backend is responding slowly
- Verify network connectivity

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```

## Test Scripts

Available npm scripts:
- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

## Advanced Usage

### Custom Backend URL
```javascript
// In your test file
process.env.BACKEND_API_URL = 'https://your-backend.com/api'
```

### Multiple Tokens
You can test with different tokens by updating the `VALID_JWT_TOKEN` constant:
```javascript
const ADMIN_TOKEN = 'admin-jwt-token'
const USER_TOKEN = 'user-jwt-token'
```

### Mock vs Real Backend
The tests are designed to work with both:
- **Unit tests**: Always use mocks (fast, reliable)
- **Integration tests**: Use real backend (comprehensive, realistic)

## Best Practices

1. **Run unit tests frequently** during development
2. **Run integration tests** before deploying
3. **Use fresh tokens** for integration tests
4. **Mock external dependencies** in unit tests
5. **Test error scenarios** thoroughly
6. **Keep test data minimal** and focused

## Next Steps

After your tests pass:
1. Integrate the API routes with your frontend
2. Add more comprehensive error handling
3. Implement rate limiting and security measures
4. Add monitoring and logging
5. Create end-to-end tests for complete user flows

## Support

If you encounter issues:
1. Check the test output for specific error messages
2. Verify your backend server is running and accessible
3. Ensure your JWT token is valid
4. Check network connectivity
5. Review the backend API documentation

The tests are designed to be comprehensive and provide clear feedback about what's working and what needs attention.
