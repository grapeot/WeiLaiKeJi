'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@heroicons/react/24/outline'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  helperText?: string
  errorMessage?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className,
    label,
    helperText,
    errorMessage,
    ...props 
  }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <div className="relative flex h-5 w-5 items-center">
          <input
            type="checkbox"
            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-colors checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            ref={ref}
            {...props}
          />
          <CheckIcon className="pointer-events-none absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
        </div>
        <div className="space-y-1">
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
          )}
          {(helperText || errorMessage) && (
            <p className={cn(
              "text-sm",
              errorMessage ? "text-red-500" : "text-gray-500"
            )}>
              {errorMessage || helperText}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
