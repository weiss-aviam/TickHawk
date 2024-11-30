import React from 'react'

function TicketFilter () {

  return (
    <div className='items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700'>
      <div className='flex items-center mb-4 sm:mb-0'>
        <form className='sm:pr-3' action='#' method='GET'>
          <label className='sr-only'>Subject of ticket</label>
          <div className='relative w-48 mt-1 sm:w-64 xl:w-96'>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
              placeholder='Subject of ticket'
            />
          </div>
        </form>
        <div className='flex items-center w-full sm:justify-end'>
          <div className='flex pl-1 space-x-1'>
            <span className='inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
              <svg
                className='feather feather-search w-6 h-6'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle cx='11' cy='11' r='8' />
                <line x1='21' x2='16.65' y1='21' y2='16.65' />
              </svg>
            </span>
            <span className='inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TicketFilter
