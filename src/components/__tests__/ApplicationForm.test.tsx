import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import { ApplicationForm } from '../ApplicationForm'

// Mock fetch
const mockFetch = jest.fn((url: string, init?: RequestInit) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  } as Response)
) as jest.Mock

global.fetch = mockFetch as typeof global.fetch

const mockProps = {
  jobId: 'job123',
  jobTitle: 'Software Engineer'
}

describe('ApplicationForm', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

    // Fill form fields
    await act(async () => {
      await user.type(screen.getByLabelText('姓名'), 'John Doe')
      await user.type(screen.getByLabelText('邮箱'), 'john@example.com')
      await user.type(screen.getByLabelText('电话'), '1234567890')
      await user.type(screen.getByLabelText('教育背景'), 'Bachelor in CS')
      await user.type(screen.getByLabelText('工作经验'), '5 years')
      await user.type(screen.getByLabelText('技能特长'), 'React, Node.js')

      // Mock file upload
      const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText('简历')
      await user.upload(fileInput, file)
    })

    // Submit form using fireEvent instead of userEvent
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    // Wait for fetch to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith('/api/applications', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      }))
    })

    // Wait for success message
    await waitFor(() => {
      const successHeading = screen.getByRole('heading', {
        name: '申请已提交',
        level: 3
      })
      expect(successHeading).toBeInTheDocument()
      const successDiv = successHeading.parentElement
      expect(successDiv).toHaveClass('text-center', 'py-8')
      expect(screen.getByText(`感谢您申请 ${mockProps.jobTitle} 职位。我们会尽快审核您的申请并与您联系。`)).toBeInTheDocument()
    })
  })

  it('handles submission error', async () => {
    const user = userEvent.setup()
    mockFetch.mockRejectedValueOnce(new Error('提交失败'))

    render(<ApplicationForm {...mockProps} />)

    // Fill form fields
    await act(async () => {
      await user.type(screen.getByLabelText('姓名'), 'John Doe')
      await user.type(screen.getByLabelText('邮箱'), 'john@example.com')
      await user.type(screen.getByLabelText('电话'), '1234567890')
      await user.type(screen.getByLabelText('教育背景'), 'Bachelor in CS')
      await user.type(screen.getByLabelText('工作经验'), '5 years')
      await user.type(screen.getByLabelText('技能特长'), 'React, Node.js')

      // Mock file upload
      const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
      const fileInput = screen.getByLabelText('简历')
      await user.upload(fileInput, file)
    })

    // Submit form using fireEvent instead of userEvent
    const form = screen.getByRole('form')
    await act(async () => {
      fireEvent.submit(form)
    })

    // Wait for fetch to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    // Wait for error message
    await waitFor(() => {
      const errorDiv = screen.getByText('提交失败')
      expect(errorDiv).toHaveClass('text-red-500', 'text-sm')
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

    // Submit form without filling any fields
    const submitButton = screen.getByRole('button', { name: '提交申请' })
    await user.click(submitButton)

    // Check if form submission was prevented
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
    expect(screen.queryByText('提交失败')).not.toBeInTheDocument()

    // Verify that required fields are marked
    const requiredFields = [
      '姓名',
      '邮箱',
      '电话',
      '教育背景',
      '工作经验',
      '技能特长',
      '简历'
    ]

    requiredFields.forEach(fieldName => {
      const input = screen.getByLabelText(fieldName)
      expect(input).toBeRequired()
    })
  })
})
