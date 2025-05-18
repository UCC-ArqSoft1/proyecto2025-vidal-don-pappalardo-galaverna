import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { checkAuth } = useAuth()
  
  // Si checkAuth retorna true, renderizar los children
  // Si retorna false, ya se encargó de la redirección
  return checkAuth(requireAdmin) ? <>{children}</> : null
} 