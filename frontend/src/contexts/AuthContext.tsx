import { createContext, useContext, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../utils/auth'

interface AuthContextType {
  checkAuth: (requireAdmin?: boolean) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const checkAuth = (requireAdmin = false) => {
    const authenticated = isAuthenticated()
    
    if (!authenticated) {
      navigate('/login')
      return false
    }

    if (requireAdmin && !isAdmin()) {
      navigate('/')
      return false
    }

    return true
  }

  return (
    <AuthContext.Provider value={{ checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}