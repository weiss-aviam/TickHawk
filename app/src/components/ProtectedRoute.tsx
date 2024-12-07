import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { jwtDecode } from 'jwt-decode'

function ProtectedRoute () {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to='/auth' />
  }

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000
    if (!decodedToken || !decodedToken.exp || decodedToken.exp < currentTime) {
      return <Navigate to='/auth' />
    }
  } catch (error) {
    return <Navigate to='/auth' />
  }

  return <Outlet />
}

export default ProtectedRoute
