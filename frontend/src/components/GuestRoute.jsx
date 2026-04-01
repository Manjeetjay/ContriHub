import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate replace to="/profile" />
  }

  return children
}

export default GuestRoute
