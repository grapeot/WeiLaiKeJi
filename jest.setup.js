import '@testing-library/jest-dom'

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

// Mock fetch
global.fetch = jest.fn()

// Mock file reader
global.FileReader = class FileReader {
  readAsArrayBuffer = jest.fn()
  onload = jest.fn()
}
