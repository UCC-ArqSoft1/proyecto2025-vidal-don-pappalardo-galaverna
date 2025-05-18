import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { isAuthenticated as checkAuth, clearAuthData } from '../utils/auth'
import type { AuthResponse } from '../types'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar el estado de autenticación al montar el componente
    setAuthenticated(checkAuth())
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      if (response.success) {
        setAuthenticated(true)
      }
      return response
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Error al iniciar sesión',
        user: {} as any,
        token: '',
        refreshToken: '',
      }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      clearAuthData()
      setAuthenticated(false)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Aún así, limpiar el estado local
      clearAuthData()
      setAuthenticated(false)
      navigate('/login')
    }
  }

  const value = {
    isAuthenticated: authenticated,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}