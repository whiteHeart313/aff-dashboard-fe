// jest.setup.js
import { beforeAll, afterAll } from '@jest/globals'

// Mock environment variables
process.env.BACKEND_API_URL = 'http://localhost:8080/api'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

// Mock cookies
const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
}

// Mock NextRequest
global.mockRequest = (overrides = {}) => ({
  cookies: mockCookies,
  json: jest.fn(),
  url: 'http://localhost:3000/api/offers',
  ...overrides,
})

// Mock NextResponse
global.mockResponse = {
  json: jest.fn().mockImplementation((data, options) => ({
    json: () => Promise.resolve(data),
    status: options?.status || 200,
  })),
}

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})
