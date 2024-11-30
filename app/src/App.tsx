import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import NoMatch from './pages/no-match'
import Auth from './pages/auth'
import AuthForgotPassword from 'pages/auth-forgot-password'
// Customer
import HomeCustomer from './pages/customer/home'
import CustomerLayout from 'components/customer/Layout'
import CustomerTicket from 'pages/customer/ticket'
import CustomerReports from 'pages/customer/reports'
import CustomerSettings from 'pages/customer/settings'
// Agent
import Layout from 'pages/layout'
import ProtectedRoute from 'components/ProtectedRoute'

function App () {
  return (
    <Routes>
      <Route path='' element={<ProtectedRoute />}>
        <Route path='/' element={<CustomerLayout />}>
          <Route path='' element={<HomeCustomer />} />
          <Route path='ticket/:id' element={<CustomerTicket />} />
          <Route path='reports' element={<CustomerReports />} />
          <Route path='settings' element={<CustomerSettings />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
        <Route path='/agent' element={<Layout />}>
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Route>
      <Route path='/auth' element={<Auth />} />
      <Route path='/auth/forgot-password' element={<AuthForgotPassword />} />
      <Route path='*' element={<NoMatch />} />
    </Routes>
  )
}

export default App
