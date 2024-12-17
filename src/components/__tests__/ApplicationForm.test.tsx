import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplicationForm } from '../ApplicationForm'

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: '申请已提交' }),
  })
) as jest.Mock

describe('ApplicationForm', () => {
  const mockProps = {
    jobId: 'job123',
    jobTitle: 'Software Engineer',
  }

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear()
  })

  it('renders all form fields', () => {
    render(<ApplicationForm {...mockProps} />)

    expect(screen.getByLabelText('姓名')).toBeInTheDocument()
    expect(screen.getByLabelText('邮箱')).toBeInTheDocument()
    expect(screen.getByLabelText('电话')).toBeInTheDocument()
    expect(screen.getByLabelText('教育背景')).toBeInTheDocument()
    expect(screen.getByLabelText('工作经验')).toBeInTheDocument()
    expect(screen.getByLabelText('技能特长')).toBeInTheDocument()
    expect(screen.getByLabelText('简历')).toBeInTheDocument()
    expect(screen.getByLabelText('求职信')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '提交申请' })).toBeInTheDocument()
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

    // Fill in form fields
    await user.type(screen.getByLabelText('姓名'), 'John Doe')
    await user.type(screen.getByLabelText('邮箱'), 'john@example.com')
    await user.type(screen.getByLabelText('电话'), '1234567890')
    await user.type(screen.getByLabelText('教育背景'), 'Bachelor in CS')
    await user.type(screen.getByLabelText('工作经验'), '5 years')
    await user.type(screen.getByLabelText('技能特长'), 'React, Node.js')
    await user.type(screen.getByLabelText('求职信'), 'I am a great candidate')

    // Mock file upload
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByLabelText('简历')
    await user.upload(fileInput, file)

    // Submit form
    await user.click(screen.getByRole('button', { name: '提交申请' }))

    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('申请已提交')).toBeInTheDocument()
    })
  })

  it('handles submission error', async () => {
    // Mock fetch to return an error
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: '提交失败，请稍后再试' }),
      })
    )

    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

    // Fill in form fields
    await user.type(screen.getByLabelText('姓名'), 'John Doe')
    await user.type(screen.getByLabelText('邮箱'), 'john@example.com')
    await user.type(screen.getByLabelText('电话'), '1234567890')

    // Submit form
    await user.click(screen.getByRole('button', { name: '提交申请' }))

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('提交失败，请稍后再试')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

    // Submit form without filling any fields
    await user.click(screen.getByRole('button', { name: '提交申请' }))

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText('姓名是必填项')).toBeInTheDocument()
      expect(screen.getByText('邮箱是必填项')).toBeInTheDocument()
      expect(screen.getByText('电话是必填项')).toBeInTheDocument()
      expect(screen.getByText('简历是必填项')).toBeInTheDocument()
    })
  })

  it('handles successful form submission', async () => {
    render(<ApplicationForm {...mockProps} />)

    // Fill out form
    fireEvent.change(screen.getByLabelText('姓名'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText('电话'), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText('教育背景'), {
      target: { value: 'Bachelor in CS' },
    })
    fireEvent.change(screen.getByLabelText('工作经验'), {
      target: { value: '5 years of experience' },
    })
    fireEvent.change(screen.getByLabelText('技能特长'), {
      target: { value: 'React, Node.js' },
    })

    const file = new File(['resume content'], 'resume.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(screen.getByLabelText('简历'), {
      target: { files: [file] },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: '提交申请' }))

    // Wait for success message
    await waitFor(() => {
      const successMessage = screen.getByText(/申请已提交/)
      expect(successMessage).toBeInTheDocument()
      expect(successMessage.parentElement).toHaveTextContent(
        '感谢您申请 Software Engineer 职位'
      )
    })
  })

  it('handles submission error', async () => {
    // Mock fetch to return error
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: '提交失败' }),
      })
    )

    render(<ApplicationForm {...mockProps} />)

    // Fill in required fields
    fireEvent.change(screen.getByLabelText('姓名'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('邮箱'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText('电话'), {
      target: { value: '1234567890' },
    })
    fireEvent.change(screen.getByLabelText('教育背景'), {
      target: { value: 'Bachelor in CS' },
    })
    fireEvent.change(screen.getByLabelText('工作经验'), {
      target: { value: '5 years of experience' },
    })
    fireEvent.change(screen.getByLabelText('技能特长'), {
      target: { value: 'React, Node.js' },
    })

    const file = new File(['resume content'], 'resume.pdf', {
      type: 'application/pdf',
    })
    fireEvent.change(screen.getByLabelText('简历'), {
      target: { files: [file] },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: '提交申请' }))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('提交失败')).toBeInTheDocument()
    })
  })

  it('shows validation errors for required fields', async () => {
    render(<ApplicationForm {...mockProps} />)

    // Submit form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: '提交申请' }))

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText('请填写此字段')).toBeInTheDocument()
    })
  })
})
