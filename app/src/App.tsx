import React from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import { Route, Routes } from 'react-router-dom'
import NoMatch from './pages/no-match'
import Auth from './pages/auth'
import AuthForgotPassword from 'pages/auth-forgot-password'
// Customer
import HomeCustomer from './pages/customer/home'
import CustomerLayout from 'components/customer/Layout'
import CustomerTicket from 'pages/customer/ticket'
import CustomerReports from 'pages/customer/reports'
import CustomerNewTicket from 'pages/customer/new-ticket'
// Agent & Admin
import BackofficeLayout from 'components/agent/Layout'
import HomeBackoffice from 'pages/agent/home'
import Companies from 'pages/agent/companies'
import NewCompany from 'pages/agent/companies/new'
import EditCompany from 'pages/agent/companies/edit/[id]'
import Departments from 'pages/agent/departments'
import NewDepartment from 'pages/agent/departments/new'
import EditDepartment from 'pages/agent/departments/edit/[id]'
import Users from 'pages/agent/users'
import EditUser from 'pages/agent/users/edit/[id]'
import NewUser from 'pages/agent/users/new'
import NewAgentTicket from 'pages/agent/tickets/new'
import AgentTicketView from 'pages/agent/tickets/view'
import AgentReports from 'pages/agent/reports'
import ProtectedRoute from 'components/ProtectedRoute'
import AuthProvider from 'components/AuthProvider'
import { ToastContainer } from 'react-toastify'
import DialogProvider from 'components/DialogProvider'
import Profile from 'pages/profile'

function App () {
  return (
    <DialogProvider>
      <AuthProvider>
        <ToastContainer
          toastClassName='!border !border-gray-200 dark:!bg-gray-800 dark:!border-gray-600 dark:!text-white'
          position='top-right'
          autoClose={2500}
        />
        <Routes>
          <Route path='' element={<ProtectedRoute />}>
            <Route path='/' element={<CustomerLayout />}>
              <Route path='' element={<HomeCustomer />} />
              <Route path='ticket/:id' element={<CustomerTicket />} />
              <Route path='new-ticket' element={<CustomerNewTicket />} />
              <Route path='reports' element={<CustomerReports />} />
              <Route path='profile' element={<Profile />} />
              <Route path='*' element={<NoMatch />} />
            </Route>
            <Route path='/backoffice' element={<BackofficeLayout />}>
              <Route path='' element={<HomeBackoffice />} />
              <Route path='tickets/new' element={<NewAgentTicket />} />
              <Route path='tickets/:id' element={<AgentTicketView />} />
              <Route path='companies' element={<Companies />} />
              <Route path='companies/new' element={<NewCompany />} />
              <Route path='companies/edit/:id' element={<EditCompany />} />
              <Route path='departments' element={<Departments />} />
              <Route path='departments/new' element={<NewDepartment />} />
              <Route path='departments/edit/:id' element={<EditDepartment />} />
              <Route path='users' element={<Users />} />
              <Route path='users/new' element={<NewUser />} />
              <Route path='users/edit/:id' element={<EditUser />} />
              <Route path='reports' element={<AgentReports />} />
              <Route path='profile' element={<Profile />} />
              <Route path='*' element={<NoMatch />} />
            </Route>
          </Route>
          <Route path='/auth' element={<Auth />} />
          <Route
            path='/auth/forgot-password'
            element={<AuthForgotPassword />}
          />
          <Route path='*' element={<NoMatch />} />
        </Routes>
      </AuthProvider>
    </DialogProvider>
  )
}

export default App
