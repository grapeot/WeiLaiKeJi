import { render, screen, within, fireEvent } from '@testing-library/react'
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
    { id: 'engineering', name: '技术研发' },
    { id: 'product', name: '产品' }
  ]

  const mockLocations = ['北京', '上海']

  beforeEach(() => {
    ;(getAllJobs as jest.Mock).mockReturnValue(mockJobs)
    ;(getAllDepartments as jest.Mock).mockReturnValue(mockDepartments)
    ;(getAllLocations as jest.Mock).mockReturnValue(mockLocations)
  })

  it('renders job list page with filters', () => {
    render(<JobsPage />)

    // Check for page title and description
    expect(screen.getByText('加入我们')).toBeInTheDocument()
    expect(screen.getByText('探索激动人心的职业机会，与我们一起创造未来')).toBeInTheDocument()

    // Check for filter options
    const departmentSelect = screen.getByLabelText('按部门筛选')
    expect(within(departmentSelect).getByText('所有部门')).toBeInTheDocument()
    expect(within(departmentSelect).getByText('技术研发')).toBeInTheDocument()
    expect(within(departmentSelect).getByText('产品')).toBeInTheDocument()

    const locationSelect = screen.getByLabelText('按地点筛选')
    expect(within(locationSelect).getByText('所有地点')).toBeInTheDocument()
    expect(within(locationSelect).getByText('北京')).toBeInTheDocument()
    expect(within(locationSelect).getByText('上海')).toBeInTheDocument()
  })

  it('displays job details in cards', () => {
    render(<JobsPage />)

    // Check for job titles
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Manager')).toBeInTheDocument()

    // Check for job descriptions
    expect(screen.getByText('Job description 1')).toBeInTheDocument()
    expect(screen.getByText('Job description 2')).toBeInTheDocument()

    // Check for job location and type
    const jobCards = screen.getAllByRole('article')
    expect(jobCards).toHaveLength(2)

    // Check first job card
    const firstJobCard = jobCards[0]
    expect(within(firstJobCard).getByText('北京')).toBeInTheDocument()
    expect(within(firstJobCard).getByText('full-time')).toBeInTheDocument()
    expect(within(firstJobCard).getByText('发布日期：2024-01-01')).toBeInTheDocument()

    // Check second job card
    const secondJobCard = jobCards[1]
    expect(within(secondJobCard).getByText('上海')).toBeInTheDocument()
    expect(within(secondJobCard).getByText('full-time')).toBeInTheDocument()
    expect(within(secondJobCard).getByText('发布日期：2024-01-01')).toBeInTheDocument()
  })

  it('filters jobs by department', () => {
    render(<JobsPage />)
    
    // Select engineering department
    const departmentSelect = screen.getByLabelText('按部门筛选')
    fireEvent.change(departmentSelect, { target: { value: 'engineering' } })

    // Only engineering jobs should be visible
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.queryByText('Product Manager')).not.toBeInTheDocument()
  })

  it('filters jobs by location', () => {
    render(<JobsPage />)
    
    // Select Beijing location
    const locationSelect = screen.getByLabelText('按地点筛选')
    fireEvent.change(locationSelect, { target: { value: '北京' } })

    // Only Beijing jobs should be visible
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.queryByText('Product Manager')).not.toBeInTheDocument()
  })
})
