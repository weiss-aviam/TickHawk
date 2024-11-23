import React from 'react'
import TwSizeIndicator from 'components/TwSizeIndicator'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout () {
  return (
    <main className='bg-gray-50 dark:bg-gray-800 min-h-screen'>
      <TwSizeIndicator />
      <Header />
      <Outlet />
    </main>
  )
}

export default Layout
