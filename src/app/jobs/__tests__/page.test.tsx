import { render, screen, fireEvent } from '@testing-library/react'
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
    ;(getAllJobs as jest.Mock).mockReturnValue(mockJobs)
    ;(getAllDepartments as jest.Mock).mockReturnValue(mockDepartments)
    ;(getAllLocations as jest.Mock).mockReturnValue(mockLocations)
  })

  it('renders job list page with filters', () => {
    render(<JobsPage />)
    
    // Check if page title is rendered
    expect(screen.getByText('加入我们')).toBeInTheDocument()
    
    // Check if filters are rendered
    expect(screen.getByRole('combobox', { name: '按部门筛选' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: '按地点筛选' })).toBeInTheDocument()
    
    // Check if job cards are rendered
    mockJobs.forEach(job => {
      expect(screen.getByText(job.title)).toBeInTheDocument()
      expect(screen.getByText(`${mockDepartments.find(d => d.id === job.department)?.name} · ${job.location}`)).toBeInTheDocument()
    })
  })

  it('filters jobs by department', () => {
    render(<JobsPage />)
    
    // Find and change the department select
    const departmentSelect = screen.getByRole('combobox', { name: '按部门筛选' })
    fireEvent.change(departmentSelect, { target: { value: 'engineering' } })
    
    // Check if only engineering jobs are shown
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.queryByText('Product Manager')).not.toBeInTheDocument()
  })

  it('filters jobs by location', () => {
    render(<JobsPage />)
    
    // Find and change the location select
    const locationSelect = screen.getByRole('combobox', { name: '按地点筛选' })
    fireEvent.change(locationSelect, { target: { value: '北京' } })
    
    // Check if only Beijing jobs are shown
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.queryByText('Product Manager')).not.toBeInTheDocument()
  })

  it('displays no results message when no jobs found', () => {
    ;(getAllJobs as jest.Mock).mockReturnValue([])
    render(<JobsPage />)
    
    expect(screen.getByText('暂无符合条件的职位')).toBeInTheDocument()
  })

  it('displays job details in cards', () => {
    render(<JobsPage />)
    
    // Check if job details are displayed in cards
    mockJobs.forEach(job => {
      expect(screen.getByText(job.title)).toBeInTheDocument()
      expect(screen.getByText(`${mockDepartments.find(d => d.id === job.department)?.name} · ${job.location}`)).toBeInTheDocument()
      expect(screen.getByText(`${job.type} · ${job.experience}`)).toBeInTheDocument()
      expect(screen.getByText(job.salary)).toBeInTheDocument()
      expect(screen.getByText(job.description)).toBeInTheDocument()
    })
  })
})
