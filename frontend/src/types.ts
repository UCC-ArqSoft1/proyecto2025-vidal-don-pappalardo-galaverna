// User related interfaces
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  active: boolean
  role_id: number
}

export interface UserRegistration {
  nombre: string
  apellido: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: User
  token: string
  refreshToken: string
}

// Activity related interfaces
export interface Activity {
  id?: number
  titulo: string
  descripcion: string
  dia: string
  horario: string
  duracion: number
  cupo: number
  categoria: string
  instructor: string
  imagen_url?: string
  active?: boolean
}

// Enrollment related interfaces
export interface Enrollment {
  id: number
  usuarioId: number
  actividadId: number
  fechaInscripcion: string
  actividad?: Activity
}

// Generic API response
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export interface NavLink {
  to: string
  label: string
}

export interface FooterLink {
  to: string
  label: string
}