import { useCallback } from 'react'
import FileInfo from './FileInfo'
import DateFormat from './DateFormat'

export type TicketCommentType = {
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
export type TicketCommentProps = {
  className?: string
  comment: TicketCommentType
}

export default function TicketComment ({
  className,
  comment
}: TicketCommentProps) {
  const toHtml = useCallback(
    (content: string) => {
      return content.replace(/(?:\r\n|\r|\n)/g, '<br />')
    },
    []
  )

  return (
    <article className={className}>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <p className='inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white'>
            <img
              className='w-6 h-6 mr-2 rounded-full'
              src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
              alt='Jese avatar'
            />
            {comment.user.name}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <DateFormat date={comment.createdAt} />
          </p>
        </div>
      </div>
      <div className='mb-2 p-2 text-gray-900 dark:text-white'>
        <div dangerouslySetInnerHTML={{ __html: toHtml(comment.content) }} />
      </div>
      <div className='items-center 2xl:space-x-4 2xl:flex'>
        {comment.files?.map((file, index) => (
          <FileInfo key={index} name={file.name} mimetype={file.mimetype} />
        ))}
      </div>
    </article>
  )
}
