// User related interfaces
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  active: boolean
  role_name: string
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
  inscritos: number
  categoria: string
  imagen_data?: string
  imagen_type?: string
  active: boolean
  instructor: string
  profesor_id: number
  profesor?: {
    id: number
    nombre: string
  }
  created_at?: string
  updated_at?: string
}

export interface DeleteActivityResponse {
  mensaje: string
  inscripciones_eliminadas?: boolean
}

// Enrollment related interfaces
export interface Enrollment {
  id: number
  usuario_id: number
  actividad_id: number
  fecha_inscripcion: string
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

export interface Instructor {
  id: number
  nombre: string
  apellido: string
  email: string
}