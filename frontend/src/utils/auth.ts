import type { User } from '../types'

export const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const isAuthenticated = (): boolean => {
  const token = getToken()
  const user = getUserFromStorage()
  return !!(token && user)
}

export const isAdmin = (): boolean => {
  const user = getUserFromStorage()
  return user?.role_name === 'admin'
}

export const getUserName = (): string => {
  const user = getUserFromStorage()
  return user ? `${user.nombre} ${user.apellido}` : ''
}

export const clearAuthData = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
} 