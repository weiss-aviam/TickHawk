import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import NoMatch from './pages/no-match'
import Layout from './pages/layout'
import AuthCustomer from './pages/customer/auth'
import HomeCustomer from './pages/customer/home'

function App () {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<HomeCustomer />} />
        <Route path='/auth' element={<AuthCustomer />} />
        <Route path='*' element={<NoMatch />} />
      </Route>
      <Route path='/agent' element={<Layout />}>
        <Route path='*' element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

export default App
