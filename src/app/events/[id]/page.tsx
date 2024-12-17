'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  getEventById, 
  getRelatedEvents, 
  getEventStatus,
  getRegistrationStatus,
  formatEventTime
} from '@/lib/events'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeftIcon,
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ShareIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = getEventById(eventId)
  const relatedEvents = event ? getRelatedEvents(event) : []

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            活动不存在或已下线
          </h1>
          <Link
            href="/events"
            className="text-primary-600 hover:text-primary-700"
          >
            返回活动列表
          </Link>
        </div>
      </div>
    )
  }

  const status = getEventStatus(event)
  const { isAvailable, remainingSpots } = getRegistrationStatus(event)

  const handleRegister = () => {
    alert('报名功能即将上线')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
    } else {
      alert('分享功能在该浏览器中不可用')
    }
  }

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '即将开始'
      case 'ongoing':
        return '进行中'
      case 'ended':
        return '已结束'
      default:
        return '未知状态'
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            返回活动列表
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative h-64 sm:h-96">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(status)}`}>
                {getStatusText(status)}
              </span>
              <button
                onClick={handleShare}
                className="text-gray-500 hover:text-gray-700"
                aria-label="分享"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                <span>{formatEventTime(event.startTime)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                <span>{formatEventTime(event.endTime)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
                <span>{event.registered}/{event.capacity} 人已报名</span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">活动介绍</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">活动议程</h2>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="sm:w-32 font-medium text-gray-900 mb-1 sm:mb-0">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      {item.speaker && (
                        <p className="text-sm text-gray-600">
                          {item.speaker} {item.role && `· ${item.role}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {event.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">参与要求</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {event.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 pt-8">
              <div className="text-gray-600">
                {isAvailable ? (
                  <span>还剩 {remainingSpots} 个名额</span>
                ) : (
                  <span>{status === 'ended' ? '活动已结束' : '报名已截止'}</span>
                )}
              </div>
              <Button
                onClick={handleRegister}
                disabled={!isAvailable}
              >
                {isAvailable ? '立即报名' : '已截止'}
              </Button>
            </div>
          </div>
        </div>

        {relatedEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关活动</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedEvents.map((relatedEvent) => {
                const relatedStatus = getEventStatus(relatedEvent)
                return (
                  <Link
                    key={relatedEvent.id}
                    href={`/events/${relatedEvent.id}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="relative h-48">
                        <Image
                          src={relatedEvent.image}
                          alt={relatedEvent.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(relatedStatus)}`}>
                            {getStatusText(relatedStatus)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 mb-4">
                          {relatedEvent.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span>{formatEventTime(relatedEvent.startTime)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                            <span>{relatedEvent.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
