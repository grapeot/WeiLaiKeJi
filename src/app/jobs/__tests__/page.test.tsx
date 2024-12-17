import { render, screen, fireEvent, within } from '@testing-library/react'
import JobsPage from '../page'
import {
  getAllJobs,
  getAllDepartments,
  getAllLocations,
  getJobsByDepartment,
  getJobsByLocation
} from '@/lib/jobs'

// Mock the jobs library
jest.mock('@/lib/jobs', () => ({
  getAllJobs: jest.fn(),
  getAllDepartments: jest.fn(),
  getAllLocations: jest.fn(),
  getJobsByDepartment: jest.fn(),
  getJobsByLocation: jest.fn()
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('JobsPage', () => {
  const mockJobs = [
    {
      id: 'job-1',
      title: 'Software Engineer',
      department: 'engineering',
      location: '北京',
      type: 'full-time',
      experience: '3-5年',
      salary: '25k-35k',
      description: 'Job description 1',
      requirements: ['Req 1', 'Req 2'],
      responsibilities: ['Resp 1', 'Resp 2'],
      benefits: ['Benefit 1', 'Benefit 2'],
      postedDate: '2024-01-01'
    },
    {
      id: 'job-2',
      title: 'Product Manager',
      department: 'product',
      location: '上海',
      type: 'full-time',
      experience: '5-7年',
      salary: '35k-50k',
      description: 'Job description 2',
      requirements: ['Req 1', 'Req 2'],
      responsibilities: ['Resp 1', 'Resp 2'],
      benefits: ['Benefit 1', 'Benefit 2'],
      postedDate: '2024-01-01'
    }
  ]

  const mockDepartments = [
    {
      id: 'engineering',
      name: '技术研发',
      description: 'Engineering department'
    },
    {
      id: 'product',
      name: '产品',
      description: 'Product department'
    }
  ]

  const mockLocations = ['北京', '上海']

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getAllJobs as jest.Mock).mockReturnValue(mockJobs)
    ;(getAllDepartments as jest.Mock).mockReturnValue(mockDepartments)
    ;(getAllLocations as jest.Mock).mockReturnValue(mockLocations)
  })

  it('renders job list page with filters', () => {
    render(<JobsPage />)

    // Check page title and description
    expect(screen.getByText('加入我们')).toBeInTheDocument()
    expect(screen.getByText('探索激动人心的职业机会，与我们一起创造未来')).toBeInTheDocument()

    // Check filters
    expect(screen.getByRole('combobox', { name: '按部门筛选' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '按地点筛选' })).toBeInTheDocument()

    // Check job cards
    mockJobs.forEach(job => {
      const jobCard = screen.getByTestId(`job-card-${job.id}`)
      expect(jobCard).toBeInTheDocument()

      // Check job details
      expect(within(jobCard).getByText(job.title)).toBeInTheDocument()
      expect(within(jobCard).getByTestId(`job-location-${job.id}`)).toHaveTextContent(job.location)
      expect(within(jobCard).getByTestId(`job-type-${job.id}`)).toHaveTextContent(job.type)
      expect(within(jobCard).getByText(job.description)).toBeInTheDocument()
      expect(within(jobCard).getByText(`发布日期：${job.postedDate}`)).toBeInTheDocument()

      // Check details link
      const detailsLink = within(jobCard).getByText('查看详情')
      expect(detailsLink).toBeInTheDocument()
      expect(detailsLink.closest('a')).toHaveAttribute('href', `/jobs/${job.id}`)
    })
  })

  it('filters jobs by department', async () => {
    render(<JobsPage />)

    // Select engineering department
    const departmentSelect = screen.getByRole('combobox', { name: '按部门筛选' })
    fireEvent.change(departmentSelect, { target: { value: 'engineering' } })

    // Check if only engineering jobs are shown
    const engineeringJobs = mockJobs.filter(job => job.department === 'engineering')
    const nonEngineeringJobs = mockJobs.filter(job => job.department !== 'engineering')

    // Verify engineering jobs are visible
    engineeringJobs.forEach(job => {
      expect(screen.getByTestId(`job-card-${job.id}`)).toBeInTheDocument()
    })

    // Verify non-engineering jobs are not visible
    nonEngineeringJobs.forEach(job => {
      expect(screen.queryByTestId(`job-card-${job.id}`)).not.toBeInTheDocument()
    })
  })

  it('filters jobs by location', async () => {
    render(<JobsPage />)

    // Select Beijing location
    const locationSelect = screen.getByRole('combobox', { name: '按地点筛选' })
    fireEvent.change(locationSelect, { target: { value: '北京' } })

    // Check if only Beijing jobs are shown
    const beijingJobs = mockJobs.filter(job => job.location === '北京')
    const nonBeijingJobs = mockJobs.filter(job => job.location !== '北京')

    // Verify Beijing jobs are visible
    beijingJobs.forEach(job => {
      expect(screen.getByTestId(`job-card-${job.id}`)).toBeInTheDocument()
    })

    // Verify non-Beijing jobs are not visible
    nonBeijingJobs.forEach(job => {
      expect(screen.queryByTestId(`job-card-${job.id}`)).not.toBeInTheDocument()
    })
  })

  it('displays no results message when no jobs found', () => {
    ;(getAllJobs as jest.Mock).mockReturnValue([])
    render(<JobsPage />)

    expect(screen.getByText('暂无符合条件的职位')).toBeInTheDocument()
  })

  it('displays job details in cards', () => {
    render(<JobsPage />)

    mockJobs.forEach(job => {
      const jobCard = screen.getByTestId(`job-card-${job.id}`)

      // Check all job details are displayed correctly
      expect(within(jobCard).getByText(job.title)).toBeInTheDocument()
      expect(within(jobCard).getByTestId(`job-location-${job.id}`)).toHaveTextContent(job.location)
      expect(within(jobCard).getByTestId(`job-type-${job.id}`)).toHaveTextContent(job.type)
      expect(within(jobCard).getByText(job.description)).toBeInTheDocument()
      expect(within(jobCard).getByText(`发布日期：${job.postedDate}`)).toBeInTheDocument()

      // Check details link
      const detailsLink = within(jobCard).getByText('查看详情')
      expect(detailsLink).toBeInTheDocument()
      expect(detailsLink.closest('a')).toHaveAttribute('href', `/jobs/${job.id}`)
    })
  })
})
