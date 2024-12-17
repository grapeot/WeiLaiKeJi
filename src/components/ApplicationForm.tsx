'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { TextArea } from '@/components/ui/TextArea'
import { Button } from '@/components/ui/Button'

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
}

export function ApplicationForm({ jobId, jobTitle }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('提交失败')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          申请已提交
        </h3>
        <p className="text-gray-600">
          感谢您申请 {jobTitle} 职位。我们会尽快审核您的申请并与您联系。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="jobId" value={jobId} />
      
      <div className="space-y-4">
        <div>
          <Input
            label="姓名"
            name="name"
            required
            placeholder="请输入您的姓名"
          />
        </div>

        <div>
          <Input
            label="邮箱"
            name="email"
            type="email"
            required
            placeholder="请输入您的邮箱"
          />
        </div>

        <div>
          <Input
            label="电话"
            name="phone"
            type="tel"
            required
            placeholder="请输入您的电话号码"
          />
        </div>

        <div>
          <Input
            label="教育背景"
            name="education"
            required
            placeholder="请输入您的最高学历及专业"
          />
        </div>

        <div>
          <TextArea
            label="工作经验"
            name="experience"
            required
            placeholder="请描述您的相关工作经验"
            rows={4}
          />
        </div>

        <div>
          <TextArea
            label="技能特长"
            name="skills"
            required
            placeholder="请列出您掌握的相关技能"
            rows={4}
          />
        </div>

        <div>
          <Input
            label="简历"
            name="resume"
            type="file"
            required
            accept=".pdf,.doc,.docx"
          />
          <p className="mt-1 text-sm text-gray-500">
            支持 PDF、Word 格式，文件大小不超过 10MB
          </p>
        </div>

        <div>
          <TextArea
            label="求职信"
            name="coverLetter"
            placeholder="可选：请简要说明为什么您适合这个职位"
            rows={4}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? '提交中...' : '提交申请'}
      </Button>
    </form>
  )
}
