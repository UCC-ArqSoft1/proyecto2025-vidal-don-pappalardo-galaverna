import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import type { User, AuthResponse } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser()
        const token = localStorage.getItem('token')

        // Solo consideramos al usuario autenticado si tiene tanto el token como los datos del usuario
        if (storedUser && token) {
          // Verificar que el token no haya expirado
          const tokenPayload = JSON.parse(atob(token.split('.')[1]))
          const expirationTime = tokenPayload.exp * 1000 // Convertir a milisegundos

          if (Date.now() < expirationTime) {
            setUser(storedUser)
          } else {
            // Si el token expiró, limpiar el estado
            await authService.logout()
            setUser(null)
          }
        } else {
          // Si no hay token o usuario, limpiar el estado
          await authService.logout()
          setUser(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // En caso de error, limpiar el estado
        await authService.logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password)
      if (response.success) {
        setUser(response.user)
      }
      return response
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Error al iniciar sesión',
        user: {} as User,
        token: '',
        refreshToken: '',
      }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Aún así, limpiar el estado local
      setUser(null)
      navigate('/login')
    }
  }

  const value = {
    user,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    isAdmin: user?.role_name === 'admin',
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