import React from 'react'
import ThemeSelector from '../components/ThemeSelector'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from 'components/AuthProvider'
import { jwtDecode } from 'jwt-decode'

function Auth () {
  const auth = useAuth()
  const navigate = useNavigate()

  const [errors, setErrors] = React.useState({
    email: '',
    password: '',
    global: ''
  })

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value

    if (!email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Invalid email address' }))
      return
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }

    if (password.length < 8) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 8 characters'
      }))
      return
    } else {
      setErrors(prev => ({ ...prev, password: '' }))
    }

    auth.axiosClient
      .post('/auth/sign-in', { email, password })
      .then((response: any) => {
        if (response.status !== 201) {
          setErrors(prev => ({
            ...prev,
            global: "Email or password incorrect"
          }))
          return
        }
        localStorage.setItem('refreshToken', response.data.refreshToken)
        auth.setToken(response.data.accessToken)
        const decode = jwtDecode(response.data.accessToken) as any
        if (decode.role === 'admin' || decode.role === 'agent') {
          navigate('/backoffice')
        } else if (decode.role === 'customer') {
          navigate('/')
        }
      })
      .catch((error: any) => {
        setErrors(prev => ({
          ...prev,
          global: "Email or password incorrect"
        }))
      })
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-900  min-h-screen'>
      <div className='flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900'>
        <div className='flex items-center justify-center mt-10 mb-8 text-2xl font-semibold md:mt-0 lg:mb-10 dark:text-white'>
          <span className='text-8xl'>
            <img
              src='/assets/images/tickhawk.svg'
              alt='TickHawk'
              width={100}
              height={100}
            />
          </span>
          <span className='text-4xl'>TickHawk</span>
        </div>
        <div className='w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800 relative'>
          <div className='absolute right-2 top-2'>
            <ThemeSelector />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white !mt-0'>
            Sign in to platform
          </h2>
          <div
            className={`transition-all duration-500 ease-in-out ${
              errors.global
                ? 'opacity-100 max-h-10  !mt-2'
                : 'opacity-0 max-h-0'
            }`}
          >
            <span className='text-sm text-red-600 dark:text-red-500'>
              {errors.global}
            </span>
          </div>
          <form className='mt-8 space-y-6' onSubmit={loginHandler}>
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
              <div
                className={`transition-all duration-500 ease-in-out ${
                  errors.password ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'
                }`}
              >
                <span className='text-xs text-red-600 dark:text-red-500'>
                  {errors.password}
                </span>
              </div>
            </div>
            <div className='flex items-start'>
              <Link
                to={'/auth/forgot-password'}
                className='mr-auto text-sm text-primary-700 hover:underline dark:text-primary-500'
              >
                Lost Password?
              </Link>
              <button
                type='submit'
                className='w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth
