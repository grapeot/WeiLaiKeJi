'use client'

import { JobCard } from '@/components/ui/JobCard'

interface Job {
  title: string
  company: string
  location: string
  salary: string
  type: string
}

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobCard
          key={index}
          {...job}
          onApply={() => alert('Application submitted!')}
        />
      ))}
    </div>
  )
}
