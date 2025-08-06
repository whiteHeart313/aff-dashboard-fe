import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { GET, POST } from '../../app/api/offers/route'

// Mock the dependencies
jest.mock('next-auth/next')
jest.mock('../../app/api/auth/signin/[...nextauth]/auth-options', () => ({
  default: {},
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

describe('/api/offers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset fetch mock
    global.fetch = jest.fn()
  })

  describe('GET /api/offers', () => {
    it('should return 401 if no session', async () => {
      mockGetServerSession.mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/offers')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Unauthorized request')
    })

    it('should return 401 if no token in cookies', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const request = new NextRequest('http://localhost:3000/api/offers')
      // Mock cookies.get to return undefined
      jest.spyOn(request.cookies, 'get').mockReturnValue(undefined)
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No authentication token found')
    })

    it('should successfully fetch offers from backend', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'
      const mockBackendResponse = {
        message: 'Offers retrieved successfully',
        data: {
          offers: [
            {
              id: '1',
              title: 'Test Offer 1',
              status: 'active',
              payoutModel: 'CPA',
              mobileOperator: 'Vodafone'
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1
          }
        }
      }

      // Mock fetch to return successful response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse)
      })

      const request = new NextRequest('http://localhost:3000/api/offers?page=1&limit=10')
      jest.spyOn(request.cookies, 'get').mockReturnValue({
          name: 'token',
          value: mockToken
      })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Offers retrieved successfully')
      expect(data.data.offers).toHaveLength(1)
      expect(data.data.offers[0].title).toBe('Test Offer 1')
      
      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/getAffDashboard'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
            'X-User-Email': 'test@example.com'
          })
        })
      )
    })

    it('should handle backend API errors', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'
      const mockErrorResponse = {
        message: 'Internal server error'
      }

      // Mock fetch to return error response
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue(mockErrorResponse)
      })

      const request = new NextRequest('http://localhost:3000/api/offers')
      jest.spyOn(request.cookies, 'get').mockReturnValue({ name: 'token', value: mockToken })
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Internal server error')
    })

    it('should handle fetch exceptions', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'

      // Mock fetch to throw an error
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      const request = new NextRequest('http://localhost:3000/api/offers')
      jest.spyOn(request.cookies, 'get').mockReturnValue({ value: mockToken , name :'token'})
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to fetch offers')
    })

    it('should handle query parameters correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'
      const mockBackendResponse = {
        message: 'Offers retrieved successfully',
        data: { offers: [], pagination: { page: 2, limit: 5, total: 0, totalPages: 0 } }
      }

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse)
      })

      const request = new NextRequest('http://localhost:3000/api/offers?page=2&limit=5&search=test&status=active&payoutModel=CPA&mobileOperator=Vodafone')
      jest.spyOn(request.cookies, 'get').mockReturnValue({ value: mockToken , name :'token'})
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      
      // Check that fetch was called with correct query parameters
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
      const url = fetchCall[0]
      
      expect(url).toContain('page=2')
      expect(url).toContain('limit=5')
      expect(url).toContain('search=test')
      expect(url).toContain('status=active')
      expect(url).toContain('payoutModel=CPA')
      expect(url).toContain('mobileOperator=Vodafone')
    })
  })

  describe('POST /api/offers', () => {
    it('should return 401 if no session', async () => {
      mockGetServerSession.mockResolvedValue(null)
      
      const request = new NextRequest('http://localhost:3000/api/offers', { method: 'POST' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Unauthorized request')
    })

    it('should return 401 if no token in cookies', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const request = new NextRequest('http://localhost:3000/api/offers', { method: 'POST' })
      jest.spyOn(request.cookies, 'get').mockReturnValue(undefined)
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('No authentication token found')
    })

    it('should successfully create offer', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'
      const mockOfferData = {
        title: 'New Test Offer',
        description: 'Test description',
        payoutModel: 'CPA',
        payout: 10.50,
        status: 'active'
      }
      
      const mockBackendResponse = {
        message: 'Offer created successfully',
        data: {
          id: '2',
          ...mockOfferData
        }
      }

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse)
      })

      const request = new NextRequest('http://localhost:3000/api/offers', {
        method: 'POST',
        body: JSON.stringify(mockOfferData)
      })
      jest.spyOn(request.cookies, 'get').mockReturnValue({ value: mockToken , name :'token'})
      jest.spyOn(request, 'json').mockResolvedValue(mockOfferData)
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Offer created successfully')
      expect(data.data.id).toBe('2')
      expect(data.data.title).toBe('New Test Offer')
      
      // Verify fetch was called with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/createOffer'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockToken}`,
            'X-User-Email': 'test@example.com'
          }),
          body: JSON.stringify(mockOfferData)
        })
      )
    })

    it('should handle backend API errors for POST', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'
      const mockOfferData = { title: 'Invalid Offer' }
      const mockErrorResponse = {
        message: 'Validation failed'
      }

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(mockErrorResponse)
      })

      const request = new NextRequest('http://localhost:3000/api/offers', {
        method: 'POST',
        body: JSON.stringify(mockOfferData)
      })
      jest.spyOn(request.cookies, 'get').mockReturnValue({ value: mockToken , name :'token'})
      jest.spyOn(request, 'json').mockResolvedValue(mockOfferData)
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Validation failed')
    })

    it('should handle fetch exceptions for POST', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com', id: '1' }
      })
      
      const mockToken = 'mock-jwt-token'
      const mockOfferData = { title: 'Test Offer' }

      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

      const request = new NextRequest('http://localhost:3000/api/offers', {
        method: 'POST',
        body: JSON.stringify(mockOfferData)
      })
      jest.spyOn(request.cookies, 'get').mockReturnValue({ value: mockToken , name : 'token'})
      jest.spyOn(request, 'json').mockResolvedValue(mockOfferData)
      
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Failed to create offer')
    })
  })
})
