import React from 'react'

function Settings () {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <div className='container px-4 pt-20 mx-auto sm:pt-24 md:pt-24 lg:px-0 dark:bg-gray-900'>
        <div className='grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900'>
          <div className='mb-4 col-span-full xl:mb-2'>
            <h1 className='text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white'>
              User settings
            </h1>
          </div>
          <div className='col-span-full xl:col-auto'>
            <div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <div className='items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4'>
                <img
                  className='mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0'
                  src='https://flowbite-admin-dashboard.vercel.app/images/users/bonnie-green-2x.png'
                  alt='Jese'
                />
                <div>
                  <h3 className='mb-1 text-xl font-bold text-gray-900 dark:text-white'>
                    Profile picture
                  </h3>
                  <div className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
                    JPG, GIF or PNG. Max size of 800K
                  </div>
                  <div className='flex items-center space-x-4'>
                    <button
                      type='button'
                      className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                    >
                      <svg
                        className='w-4 h-4 mr-2 -ml-1'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z'></path>
                        <path d='M9 13h2v5a1 1 0 11-2 0v-5z'></path>
                      </svg>
                      Upload picture
                    </button>
                    <button
                      type='button'
                      className='py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                Language &amp; Time
              </h3>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Select language
                </label>
                <select
                  id='settings-language'
                  name='countries'
                  className='bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                >
                  <option>English (US)</option>
                  <option>Español (España)</option>
                </select>
              </div>
              <div>
                <button className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
                  Save all
                </button>
              </div>
            </div>
          </div>
          <div className='col-span-2'>
            <div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                General information
              </h3>
              <form action='#'>
                <div className='grid grid-cols-6 gap-6'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      First Name
                    </label>
                    <input
                      type='text'
                      name='first-name'
                      id='first-name'
                      className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Bonnie'
                    />
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      name='last-name'
                      id='last-name'
                      className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Green'
                    />
                  </div>
                  <div className='col-span-6 sm:col-full'>
                    <button
                      className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                      type='submit'
                    >
                      Save all
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className='p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                Password information
              </h3>
              <form action='#'>
                <div className='grid grid-cols-6 gap-6'>
                  <div className='col-span-6 sm:col-span-3'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Current password
                    </label>
                    <input
                      type='text'
                      name='current-password'
                      id='current-password'
                      className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='••••••••'
                    />
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      New password
                    </label>
                    <input
                      data-popover-target='popover-password'
                      data-popover-placement='bottom'
                      type='password'
                      id='password'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='••••••••'
                    />
                  </div>
                  <div className='col-span-6 sm:col-span-3'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Confirm password
                    </label>
                    <input
                      type='text'
                      name='confirm-password'
                      id='confirm-password'
                      className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='••••••••'
                    />
                  </div>
                  <div className='col-span-6 sm:col-full'>
                    <button
                      className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                      type='submit'
                    >
                      Save all
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
