import {
  getAllEvents,
  getEventById,
  getEventsByType,
  getAllEventTypes,
  getEventStatus,
  getRelatedEvents,
  getEventsByDateRange,
  getUpcomingEvents,
  getRegistrationStatus,
  formatEventTime
} from '../events'

describe('Events Library', () => {
  describe('getAllEvents', () => {
    it('should return an array of events', () => {
      const events = getAllEvents()
      expect(Array.isArray(events)).toBe(true)
      expect(events.length).toBeGreaterThan(0)
      expect(events[0]).toHaveProperty('id')
      expect(events[0]).toHaveProperty('title')
    })
  })

  describe('getEventById', () => {
    it('should return an event when given a valid ID', () => {
      const event = getEventById('campus-talk-001')
      expect(event).toBeDefined()
      expect(event?.id).toBe('campus-talk-001')
    })

    it('should return undefined when given an invalid ID', () => {
      const event = getEventById('invalid-id')
      expect(event).toBeUndefined()
    })
  })

  describe('getEventsByType', () => {
    it('should return events of the specified type', () => {
      const events = getEventsByType('campus_talk')
      expect(Array.isArray(events)).toBe(true)
      events.forEach(event => {
        expect(event.type).toBe('campus_talk')
      })
    })

    it('should return empty array for non-existent type', () => {
      const events = getEventsByType('non-existent')
      expect(events).toEqual([])
    })
  })

  describe('getAllEventTypes', () => {
    it('should return an array of event types', () => {
      const types = getAllEventTypes()
      expect(Array.isArray(types)).toBe(true)
      expect(types.length).toBeGreaterThan(0)
      expect(types[0]).toHaveProperty('id')
      expect(types[0]).toHaveProperty('name')
    })
  })

  describe('getEventStatus', () => {
    const mockEvent = {
      id: 'test',
      startTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      endTime: new Date(Date.now() + 172800000).toISOString(),  // day after tomorrow
    } as any

    it('should return upcoming for future events', () => {
      const status = getEventStatus(mockEvent)
      expect(status).toBe('upcoming')
    })

    it('should return ended for past events', () => {
      const pastEvent = {
        ...mockEvent,
        startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        endTime: new Date(Date.now() - 86400000).toISOString(),    // yesterday
      }
      const status = getEventStatus(pastEvent)
      expect(status).toBe('ended')
    })
  })

  describe('getRelatedEvents', () => {
    it('should return related events of the same type', () => {
      const event = getEventById('campus-talk-001')
      if (event) {
        const related = getRelatedEvents(event)
        expect(Array.isArray(related)).toBe(true)
        related.forEach(relatedEvent => {
          expect(relatedEvent.type).toBe(event.type)
          expect(relatedEvent.id).not.toBe(event.id)
        })
      }
    })

    it('should respect the limit parameter', () => {
      const event = getEventById('campus-talk-001')
      if (event) {
        const related = getRelatedEvents(event, 1)
        expect(related.length).toBeLessThanOrEqual(1)
      }
    })
  })

  describe('getEventsByDateRange', () => {
    it('should return events within the specified date range', () => {
      const startDate = new Date('2024-12-01')
      const endDate = new Date('2024-12-31')
      const events = getEventsByDateRange(startDate, endDate)
      events.forEach(event => {
        const eventDate = new Date(event.startTime)
        expect(eventDate >= startDate && eventDate <= endDate).toBe(true)
      })
    })
  })

  describe('getUpcomingEvents', () => {
    it('should return only upcoming events', () => {
      const events = getUpcomingEvents()
      const now = new Date()
      events.forEach(event => {
        expect(new Date(event.startTime) > now).toBe(true)
      })
    })

    it('should respect the limit parameter', () => {
      const limit = 2
      const events = getUpcomingEvents(limit)
      expect(events.length).toBeLessThanOrEqual(limit)
    })
  })

  describe('getRegistrationStatus', () => {
    it('should return correct registration status for available event', () => {
      const event = {
        startTime: new Date(Date.now() + 86400000).toISOString(),
        capacity: 100,
        registered: 50
      } as any
      const status = getRegistrationStatus(event)
      expect(status.isAvailable).toBe(true)
      expect(status.remainingSpots).toBe(50)
    })

    it('should return unavailable status for full event', () => {
      const event = {
        startTime: new Date(Date.now() + 86400000).toISOString(),
        capacity: 100,
        registered: 100
      } as any
      const status = getRegistrationStatus(event)
      expect(status.isAvailable).toBe(false)
      expect(status.remainingSpots).toBe(0)
    })
  })

  describe('formatEventTime', () => {
    it('should format date string correctly', () => {
      const dateString = '2024-12-20T19:00:00+08:00'
      const formatted = formatEventTime(dateString)
      expect(typeof formatted).toBe('string')
      expect(formatted).toMatch(/2024年/)
    })
  })
})
