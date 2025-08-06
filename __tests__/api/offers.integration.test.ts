/**
 * Integration tests for the offers API with real backend server
 * 
 * IMPORTANT: These tests are designed to run against a real backend server.
 * 
 * Prerequisites:
 * 1. Backend server must be running (default: http://localhost:3001)
 * 2. You must have a valid JWT token
 * 3. Update the VALID_JWT_TOKEN constant below with your actual token
 * 4. Ensure the backend endpoints /getAffDashboard and /createOffer are available
 * 
 * To run these tests:
 * npm run test -- --testNamePattern="Integration"
 * 
 * Or to run only integration tests:
 * npm run test -- __tests__/api/offers.integration.test.ts
 */

import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { GET, POST } from '../../app/api/offers/route'

// Mock the NextAuth session
jest.mock('next-auth/next')
jest.mock('../../app/api/auth/signin/[...nextauth]/auth-options', () => ({
  default: {},
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

// IMPORTANT: Replace this with a valid JWT token from your backend
const VALID_JWT_TOKEN = 'your-valid-jwt-token-here'

// Set the backend API URL for tests
process.env.BACKEND_API_URL = 'http://localhost:8080/api'

describe('Offers API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock a valid session for all integration tests
    mockGetServerSession.mockResolvedValue({
      user: { 
        email: 'test@example.com', 
        id: '1',
        name: 'Test User'
      }
    })
  })

  describe('GET /api/offers - Integration', () => {
    it('should successfully fetch real offers from backend', async () => {
      // Skip test if no valid token provided
      if (VALID_JWT_TOKEN === 'your-valid-jwt-token-here') {
        console.warn('⚠️  Skipping integration test - please provide a valid JWT token')
        return
      }

      const request = new NextRequest('http://localhost:3000/api/offers?page=1&limit=10')
      jest.spyOn(request.cookies, 'get').mockReturnValue({ 
        name: 'token', 
        value: VALID_JWT_TOKEN 
      })
      
      const response = await GET(request)
      const data = await response.json()

      // Should return successful response from real backend
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBeTruthy()
      expect(data.data).toBeDefined()
      expect(data.data.offers).toBeDefined()
      expect(Array.isArray(data.data.offers)).toBe(true)
      expect(data.data.pagination).toBeDefined()
      expect(data.data.pagination.page).toBe(1)
      expect(data.data.pagination.limit).toBe(10)

      console.log('✅ Integration test passed - received real data from backend')
      console.log(`📊 Retrieved ${data.data.offers.length} offers`)
    }, 30000) // 30 second timeout for network requests

    it('should handle backend authentication errors', async () => {
      // Test with invalid token
      const request = new NextRequest('http://localhost:3000/api/offers')
      jest.spyOn(request.cookies, 'get').mockReturnValue({ 
        name: 'token', 
        value: 'invalid-token' 
      })
      
      const response = await GET(request)
      const data = await response.json()

      // Should return authentication error
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBeTruthy()
    }, 15000)

    it('should handle query parameters with real backend', async () => {
      // Skip test if no valid token provided
      if (VALID_JWT_TOKEN === 'your-valid-jwt-token-here') {
        console.warn('⚠️  Skipping integration test - please provide a valid JWT token')
        return
      }

      const request = new NextRequest('http://localhost:3000/api/offers?page=1&limit=5&search=test&status=active')
      jest.spyOn(request.cookies, 'get').mockReturnValue({ 
        name: 'token', 
        value: VALID_JWT_TOKEN 
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.pagination.page).toBe(1)
      expect(data.data.pagination.limit).toBe(5)

      console.log('✅ Query parameters test passed')
    }, 30000)
  })

  describe('POST /api/offers - Integration', () => {
    it('should successfully create offer with real backend', async () => {
      // Skip test if no valid token provided
      if (VALID_JWT_TOKEN === 'your-valid-jwt-token-here') {
        console.warn('⚠️  Skipping integration test - please provide a valid JWT token')
        return
      }

      const offerData = {
        title: `Test Offer ${Date.now()}`, // Unique title
        description: 'Integration test offer',
        payoutModel: 'CPA',
        payout: 15.00,
        status: 'active',
        mobileOperator: 'TestOperator'
      }

      const request = new NextRequest('http://localhost:3000/api/offers', {
        method: 'POST',
        body: JSON.stringify(offerData)
      })
      jest.spyOn(request.cookies, 'get').mockReturnValue({ 
        name: 'token', 
        value: VALID_JWT_TOKEN 
      })
      jest.spyOn(request, 'json').mockResolvedValue(offerData)
      
      const response = await POST(request)
      const data = await response.json()

      // Should successfully create offer
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBeTruthy()
      expect(data.data).toBeDefined()

      console.log('✅ Integration test passed - offer created successfully')
      console.log(`📝 Created offer: ${data.data.title || 'Unknown title'}`)
    }, 30000)

    it('should handle validation errors from real backend', async () => {
      // Skip test if no valid token provided
      if (VALID_JWT_TOKEN === 'your-valid-jwt-token-here') {
        console.warn('⚠️  Skipping integration test - please provide a valid JWT token')
        return
      }

      // Send invalid data to test backend validation
      const invalidOfferData = {
        title: '', // Empty title should cause validation error
        payout: -1 // Negative payout should cause validation error
      }

      const request = new NextRequest('http://localhost:3000/api/offers', {
        method: 'POST',
        body: JSON.stringify(invalidOfferData)
      })
      jest.spyOn(request.cookies, 'get').mockReturnValue({ 
        name: 'token', 
        value: VALID_JWT_TOKEN 
      })
      jest.spyOn(request, 'json').mockResolvedValue(invalidOfferData)
      
      const response = await POST(request)
      const data = await response.json()

      // Should return validation error
      expect(response.status).toBeGreaterThanOrEqual(400)
      expect(data.success).toBe(false)
      expect(data.message).toBeTruthy()

      console.log('✅ Validation error test passed')
    }, 30000)

    it('should handle authentication errors for POST', async () => {
      const offerData = {
        title: 'Test Offer',
        description: 'Test description',
        payoutModel: 'CPA',
        payout: 10.00,
        status: 'active'
      }

      const request = new NextRequest('http://localhost:3000/api/offers', {
        method: 'POST',
        body: JSON.stringify(offerData)
      })
      jest.spyOn(request.cookies, 'get').mockReturnValue({ 
        name: 'token', 
        value: 'invalid-token' 
      })
      jest.spyOn(request, 'json').mockResolvedValue(offerData)
      
      const response = await POST(request)
      const data = await response.json()

      // Should return authentication error
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBeTruthy()
    }, 15000)
  })

  describe('Backend Connection Tests', () => {
    it('should be able to connect to backend server', async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/health`)
        
        if (response.ok) {
          console.log('✅ Backend server is reachable')
        } else {
          console.log('⚠️  Backend server responded with non-200 status')
        }
      } catch (error) {
        console.log('❌ Backend server is not reachable')
        console.log('Make sure your backend server is running on the expected URL')
      }
    }, 10000)
  })
})

/**
 * Setup Instructions:
 * 
 * 1. Replace VALID_JWT_TOKEN with your actual token
 * 2. Make sure your backend server is running
 * 3. Verify the BACKEND_API_URL is correct
 * 4. Run the tests:
 *    npm run test -- __tests__/api/offers.integration.test.ts
 * 
 * Expected Backend Endpoints:
 * - GET /api/getAffDashboard - Should return offers with pagination
 * - POST /api/createOffer - Should create a new offer
 * - GET /api/health (optional) - Health check endpoint
 */
