import { useAuth } from 'components/AuthProvider'
import DateFormat from 'components/DateFormat'
import StatusBadge from 'components/StatusBadge'
import TicketComment from 'components/TicketComment'
import TimeFormat from 'components/TimeFormat'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Ticket () {
  const { id } = useParams()
  const auth = useAuth()
  const [ticket, setTicket] = React.useState<any>(null)

  useEffect(() => {
    auth.axiosClient.get(`/ticket/customer/${id}`).then((response: any) => {
      const ticket_data = response.data
      // Change date string to date object
      ticket_data.createdAt = new Date(ticket_data.createdAt)
      ticket_data.updatedAt = new Date(ticket_data.updatedAt)
      setTicket(response.data)
    })
  }, [id, auth.axiosClient])

  return (
    <div>
      <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='container px-4 pt-20 mx-auto sm:pt-24 md:pt-24 lg:px-0 dark:bg-gray-900'>
          <div className='grid gap-4 xl:grid-cols-3 2xl:grid-cols-4'>
            <div className='p-4 mb-5 bg-white border border-gray-200 rounded-lg shadow-sm xl:col-span-2 2xl:col-span-3 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                Ticket Thread
              </h3>
              <div className='overflow-y-auto lg:max-h-[60rem] 2xl:max-h-fit p-2'>
                {ticket !== null && (
                  <div>
                    <TicketComment
                      comment={{
                        user: {
                          name: ticket?.customer?.name
                        },
                        content: ticket?.content,
                        createdAt: ticket?.createdAt,
                        updatedAt: ticket?.updatedAt,
                        files: ticket?.files
                      }}
                    />
                    <hr className='my-5 border-gray-300 dark:border-gray-600' />
                  </div>
                )}

                {(ticket?.comments || []).map((comment: any, index: number) => (
                  <div>
                    <TicketComment key={index} comment={comment} />
                    <hr className='my-5 border-gray-300 dark:border-gray-600' />
                  </div>
                ))}
              </div>
              <div className='w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
                <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800'>
                  <label className='sr-only'>Write your message</label>
                  <textarea
                    id='comment'
                    rows={8}
                    className='w-full px-0 text-sm outline-none text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'
                    placeholder='Write your message'
                  ></textarea>
                </div>
                <div className='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
                  <button
                    type='submit'
                    className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800'
                  >
                    Send message
                  </button>
                  <div className='flex pl-0 space-x-1 sm:pl-2'>
                    <button
                      type='button'
                      className='inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
                    >
                      <svg
                        aria-hidden='true'
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          d='M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z'
                          clipRule='evenodd'
                        ></path>
                      </svg>
                      <span className='sr-only'>Attach file</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
                <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                  Ticket <span className='text-base'>#{ticket?._id}</span>
                </h3>
                <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                  <li className='py-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center space-x-4 border-r-[1px] border-gray-200 dark:border-gray-700'>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                            Status
                          </span>
                        </div>
                        <div className='inline-flex items-center'>
                          <StatusBadge status='open' />
                        </div>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                            Priority
                          </span>
                        </div>
                        <div className='inline-flex items-center dark:text-white capitalize'>
                          {ticket?.priority}
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Time
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base text-gray-900 truncate dark:text-white'>
                            {(ticket && (
                              <TimeFormat minutes={ticket?.minutes} />
                            )) ||
                              '0h 0m'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Last message
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base text-gray-900 truncate dark:text-white'>
                            {(ticket && ticket?.updatedAt) && (
                              <DateFormat date={ticket?.updatedAt} />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Agent
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-shrink-0'>
                          {(ticket && ticket?.agent?._id) && (
                            <img
                              className='w-6 h-6 rounded-full mr-2'
                              src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                              alt='ticket agent'
                            />
                          )}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base text-gray-900 truncate dark:text-white'>
                            {(ticket && ticket?.agent?.name) ?
                              ticket?.agent?.name :
                              'No agent assigned'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Department
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base text-gray-900 truncate dark:text-white'>
                            {(ticket && ticket?.department?.name) ? (
                              ticket?.department?.name
                            ) : (
                              'No department assigned'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className='pt-4 flex justify-end'>
                    <button
                      type='button'
                      className='inline-flex items-end p-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-700'
                    >
                      Close ticket
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket
