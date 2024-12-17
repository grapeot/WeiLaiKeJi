import { NextRequest } from 'next/server'
import { POST } from '../applications/route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    application: {
      create: jest.fn(),
    },
  },
}))

// Mock fs/promises
jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
}))

// Mock Request
global.Request = class extends Request {
  private formDataInstance: FormData | null = null

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init)
    if (init?.body instanceof FormData) {
      this.formDataInstance = init.body
    }
  }

  async formData() {
    if (!this.formDataInstance) {
      throw new Error('No FormData available')
    }
    return this.formDataInstance
  }
}

describe('Applications API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successful application submission', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('phone', '1234567890')
    formData.append('jobId', 'job123')
    formData.append('education', 'Bachelor')
    formData.append('experience', '5 years')
    formData.append('skills', 'React, Node.js')

    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    formData.append('resume', file)

    const request = new NextRequest('http://localhost:3000/api/applications', {
      method: 'POST',
      body: formData,
    })

    const mockPrismaResponse = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      jobId: 'job123',
      education: 'Bachelor',
      experience: '5 years',
      skills: 'React, Node.js',
      resume: expect.any(String),
      coverLetter: null,
      createdAt: expect.any(Date),
    }

    ;(prisma.application.create as jest.Mock).mockResolvedValue(mockPrismaResponse)

    const response = await POST(request)
    expect(response.status).toBe(200)

    const responseData = await response.json()
    expect(responseData).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: 'John Doe',
      email: 'john@example.com',
    }))
  })

  it('handles missing resume file', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('phone', '1234567890')
    formData.append('jobId', 'job123')

    const request = new NextRequest('http://localhost:3000/api/applications', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    expect(response.status).toBe(400)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: '请上传简历文件',
    })
  })

  it('handles database errors', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('phone', '1234567890')
    formData.append('jobId', 'job123')

    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    formData.append('resume', file)

    const request = new NextRequest('http://localhost:3000/api/applications', {
      method: 'POST',
      body: formData,
    })

    ;(prisma.application.create as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await POST(request)
    expect(response.status).toBe(500)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: '申请提交失败，请稍后再试',
    })
  })
