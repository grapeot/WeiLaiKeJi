import { render, screen } from '@testing-library/react'
import ApplicationsPage from '../applications/page'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          jobId: 'job1',
          resumePath: '/uploads/resume1.pdf',
          createdAt: '2023-12-31T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          jobId: 'job2',
          resumePath: '/uploads/resume2.pdf',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ]),
  })
) as jest.Mock

describe('Applications Admin Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear()
  })

  it('renders application data correctly', async () => {
    const page = await ApplicationsPage()
    render(page)

    // Check for headings
    expect(screen.getByText('职位申请管理')).toBeInTheDocument()

    // Check for table headers
    expect(screen.getByRole('columnheader', { name: '申请人' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '职位' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '联系方式' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '申请时间' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '简历' })).toBeInTheDocument()

    // Check for application data
    const cells = screen.getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('John Doe')
    expect(cells[1]).toHaveTextContent('job1')
    expect(cells[2]).toHaveTextContent('john@example.com')
    expect(cells[2]).toHaveTextContent('1234567890')
    expect(cells[3]).toHaveTextContent('2023-12-31 00:00')
    expect(cells[4].querySelector('a')).toHaveAttribute('href', '/uploads/resume1.pdf')

    expect(cells[5]).toHaveTextContent('Jane Smith')
    expect(cells[6]).toHaveTextContent('job2')
    expect(cells[7]).toHaveTextContent('jane@example.com')
    expect(cells[7]).toHaveTextContent('0987654321')
    expect(cells[8]).toHaveTextContent('2024-01-01 00:00')
    expect(cells[9].querySelector('a')).toHaveAttribute('href', '/uploads/resume2.pdf')
  })

  it('handles empty applications list', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    )

    const page = await ApplicationsPage()
    render(page)

    // Table headers should still be present
    expect(screen.getByRole('columnheader', { name: '申请人' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: '职位' })).toBeInTheDocument()

    // But no application data
    expect(screen.queryByRole('cell', { name: 'John Doe' })).not.toBeInTheDocument()
    expect(screen.queryByRole('cell', { name: 'jane@example.com' })).not.toBeInTheDocument()
  })
})
