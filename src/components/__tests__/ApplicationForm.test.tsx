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
    // Mock fetch to return success
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: '申请已提交' }),
      })
    )

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
    await waitFor(
      () => {
        expect(screen.getByText('申请已提交')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Check additional success elements
    expect(screen.getByText(/感谢您申请.*职位/)).toBeInTheDocument()
  })

  it('handles submission error', async () => {
    // Mock fetch to return error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('提交失败'))
    )

    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

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

    // Submit form
    await user.click(screen.getByRole('button', { name: '提交申请' }))

    // Wait for error message
    await waitFor(
      () => {
        expect(screen.getByText('提交失败')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ApplicationForm {...mockProps} />)

    // Submit form without filling any fields
    await user.click(screen.getByRole('button', { name: '提交申请' }))

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
