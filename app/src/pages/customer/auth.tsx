import React from 'react'

function Auth () {
  return (
    <main className='bg-gray-50 dark:bg-gray-900  min-h-screen'>
      <div className='flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900'>
        <a
          href='https://flowbite-admin-dashboard.vercel.app/'
          className='flex items-center justify-center mt-10 mb-8 text-2xl font-semibold md:mt-0 lg:mb-10 dark:text-white'
        >
          <span className='text-8xl'>🦅</span>
          <span className='text-4xl'>TickHawk</span>
        </a>
        <div className='w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Sign in to platform
          </h2>
          <form className='mt-8 space-y-6' action='#'>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Your email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                placeholder='name@company.com'
              />
            </div>
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Your password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
              />
            </div>
            <div className='flex items-start'>
              <div className='flex items-center h-5'>
                <input
                  id='remember'
                  aria-describedby='remember'
                  name='remember'
                  type='checkbox'
                  className='w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600'
                />
              </div>
              <a
                href='#'
                className='ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500'
              >
                Lost Password?
              </a>
            </div>
            <button
              type='submit'
              className='w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              Login to your account
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Auth
