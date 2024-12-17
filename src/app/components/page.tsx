'use client'

import { Input } from '@/components/ui/Input'
import { Loading } from '@/components/ui/Loading'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { FileUpload } from '@/components/ui/FileUpload'
import { TextArea } from '@/components/ui/TextArea'
import { 
  MagnifyingGlassIcon, 
  EnvelopeIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function ComponentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const departments = [
    { value: 'engineering', label: '工程部' },
    { value: 'product', label: '产品部' },
    { value: 'design', label: '设计部' },
    { value: 'marketing', label: '市场部' },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold">组件展示</h1>
        
        {/* Input Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Input</h2>
          <div className="space-y-4">
            <Input
              placeholder="基础输入框"
              label="基础输入框"
              helperText="这是一个基础输入框"
            />

            <Input
              placeholder="搜索职位..."
              leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
              isLoading={isLoading}
              onChange={handleSearch}
              label="搜索输入框"
              helperText="带图标和加载状态"
            />

            <Input
              type="email"
              placeholder="输入邮箱"
              leftIcon={<EnvelopeIcon className="h-4 w-4" />}
              label="邮箱输入框"
              helperText="带图标"
            />

            <Input
              placeholder="错误输入框"
              variant="error"
              rightIcon={<ExclamationCircleIcon className="h-4 w-4 text-red-500" />}
              label="错误输入框"
              errorMessage="这是一个必填项"
            />

            <Input
              placeholder="禁用输入框"
              disabled
              label="禁用输入框"
              helperText="此输入框已禁用"
            />
          </div>
        </section>

        {/* Loading Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Loading</h2>
          <div className="flex space-x-4">
            <Loading size="sm" />
            <Loading size="md" />
            <Loading size="lg" />
          </div>
        </section>

        {/* Select Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Select</h2>
          <div className="space-y-4">
            <Select
              options={departments}
              label="部门选择"
              helperText="选择你想加入的部门"
            />

            <Select
              options={departments}
              label="错误状态"
              errorMessage="请选择一个部门"
              variant="error"
            />

            <Select
              options={departments}
              label="禁用状态"
              helperText="此选择框已禁用"
              disabled
            />
          </div>
        </section>

        {/* Checkbox Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Checkbox</h2>
          <div className="space-y-4">
            <Checkbox
              label="同意服务条款"
              helperText="请仔细阅读服务条款"
            />

            <Checkbox
              label="错误状态"
              errorMessage="这是一个必选项"
            />

            <Checkbox
              label="禁用状态"
              helperText="此选项已禁用"
              disabled
            />
          </div>
        </section>

        {/* FileUpload Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">FileUpload</h2>
          <div className="space-y-4">
            <FileUpload
              label="上传简历"
              helperText="支持 PDF、DOC、DOCX 格式"
              value={file}
              onChange={setFile}
            />

            <FileUpload
              label="错误状态"
              errorMessage="请上传简历"
              variant="error"
              value={file}
              onChange={setFile}
            />

            <FileUpload
              label="禁用状态"
              helperText="文件上传已禁用"
              disabled
            />
          </div>
        </section>

        {/* TextArea Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">TextArea</h2>
          <div className="space-y-4">
            <TextArea
              placeholder="请输入自我介绍..."
              label="自我介绍"
              helperText="简单介绍一下你自己"
            />

            <TextArea
              placeholder="错误状态..."
              label="错误状态"
              errorMessage="这是一个必填项"
              variant="error"
            />

            <TextArea
              placeholder="禁用状态..."
              label="禁用状态"
              helperText="此文本框已禁用"
              disabled
            />
          </div>
        </section>
      </div>
    </main>
  )
}
