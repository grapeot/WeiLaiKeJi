import '@testing-library/jest-dom'

// Set global test timeout
jest.setTimeout(30000)

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useParams() {
    return {}
  },
}))

// Mock FormData
global.FormData = class FormData {
  append = jest.fn()
}

// Mock Request and Response
class MockRequest {
  #url
  constructor(input, init = {}) {
    this.#url = typeof input === 'string' ? input : input.url
    this.method = init.method || 'GET'
    this.headers = new Headers(init.headers || {})
    this.body = init.body
  }

  get url() {
    return this.#url
  }
}

global.Request = MockRequest

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends MockRequest {},
  NextResponse: {
    json: (body, init = {}) => {
      const jsonString = JSON.stringify(body)
      const response = new Response(jsonString, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init.headers || {}) }
      })
      return response
    }
  }
}))

class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.ok = this.status >= 200 && this.status < 300
    this.headers = new Headers({
      'Content-Type': 'application/json',
      ...(init.headers || {})
    })
  }

  async json() {
    return JSON.parse(this.body)
  }
}

global.Response = Response

// Mock fetch
global.fetch = jest.fn()

// Mock file reader
global.FileReader = class FileReader {
  readAsArrayBuffer = jest.fn()
  onload = jest.fn()
}
