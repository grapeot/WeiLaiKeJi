'use client'

import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullPage?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4'
}

export function Loading({ size = 'md', className, fullPage = false }: LoadingProps) {
  const Spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-gray-300 border-t-primary-600',
        sizeClasses[size],
        className
      )}
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        {Spinner}
      </div>
    )
  }

  return Spinner
}
