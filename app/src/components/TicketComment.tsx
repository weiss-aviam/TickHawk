import { useCallback } from "react"
import FileInfo from "./FileInfo"

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
    createdAt: string
    updatedAt: string
}
export type TicketCommentProps = {
    className?: string
    comment: TicketCommentType
}

export default function TicketComment ({ className, comment }: TicketCommentProps) {

    const toHtml = useCallback((content: string) => {
        console.log('content', content)
        return content.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }, [comment.content])
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
            {comment.createdAt}
          </p>
        </div>
      </div>
      <p className='mb-2 text-gray-900 dark:text-white'>
        <div dangerouslySetInnerHTML={{__html: toHtml(comment.content)}} />
      </p>
      <div className='items-center 2xl:space-x-4 2xl:flex'>
        <FileInfo name='flowbite_offer_345' mimetype='' />
      </div>
    </article>
  )
}
