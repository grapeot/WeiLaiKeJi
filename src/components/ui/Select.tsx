'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const selectVariants = cva(
  'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-200 focus-visible:ring-primary-500',
        error: 'border-red-500 focus-visible:ring-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface Option {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>,
    VariantProps<typeof selectVariants> {
  options: Option[]
  label?: string
  helperText?: string
  errorMessage?: string
  value?: string
  onChange?: (value: string) => void
  id?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    options, 
    label,
    helperText,
    errorMessage,
    variant,
    value,
    onChange,
    id,
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label 
            htmlFor={selectId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(selectVariants({ variant }), className)}
          ref={ref}
          value={value}
          onChange={handleChange}
          aria-label={label}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select'

export { Select, selectVariants }
