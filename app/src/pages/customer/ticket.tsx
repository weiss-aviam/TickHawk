import StatusBadge from 'components/StatusBadge'
import React from 'react'

function Ticket () {
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
                <article className='mb-5'>
                  <footer className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <p className='inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white'>
                        <img
                          className='w-6 h-6 mr-2 rounded-full'
                          src='https://flowbite.com/docs/images/people/profile-picture-2.jpg'
                          alt='Michael Gough'
                        />
                        Michael Gough
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        01/03/2023 3:45 PM
                      </p>
                    </div>
                    <button
                      id='dropdownComment1Button'
                      data-dropdown-toggle='dropdownComment1'
                      className='inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600'
                      type='button'
                    >
                      <svg
                        className='w-5 h-5'
                        aria-hidden='true'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
                      </svg>
                      <span className='sr-only'>Comment settings</span>
                    </button>
                  </footer>
                  <p className='mb-2 text-gray-900 dark:text-white'>
                    Hello{' '}
                    <span className='font-medium hover:underline text-primary-600 dark:text-primary-500'>
                      @designteam
                    </span>{' '}
                    Let's schedule a kick-off meeting and workshop this week. It
                    would be great to gather everyone involved in the design
                    project. Let me know about your availability in the thread.
                  </p>
                  <p className='mb-3 text-gray-900 dark:text-white'>
                    Looking forward to it! Thanks.
                  </p>
                </article>
                <hr className='my-5 border-gray-300 dark:border-gray-600' />
                <article className='mb-5'>
                  <footer className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <p className='inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white'>
                        <img
                          className='w-6 h-6 mr-2 rounded-full'
                          src='https://flowbite.com/docs/images/people/profile-picture-3.jpg'
                          alt='Bonnie avatar'
                        />
                        Bonnie Green
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        01/03/2023 4:15 PM
                      </p>
                    </div>
                    <button
                      id='dropdownComment2Button'
                      data-dropdown-toggle='dropdownComment2'
                      className='inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600'
                      type='button'
                    >
                      <svg
                        className='w-5 h-5'
                        aria-hidden='true'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
                      </svg>
                      <span className='sr-only'>Comment settings</span>
                    </button>
                  </footer>
                  <p className='mb-3 text-gray-900 dark:text-white'>
                    Hello everyone,
                  </p>
                  <p className='mb-2 text-gray-900 dark:text-white'>
                    Thank you for the workshop, it was very productive meeting.
                    I can't wait to start working on this new project with you
                    guys. But first things first, I'am waiting for the offer and
                    pitch deck from you. It would be great to get it by the end
                    o the month.
                  </p>
                  <p className='mb-3 text-gray-900 dark:text-white'>Cheers!</p>
                </article>
                <hr className='my-5 border-gray-300 dark:border-gray-600' />
                <article className='mb-2'>
                  <footer className='flex items-center justify-between mb-2'>
                    <div className='flex items-center'>
                      <p className='inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white'>
                        <img
                          className='w-6 h-6 mr-2 rounded-full'
                          src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                          alt='Jese avatar'
                        />
                        Jese Leos
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        01/03/2023 4:15 PM
                      </p>
                    </div>
                  </footer>
                  <p className='mb-2 text-gray-900 dark:text-white'>
                    Ok{' '}
                    <span className='font-medium hover:underline text-primary-600 dark:text-primary-500'>
                      @team
                    </span>{' '}
                    I'am attaching our offer and pitch deck. Take your time to
                    review everything. I'am looking forward to the next steps!
                    Thank you.
                  </p>
                  <p className='mb-3 text-gray-900 dark:text-white'>
                    Looking forward to it! Thanks.
                  </p>
                  <div className='items-center 2xl:space-x-4 2xl:flex'>
                    <div className='flex items-center p-3 mb-3.5 border border-gray-200 dark:border-gray-700 rounded-lg'>
                      <div className='flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-primary-100 dark:bg-primary-900'>
                        <svg
                          className='w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                        >
                          <path
                            clipRule='evenodd'
                            fillRule='evenodd'
                            d='M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z'
                          ></path>
                          <path d='M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z'></path>
                        </svg>
                      </div>
                      <div className='mr-4'>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                          flowbite_offer_345"
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          PDF, 2.3 MB
                        </p>
                      </div>
                      <div className='flex items-center ml-auto'>
                        <button
                          type='button'
                          className='p-2 rounded hover:bg-gray-100'
                        >
                          <svg
                            className='w-5 h-5 text-gray-500 dark:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                          >
                            <path
                              clipRule='evenodd'
                              fillRule='evenodd'
                              d='M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z'
                            ></path>
                          </svg>
                          <span className='sr-only'>Download</span>
                        </button>
                        <button
                          type='button'
                          className='p-2 rounded hover:bg-gray-100'
                        >
                          <svg
                            className='w-5 h-5 text-gray-500 dark:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                          >
                            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z'></path>
                          </svg>
                          <span className='sr-only'>Actions</span>
                        </button>
                      </div>
                    </div>

                    <div className='flex items-center p-3 mb-3.5 border border-gray-200 dark:border-gray-700 rounded-lg'>
                      <div className='flex items-center justify-center w-10 h-10 mr-3 bg-teal-100 rounded-lg dark:bg-teal-900'>
                        <svg
                          className='w-5 h-5 text-teal-600 lg:w-6 lg:h-6 dark:text-teal-300'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                        >
                          <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
                        </svg>
                      </div>
                      <div className='mr-4'>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                          bergside_pitch"
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          PPTX, 10.1 MB
                        </p>
                      </div>
                      <div className='flex items-center ml-auto'>
                        <button
                          type='button'
                          className='p-2 rounded hover:bg-gray-100'
                        >
                          <svg
                            className='w-5 h-5 text-gray-500 dark:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                          >
                            <path
                              clipRule='evenodd'
                              fillRule='evenodd'
                              d='M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z'
                            ></path>
                          </svg>
                          <span className='sr-only'>Download</span>
                        </button>
                        <button
                          type='button'
                          className='p-2 rounded hover:bg-gray-100'
                        >
                          <svg
                            className='w-5 h-5 text-gray-500 dark:text-gray-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                            aria-hidden='true'
                          >
                            <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z'></path>
                          </svg>
                          <span className='sr-only'>Actions</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <hr className='mb-5 border-gray-300 dark:border-gray-600' />
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
                  Ticket #1281
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
                        <div className='inline-flex items-center dark:text-white'>
                          Low
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
                            1h 35m
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
                            10-03-2023 12:45 PM
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
                          <img
                            className='w-6 h-6 rounded-full mr-2'
                            src='https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                            alt='ticket agent'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <span className='block text-base text-gray-900 truncate dark:text-white'>
                            Michael Gough
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
                            Support
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='py-4 hidden'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='w-5 h-5 dark:text-white'
                          aria-hidden='true'
                          focusable='false'
                          data-prefix='fab'
                          data-icon='twitter'
                          role='img'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 512 512'
                        >
                          <path
                            fill='currentColor'
                            d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                          ></path>
                        </svg>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Twitter account
                        </span>
                        <span className='block text-sm font-normal truncate text-primary-700 hover:underline dark:text-primary-500'>
                          www.twitter.com/themesberg
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <span className='px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'>
                          Disconnect
                        </span>
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
