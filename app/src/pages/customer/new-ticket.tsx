import { useAuth } from 'components/AuthProvider'
import StatusBadge from 'components/StatusBadge'
import React from 'react'

function NewTicket () {
    const auth = useAuth()
    const [departments, setDepartments] = React.useState([])

    React.useEffect(() => {
        auth.axiosClient.get('/department').then((response: any) => {
            setDepartments(response.data)
        })
    }, [auth.axiosClient])
  return (
    <div>
      <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='container px-4 pt-20 mx-auto sm:pt-24 md:pt-24 lg:px-0 dark:bg-gray-900'>
          <div className='grid gap-4 xl:grid-cols-3 2xl:grid-cols-4'>
            <div className='p-4 mb-5 bg-white border border-gray-200 rounded-lg shadow-sm xl:col-span-2 2xl:col-span-3 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                New ticket
              </h3>

              <hr className='mb-5 border-gray-300 dark:border-gray-600' />
              <div className='mb-6 max-w-96'>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Subject
                </label>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder='Bonnie'
                />
              </div>

              <div className=''>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Content
                </label>
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
                      type='button'
                      className='ml-auto inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
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
                  Ticket
                </h3>
                <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                  <li className='py-4'>
                    <div className='flex items-center space-x-4 dark:border-gray-700'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Status
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <StatusBadge status='open' />
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Priority
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-1 min-w-0'>
                          <select className='bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                          </select>
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
                          <select className='bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'>
                            <option>Select department</option>
                            {departments.map((department: any) => (
                                <option key={department._id}>{department.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='pt-4 flex justify-end'>
                    <button
                      type='button'
                      className='inline-flex items-end p-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg focus:ring-4 focus:ring-reprimaryd-200 dark:focus:ring-primary-900 hover:bg-primary-700'
                    >
                      Create ticket
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

export default NewTicket
