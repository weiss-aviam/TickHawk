import React from 'react'
import ThemeSelector from '../components/ThemeSelector'
import { Link } from 'react-router-dom'

function AuthForgotPassword () {
  const [errors, setErrors] = React.useState({
    email: '',
  })

  const resetHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value

    if (!email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Invalid email address' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-900  min-h-screen'>
      <div className='flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900'>
        <div className='flex items-center justify-center mt-10 mb-8 text-2xl font-semibold md:mt-0 lg:mb-10 dark:text-white'>
          <span className='text-8xl'>
            <img src='/tickhawk.svg' alt='TickHawk' width={100} height={100} />
          </span>
          <span className='text-4xl'>TickHawk</span>
        </div>
        <div className='w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800 relative'>
          <div className='absolute right-2 top-2'>
            <ThemeSelector />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white !mt-0'>
            Forgot your password?
          </h2>
          <form className='mt-8 space-y-6' onSubmit={resetHandler}>
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
              <div
                className={`transition-all duration-500 ease-in-out ${
                  errors.email ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'
                }`}
              >
                <span className='text-xs text-red-600 dark:text-red-500'>
                  {errors.email}
                </span>
              </div>
            </div>
        
            <div className='flex items-start'>
              <Link
                to={'/auth'}
                className='mr-auto text-sm text-primary-700 hover:underline dark:text-primary-500'
              >
                Already have an account?
              </Link>
              <button
                type='submit'
                className='w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Reset password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthForgotPassword
