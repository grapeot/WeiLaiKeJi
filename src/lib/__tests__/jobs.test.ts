import {
  getAllJobs,
  getJobById,
  getJobsByDepartment,
  getJobsByLocation,
  getAllDepartments,
  getAllLocations,
  getRelatedJobs
} from '../jobs'

describe('Jobs Library', () => {
  describe('getAllJobs', () => {
    it('should return an array of jobs', () => {
      const jobs = getAllJobs()
      expect(Array.isArray(jobs)).toBe(true)
      expect(jobs.length).toBeGreaterThan(0)
      expect(jobs[0]).toHaveProperty('id')
      expect(jobs[0]).toHaveProperty('title')
    })
  })

  describe('getJobById', () => {
    it('should return a job when given a valid ID', () => {
      const jobs = getAllJobs()
      const testJob = jobs[0]
      const job = getJobById(testJob.id)
      expect(job).toBeDefined()
      expect(job?.id).toBe(testJob.id)
    })

    it('should return undefined when given an invalid ID', () => {
      const job = getJobById('invalid-id')
      expect(job).toBeUndefined()
    })
  })

  describe('getJobsByDepartment', () => {
    it('should return jobs of the specified department', () => {
      const jobs = getAllJobs()
      const testDepartment = jobs[0].department
      const filteredJobs = getJobsByDepartment(testDepartment)
      expect(Array.isArray(filteredJobs)).toBe(true)
      filteredJobs.forEach(job => {
        expect(job.department).toBe(testDepartment)
      })
    })

    it('should return empty array for non-existent department', () => {
      const jobs = getJobsByDepartment('non-existent')
      expect(jobs).toEqual([])
    })
  })

  describe('getJobsByLocation', () => {
    it('should return jobs in the specified location', () => {
      const jobs = getAllJobs()
      const testLocation = jobs[0].location
      const filteredJobs = getJobsByLocation(testLocation)
      expect(Array.isArray(filteredJobs)).toBe(true)
      filteredJobs.forEach(job => {
        expect(job.location).toBe(testLocation)
      })
    })

    it('should return empty array for non-existent location', () => {
      const jobs = getJobsByLocation('non-existent')
      expect(jobs).toEqual([])
    })
  })

  describe('getAllDepartments', () => {
    it('should return an array of departments', () => {
      const departments = getAllDepartments()
      expect(Array.isArray(departments)).toBe(true)
      expect(departments.length).toBeGreaterThan(0)
      expect(departments[0]).toHaveProperty('id')
      expect(departments[0]).toHaveProperty('name')
      expect(departments[0]).toHaveProperty('description')
    })
  })

  describe('getAllLocations', () => {
    it('should return an array of locations', () => {
      const locations = getAllLocations()
      expect(Array.isArray(locations)).toBe(true)
      expect(locations.length).toBeGreaterThan(0)
      expect(typeof locations[0]).toBe('string')
    })
  })

  describe('getRelatedJobs', () => {
    it('should return related jobs based on department or location', () => {
      const jobs = getAllJobs()
      const testJob = jobs[0]
      const relatedJobs = getRelatedJobs(testJob)
      
      expect(Array.isArray(relatedJobs)).toBe(true)
      relatedJobs.forEach(job => {
        expect(job.id).not.toBe(testJob.id)
        expect(
          job.department === testJob.department ||
          job.location === testJob.location
        ).toBe(true)
      })
    })

    it('should respect the limit parameter', () => {
      const jobs = getAllJobs()
      const testJob = jobs[0]
      const limit = 2
      const relatedJobs = getRelatedJobs(testJob, limit)
      expect(relatedJobs.length).toBeLessThanOrEqual(limit)
    })
  })
})
