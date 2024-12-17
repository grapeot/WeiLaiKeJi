import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationForm } from '../ApplicationForm'
import { act } from '@testing-library/react'

// Helper function to flush promises
const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('ApplicationForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    // Add console debug to track state changes
    jest.spyOn(console, 'debug').mockImplementation()
  })

  afterEach(() => {
    jest.resetAllMocks()
    ;(console.debug as jest.Mock).mockRestore()
  })

  const mockProps = {
    jobId: 'job123',
    jobTitle: '软件工程师',
  }

  it('submits form successfully', async () => {
    let resolvePromise: (value: any) => void
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    // Mock fetch to return success
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => fetchPromise)

    const user = userEvent.setup({ delay: null })
    const { container } = render(<ApplicationForm {...mockProps} />)

    // Fill in form fields
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

    // Debug initial state
    console.debug('Before submit - Button text:', screen.getByRole('button').textContent)

    // Get the form element
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()

    // Submit form using form submit event
    await act(async () => {
      // Verify fetch hasn't been called yet
      expect(global.fetch).not.toHaveBeenCalled()

      // Submit the form directly
      fireEvent.submit(form!)

      // Wait for any immediate state updates
      await new Promise(resolve => setTimeout(resolve, 0))

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('/api/applications', expect.any(Object))
    })

    // Debug state after submit
    console.debug('After submit - Button text:', screen.getByRole('button').textContent)

    // Verify loading state
    await waitFor(() => {
      const button = screen.getByRole('button')
      console.debug('Button text during loading:', button.textContent)
      expect(button).toHaveTextContent('提交中...', { normalizeWhitespace: true })
      expect(button).toBeDisabled()
    }, { timeout: 3000 })

    // Resolve the fetch promise
    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve({ message: '申请已提交' }),
      })
      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Debug final state
    console.debug('After resolve - Container HTML:', container.innerHTML)

    // Verify success state
    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('申请已提交')
      const successMessage = screen.getByText(new RegExp(`感谢您申请 ${mockProps.jobTitle} 职位`))
      expect(successMessage).toBeInTheDocument()
      expect(successMessage.parentElement).toHaveClass('text-center')
    }, { timeout: 3000 })
  }, 10000)

  it('handles submission error', async () => {
    let rejectPromise: (error: Error) => void
    const fetchPromise = new Promise((_, reject) => {
      rejectPromise = reject
    })

    // Mock fetch to return error
    ;(global.fetch as jest.Mock).mockImplementationOnce(() => fetchPromise)

    const user = userEvent.setup({ delay: null })
    const { container } = render(<ApplicationForm {...mockProps} />)

    // Fill in form fields
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

    // Debug initial state
    console.debug('Before submit - Button text:', screen.getByRole('button').textContent)

    // Get the form element
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()

    // Submit form using form submit event
    await act(async () => {
      // Verify fetch hasn't been called yet
      expect(global.fetch).not.toHaveBeenCalled()

      // Submit the form directly
      fireEvent.submit(form!)

      // Wait for any immediate state updates
      await new Promise(resolve => setTimeout(resolve, 0))

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith('/api/applications', expect.any(Object))
    })

    // Debug state after submit
    console.debug('After submit - Button text:', screen.getByRole('button').textContent)

    // Verify loading state
    await waitFor(() => {
      const button = screen.getByRole('button')
      console.debug('Button text during loading:', button.textContent)
      expect(button).toHaveTextContent('提交中...', { normalizeWhitespace: true })
      expect(button).toBeDisabled()
    }, { timeout: 3000 })

    // Reject the fetch promise
    await act(async () => {
      rejectPromise(new Error('提交失败'))
      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Debug final state
    console.debug('After reject - Container HTML:', container.innerHTML)

    // Verify error state
    await waitFor(() => {
      const errorDiv = screen.getByText('提交失败')
      expect(errorDiv).toHaveClass('text-red-500', 'text-sm')
      const submitButton = screen.getByRole('button', { name: '提交申请' })
      expect(submitButton).toBeEnabled()
    }, { timeout: 3000 })
  }, 10000)

  it('validates required fields', async () => {
    const user = userEvent.setup()
    const { container } = render(<ApplicationForm {...mockProps} />)

    // Get the form element
    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()

    // Submit form without filling any fields
    await act(async () => {
      fireEvent.submit(form!)
    })

    // Check that required fields show validation messages
    const requiredFields = [
      '姓名',
      '邮箱',
      '电话',
      '教育背景',
      '工作经验',
      '技能特长',
      '简历',
    ]

    requiredFields.forEach((fieldName) => {
      const input = screen.getByLabelText(fieldName)
      expect(input).toBeRequired()
    })
  }, 10000)
})
