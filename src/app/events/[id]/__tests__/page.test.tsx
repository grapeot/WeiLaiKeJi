import { render, screen, fireEvent } from '@testing-library/react'
import EventDetailPage from '../page'
import { useParams } from 'next/navigation'
import { getEventById } from '@/lib/events'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

// Mock the events library
jest.mock('@/lib/events', () => ({
  getEventById: jest.fn(),
  getRelatedEvents: jest.fn(() => []),
  getEventStatus: jest.fn(() => 'upcoming'),
  getRegistrationStatus: jest.fn(() => ({ isAvailable: true, remainingSpots: 50 })),
  formatEventTime: jest.fn(() => '2024年12月20日 19:00'),
}))

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert fill prop to string
    const { fill, ...rest } = props
    return <img data-testid="next-image" {...rest} />
  },
}))

describe('EventDetailPage', () => {
  const mockEvent = {
    id: 'test-event',
    title: 'Test Event',
    description: 'Test Description',
    location: 'Test Location',
    startTime: '2024-12-20T19:00:00+08:00',
    endTime: '2024-12-20T21:00:00+08:00',
    image: '/test-image.jpg',
    capacity: 100,
    registered: 50,
    agenda: [
      {
        time: '19:00',
        title: 'Opening',
        speaker: 'Test Speaker',
        role: 'Test Role'
      }
    ],
    requirements: ['Requirement 1', 'Requirement 2']
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-event' })
    ;(getEventById as jest.Mock).mockReturnValue(mockEvent)
  })

  it('renders event details correctly', () => {
    render(<EventDetailPage />)

    expect(screen.getByText(mockEvent.title)).toBeInTheDocument()
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument()
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument()
    expect(screen.getByText(`${mockEvent.registered}/${mockEvent.capacity} 人已报名`)).toBeInTheDocument()

    // Check agenda items
    mockEvent.agenda.forEach(item => {
      expect(screen.getByText(item.time)).toBeInTheDocument()
      expect(screen.getByText(item.title)).toBeInTheDocument()
      if (item.speaker) {
        const speakerText = `${item.speaker}${item.role ? ` · ${item.role}` : ''}`
        expect(screen.getByText(speakerText)).toBeInTheDocument()
      }
    })
  })

  it('displays requirements when they exist', () => {
    render(<EventDetailPage />)

    expect(screen.getByText('参与要求')).toBeInTheDocument()
    mockEvent.requirements.forEach(requirement => {
      expect(screen.getByText(requirement)).toBeInTheDocument()
    })
  })

  it('shows registration button when event is available', () => {
    render(<EventDetailPage />)

    const registerButton = screen.getByText('立即报名')
    expect(registerButton).toBeInTheDocument()
    expect(registerButton).not.toBeDisabled()
  })

  it('shows error message when event does not exist', () => {
    ;(getEventById as jest.Mock).mockReturnValue(undefined)
    render(<EventDetailPage />)

    expect(screen.getByText('活动不存在或已下线')).toBeInTheDocument()
  })

  it('handles registration button click', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation()
    render(<EventDetailPage />)

    const registerButton = screen.getByText('立即报名')
    fireEvent.click(registerButton)

    expect(alertMock).toHaveBeenCalledWith('报名功能即将上线')
    alertMock.mockRestore()
  })

  it('handles share button click', () => {
    const mockShare = jest.fn()
    Object.defineProperty(global.navigator, 'share', {
      value: mockShare,
      writable: true
    })

    render(<EventDetailPage />)
    const shareButton = screen.getByLabelText('分享')
    fireEvent.click(shareButton)

    expect(mockShare).toHaveBeenCalledWith({
      title: mockEvent.title,
      text: mockEvent.description,
      url: expect.any(String)
    })
  })

  it('shows fallback when share is not supported', () => {
    Object.defineProperty(global.navigator, 'share', {
      value: undefined,
      writable: true
    })

    const alertMock = jest.spyOn(window, 'alert').mockImplementation()
    render(<EventDetailPage />)

    const shareButton = screen.getByLabelText('分享')
    fireEvent.click(shareButton)

    expect(alertMock).toHaveBeenCalledWith('分享功能在该浏览器中不可用')
    alertMock.mockRestore()
  })
})
