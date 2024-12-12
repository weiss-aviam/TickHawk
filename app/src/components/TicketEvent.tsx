import { useCallback } from 'react'

export type TicketEventType = {
  user: {
    name: string
  }
  content: string
  minutes?: number
  files?: {
    name: string
    mimetype: string
  }[]
  createdAt: Date
  updatedAt: Date
}
export type TicketEventProps = {
  className?: string
  event: TicketEventType
}

export default function TicketEvent ({
  className,
  event
}: TicketEventProps) {

  // Replaces new lines with <br /> tags
  const toHtml = useCallback(
    (content: string) => {
      return content.replace(/(?:\r\n|\r|\n)/g, '<br />')
    },
    []
  )

  return (
    <article className={className}>
      <div className='flex items-center justify-between mb-2'>
        lalalalalalalalalal
      </div>
    </article>
  )
}
