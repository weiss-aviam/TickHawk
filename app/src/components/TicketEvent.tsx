import DateFormat from './DateFormat'
import ProfileImage from './ProfileImage'

export type TicketEventType = {
  user: {
    name: string
  }
  type: string
  data?: any
  createdAt: Date
  updatedAt: Date
}
export type TicketEventProps = {
  className?: string
  event: TicketEventType
}

export default function TicketEvent ({ className, event }: TicketEventProps) {
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
              The ticket was closed
            </p>
          )}
          {event.type === 'status-change' && event.data && (
            <p className='text-gray-900 dark:text-white'>
              Changed status from <span className="font-medium">{event.data.oldStatus}</span> to <span className="font-medium">{event.data.newStatus}</span>
            </p>
          )}
          {event.type === 'assign-agent' && event.data && (
            <p className='text-gray-900 dark:text-white'>
              {!event.data.oldAgent ? (
                <>Assigned to <span className="font-medium">{event.data.newAgent.name}</span></>
              ) : (
                <>Transferred from <span className="font-medium">{event.data.oldAgent.name}</span> to <span className="font-medium">{event.data.newAgent.name}</span></>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
