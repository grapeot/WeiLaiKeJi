import jobsData from '@/data/jobs.json'

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  postedDate: string
}

export interface Department {
  id: string
  name: string
  description: string
}

export function getAllJobs(): Job[] {
  return jobsData.jobs
}

export function getJobById(id: string): Job | undefined {
  return jobsData.jobs.find(job => job.id === id)
}

export function getJobsByDepartment(department: string): Job[] {
  return jobsData.jobs.filter(job => job.department === department)
}

export function getJobsByLocation(location: string): Job[] {
  return jobsData.jobs.filter(job => job.location === location)
}

export function getAllDepartments(): Department[] {
  return jobsData.departments
}

export function getAllLocations(): string[] {
  return jobsData.locations
}

export function getRelatedJobs(currentJob: Job, limit: number = 3): Job[] {
  return jobsData.jobs
    .filter(job => 
      job.id !== currentJob.id && 
      (job.department === currentJob.department || job.location === currentJob.location)
    )
    .slice(0, limit)
}
