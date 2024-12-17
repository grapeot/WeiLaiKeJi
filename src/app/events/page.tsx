'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllEvents, getAllEventTypes, getEventStatus, formatEventTime } from '@/lib/events'
import { Select } from '@/components/ui/Select'
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const allEvents = getAllEvents()
  const eventTypes = getAllEventTypes()

  const filteredEvents = allEvents.filter(event => {
    const matchType = !selectedType || event.type === selectedType
    const matchStatus = !selectedStatus || getEventStatus(event) === selectedStatus
    return matchType && matchStatus
  })

  const typeOptions = [
    { value: '', label: '所有类型' },
    ...eventTypes.map(type => ({
      value: type.id,
      label: type.name
    }))
  ]

  const statusOptions = [
    { value: '', label: '所有状态' },
    { value: 'upcoming', label: '即将开始' },
    { value: 'ongoing', label: '进行中' },
    { value: 'ended', label: '已结束' }
  ]

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'ongoing':
        return 'bg-green-100 text-green-800'
      case 'ended':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">活动日历</h1>
          <p className="text-xl text-gray-600">
            参加我们的校园活动，了解更多机会
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={setSelectedType}
            label="活动类型"
          />
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            label="活动状态"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event)
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative h-48">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(status)}`}>
                        {statusOptions.find(opt => opt.value === status)?.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.type === 'campus_talk' ? '校园宣讲会' :
                         event.type === 'tech_sharing' ? '技术分享会' :
                         event.type === 'workshop' ? '实践工作坊' : '招聘会'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 mb-4">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{formatEventTime(event.startTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{event.registered}/{event.capacity} 人已报名</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              暂无符合条件的活动
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
