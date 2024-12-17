import eventsData from '@/data/events.json'

export interface EventAgendaItem {
  time: string
  title: string
  speaker: string
  role: string
}

export interface Event {
  id: string
  title: string
  type: string
  startTime: string
  endTime: string
  location: string
  address: string
  description: string
  agenda: EventAgendaItem[]
  requirements: string[]
  capacity: number
  registered: number
  image: string
}

export interface EventType {
  id: string
  name: string
  description: string
}

export type EventStatus = 'upcoming' | 'ongoing' | 'ended'

export function getAllEvents(): Event[] {
  return eventsData.events
}

export function getEventById(id: string): Event | undefined {
  return eventsData.events.find(event => event.id === id)
}

export function getEventsByType(type: string): Event[] {
  return eventsData.events.filter(event => event.type === type)
}

export function getAllEventTypes(): EventType[] {
  return eventsData.eventTypes
}

export function getEventStatus(event: Event): EventStatus {
  const now = new Date()
  const startTime = new Date(event.startTime)
  const endTime = new Date(event.endTime)

  if (now < startTime) {
    return 'upcoming'
  } else if (now > endTime) {
    return 'ended'
  } else {
    return 'ongoing'
  }
}

export function getRelatedEvents(currentEvent: Event, limit: number = 2): Event[] {
  return eventsData.events
    .filter(event => 
      event.id !== currentEvent.id && 
      event.type === currentEvent.type
    )
    .slice(0, limit)
}

export function getEventsByDateRange(startDate: Date, endDate: Date): Event[] {
  return eventsData.events.filter(event => {
    const eventStartTime = new Date(event.startTime)
    return eventStartTime >= startDate && eventStartTime <= endDate
  })
}

export function getUpcomingEvents(limit?: number): Event[] {
  const now = new Date()
  const events = eventsData.events
    .filter(event => new Date(event.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return limit ? events.slice(0, limit) : events
}

export function getRegistrationStatus(event: Event): {
  isAvailable: boolean
  remainingSpots: number
} {
  const now = new Date()
  const startTime = new Date(event.startTime)
  const remainingSpots = event.capacity - event.registered

  return {
    isAvailable: now < startTime && remainingSpots > 0,
    remainingSpots
  }
}

export function formatEventTime(dateString: string): string {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
