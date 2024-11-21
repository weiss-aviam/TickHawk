import React from 'react'
import Header from './header'
import TicketList from 'components/customer/TicketList'

function Home () {
  return (
    <div>
      <Header />
      <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='container px-4 pt-20 mx-auto md:pt-24 lg:px-0 dark:bg-gray-900'>
          <div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
            <h3 className='mb-4 text-xl font-semibold dark:text-white'>
              Tickets
            </h3>
            <div className='flex flex-col'>
              <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                  <div className='overflow-hidden shadow'>
                    <TicketList />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
