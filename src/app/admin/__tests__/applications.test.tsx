import { render, screen, waitFor } from '@testing-library/react'
import ApplicationsPage from '../applications/page'
import React, { ReactNode } from 'react'

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useParams: () => ({}),
}))

// Create a test wrapper component with React context
interface TestWrapperProps {
  children: ReactNode
}

function TestWrapper({ children }: TestWrapperProps) {
  return (
    <div>
      {children}
    </div>
  )
}

// Mock data
const mockApplications = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    jobId: 'job1',
    resume: 'resume1.pdf',
    createdAt: '2023-12-31T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    jobId: 'job2',
    resume: 'resume2.pdf',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
]

// Mock fetch
const mockFetch = jest.fn((url: string, init?: RequestInit) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockApplications),
  } as Response)
) as jest.Mock

global.fetch = mockFetch as typeof global.fetch

describe('Applications Admin Page', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockRouter.push.mockClear()
    mockRouter.replace.mockClear()
    mockRouter.prefetch.mockClear()
  })

  it('renders application data correctly', async () => {
    render(<ApplicationsPage />, { wrapper: TestWrapper })

    // Wait for loading state to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check for headings and table structure
    await waitFor(() => {
      // Check heading
      expect(screen.getByText('职位申请管理')).toBeInTheDocument()

      // Check table headers
      expect(screen.getByRole('columnheader', { name: '申请人' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: '职位' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: '联系方式' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: '申请时间' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: '简历' })).toBeInTheDocument()

      // Check application data
      const cells = screen.getAllByRole('cell')

      // First application
      expect(cells[0]).toHaveTextContent('John Doe')
      expect(cells[1]).toHaveTextContent('job1')
      expect(cells[2]).toHaveTextContent('john@example.com')
      expect(cells[2]).toHaveTextContent('1234567890')
      expect(cells[3]).toHaveTextContent('2023-12-31 00:00')
      const resumeLink = cells[4].querySelector('a')
      expect(resumeLink).toHaveAttribute('href', 'http://localhost:8080/uploads/resume1.pdf')
      expect(resumeLink).toHaveTextContent('下载简历')

      // Second application
      expect(cells[5]).toHaveTextContent('Jane Smith')
      expect(cells[6]).toHaveTextContent('job2')
      expect(cells[7]).toHaveTextContent('jane@example.com')
      expect(cells[7]).toHaveTextContent('0987654321')
      expect(cells[8]).toHaveTextContent('2024-01-01 00:00')
      const resumeLink2 = cells[9].querySelector('a')
      expect(resumeLink2).toHaveAttribute('href', 'http://localhost:8080/uploads/resume2.pdf')
      expect(resumeLink2).toHaveTextContent('下载简历')
    })
  })

  })

  it('handles empty applications list', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    )

    render(<ApplicationsPage />, { wrapper: TestWrapper })

    // Wait for loading state to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    // Check for empty state message
    expect(screen.getByText('暂无申请记录')).toBeInTheDocument()

    // Table should not be present when there's no data
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
