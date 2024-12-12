import { useCallback } from 'react'
import DateFormat from './DateFormat'
import ProfileImage from './ProfileImage'

export type TicketEventType = {
  user: {
    name: string
  }
  type: string
  createdAt: Date
  updatedAt: Date
}
export type TicketEventProps = {
  className?: string
  event: TicketEventType
}

export default function TicketEvent ({ className, event }: TicketEventProps) {
  // Replaces new lines with <br /> tags
  const toHtml = useCallback((content: string) => {
    return content.replace(/(?:\r\n|\r|\n)/g, '<br />')
  }, [])

  return (
    <article className={className}>
      <div className='mb-2'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <p className='inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white'>
              <ProfileImage />
              {event.user.name}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              <DateFormat date={event.createdAt} />
            </p>
          </div>
        </div>
        <div className='py-1.5 px-3 inline-flex items-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-gray-700'>
          {event.type === 'close' && (
            <p className='text-gray-900 dark:text-white'>
              This ticket has been closed
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
