'use client'

import { forwardRef, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline'

const fileUploadVariants = cva(
  'relative flex min-h-[150px] cursor-pointer items-center justify-center rounded-md border border-dashed px-6 py-4',
  {
    variants: {
      variant: {
        default: 'border-gray-200 hover:border-primary-500',
        error: 'border-red-500 hover:border-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>,
    VariantProps<typeof fileUploadVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: string
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, helperText, errorMessage, value, onChange, disabled, variant, accept = '.pdf,.doc,.docx', ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragging(true)
      }
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]
        if (onChange) {
          onChange(file)
        }
      }
    }, [disabled, onChange])

    const handleClick = useCallback(() => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click()
      }
    }, [disabled])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        if (onChange) {
          onChange(file)
        }
      }
    }, [onChange])

    const handleRemove = useCallback(() => {
      if (onChange) {
        onChange(null)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, [onChange])

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div
          className={cn(
            fileUploadVariants({ variant }),
            isDragging && "border-primary-500 bg-primary-50",
            disabled && "cursor-not-allowed opacity-60",
            errorMessage && "border-red-500",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            disabled={disabled}
            accept={accept}
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
              fileInputRef.current = node
            }}
            {...props}
          />
          {value ? (
            <div className="flex items-center space-x-2 px-4 py-2">
              <DocumentIcon className="h-6 w-6 text-primary-600" />
              <span className="text-sm text-gray-600">{value.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="rounded-full p-1 hover:bg-gray-200"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                拖拽文件到这里，或者点击上传
              </p>
              <p className="mt-2 text-xs text-gray-500">
                支持 PDF、DOC、DOCX 格式
              </p>
            </div>
          )}
        </div>
        {(helperText || errorMessage) && (
          <p className={cn(
            "text-sm",
            errorMessage ? "text-red-500" : "text-gray-500"
          )}>
            {errorMessage || helperText}
          </p>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export { FileUpload, fileUploadVariants }
