import React from 'react'

function StatusBadge ({ status }: { status: string }) {
  let color = ''
  let text = ''
  switch (status) {
    case 'completed':
      color = 'green'
      text = 'Completed'
      break
    case 'in-progress':
      color = 'purple'
      text = 'In progress'
      break
    case 'in-review':
      color = 'orange'
      text = 'In review'
      break
    case 'cancelled':
      color = 'red'
      text = 'Cancelled'
      break
    default:
      color = 'gray'
      text = 'Unknown'
  }

  return (
    <span
      className={`bg-${color}-100 text-${color}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-md border border-${color}-100 dark:bg-gray-700 dark:border-${color}-500 dark:text-${color}-400`}
    >
      {text}
    </span>
  )
}

function TicketList () {
  return (
    <table className='min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600'>
      <thead className='bg-gray-100 dark:bg-gray-700'>
        <tr>
          <th scope='col' className='p-4'>
            <div className='flex items-center'>
              <input
                id='checkbox-all'
                aria-describedby='checkbox-1'
                type='checkbox'
                className='w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
              />
              <label className='sr-only'>checkbox</label>
            </div>
          </th>
          <th
            scope='col'
            className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'
          >
            Subjet
          </th>
          <th
            scope='col'
            className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'
          >
            Excerpt
          </th>
          <th
            scope='col'
            className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'
          >
            Company
          </th>
          <th
            scope='col'
            className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'
          >
            Country
          </th>
          <th
            scope='col'
            className='p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400'
          >
            Status
          </th>
          <th
            scope='col'
            className='p-4 max-w-3 font-medium text-left text-gray-500 uppercase dark:text-gray-400'
          ></th>
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
        <tr className='hover:bg-gray-100 dark:hover:bg-gray-700'>
          <td className='w-4 p-4'>
            <div className='flex items-center'>
              <input
                id='checkbox-1'
                aria-describedby='checkbox-1'
                type='checkbox'
                className='w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
              />
              <label className='sr-only'>checkbox</label>
            </div>
          </td>
          <td className='flex items-center p-4 mr-12 space-x-6 whitespace-nowrap'>
            <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>
              <div className='text-base font-semibold text-gray-900 dark:text-white'>
                Error when trying to load the website
              </div>
            </div>
          </td>
          <td className='max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400'>
            I love working with React and Flowbites to create efficient and
            user-friendly interfaces. In my spare time, I enjoys baking, hiking,
            and spending time with my family.
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            Company A
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            United States
          </td>
          <td className='p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white'>
            <div className='flex items-center'>
              <StatusBadge status='cancelled' />
            </div>
          </td>
          <td className='p-4 whitespace-nowrap'>
            <span className='inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700'>
              <svg
                className='w-4 h-4 ml-1 sm:w-5 sm:h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </span>
          </td>
        </tr>

        <tr className='hover:bg-gray-100 dark:hover:bg-gray-700'>
          <td className='w-4 p-4'>
            <div className='flex items-center'>
              <input
                id='checkbox-2'
                aria-describedby='checkbox-1'
                type='checkbox'
                className='w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
              />
              <label className='sr-only'>checkbox</label>
            </div>
          </td>
          <td className='flex items-center p-4 mr-12 space-x-6 whitespace-nowrap'>
            <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>
              <div className='text-base font-semibold text-gray-900 dark:text-white'>
                Roberta Casas
              </div>
            </div>
          </td>
          <td className='max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400'>
            I love working with React and Flowbites to create efficient and
            user-friendly interfaces. In my spare time, I enjoys baking, hiking,
            and spending time with my family.
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            Designer
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            Spain
          </td>
          <td className='p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white'>
            <div className='flex items-center'>
              <StatusBadge status='in-progress' />
            </div>
          </td>
          <td className='p-4 space-x-2 whitespace-nowrap'>
            <span className='inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700'>
              <svg
                className='w-4 h-4 ml-1 sm:w-5 sm:h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </span>
          </td>
        </tr>

        <tr className='hover:bg-gray-100 dark:hover:bg-gray-700'>
          <td className='w-4 p-4'>
            <div className='flex items-center'>
              <input
                id='checkbox-3'
                aria-describedby='checkbox-1'
                type='checkbox'
                className='w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
              />
              <label className='sr-only'>checkbox</label>
            </div>
          </td>
          <td className='flex items-center p-4 mr-12 space-x-6 whitespace-nowrap'>
            <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>
              <div className='text-base font-semibold text-gray-900 dark:text-white'>
                Michael Gough
              </div>
            </div>
          </td>
          <td className='max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400'>
            I love working with React and Flowbites to create efficient and
            user-friendly interfaces. In my spare time, I enjoys baking, hiking,
            and spending time with my family.
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            React developer
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            United Kingdom
          </td>
          <td className='p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white'>
            <div className='flex items-center'>
              <StatusBadge status='completed' />
            </div>
          </td>
          <td className='p-4 space-x-2 whitespace-nowrap'>
            <span className='inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700'>
              <svg
                className='w-4 h-4 ml-1 sm:w-5 sm:h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </span>
          </td>
        </tr>

        <tr className='hover:bg-gray-100 dark:hover:bg-gray-700'>
          <td className='w-4 p-4'>
            <div className='flex items-center'>
              <input
                id='checkbox-3'
                aria-describedby='checkbox-1'
                type='checkbox'
                className='w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
              />
              <label className='sr-only'>checkbox</label>
            </div>
          </td>
          <td className='flex items-center p-4 mr-12 space-x-6 whitespace-nowrap'>
            <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>
              <div className='text-base font-semibold text-gray-900 dark:text-white'>
                Michael Gough
              </div>
            </div>
          </td>
          <td className='max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400'>
            I love working with React and Flowbites to create efficient and
            user-friendly interfaces. In my spare time, I enjoys baking, hiking,
            and spending time with my family.
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            React developer
          </td>
          <td className='p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            United Kingdom
          </td>
          <td className='p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white'>
            <div className='flex items-center'>
              <StatusBadge status='in-review' />
            </div>
          </td>
          <td className='p-4 space-x-2 whitespace-nowrap'>
            <span className='inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700'>
              <svg
                className='w-4 h-4 ml-1 sm:w-5 sm:h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
export default TicketList
