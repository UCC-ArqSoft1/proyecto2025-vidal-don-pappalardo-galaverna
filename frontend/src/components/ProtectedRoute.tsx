import { useNavigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../utils/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const authenticated = isAuthenticated()
  
  if (!authenticated) {
    navigate('/login')
    return null
  }

  if (requireAdmin && !isAdmin()) {
    navigate('/')
    return null
  }

  return <>{children}</>
} 