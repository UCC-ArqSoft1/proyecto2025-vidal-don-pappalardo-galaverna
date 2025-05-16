export interface Activity {
  id: number
  title: string
  description: string
  image?: string
  schedule: string
  duration: string
  capacity: number
  category: string
  instructor: string
}

export interface NavLink {
  to: string
  label: string
}

export interface FooterLink {
  to: string
  label: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ActivityFormData {
  title: string
  description: string
  photo?: File | null
  day: string
  time: string
  duration: string
  capacity: number
  category: string
  instructor: string
}

export interface UserActivity {
  id: number
  name: string
  date: string
  time: string
}


export interface User {
  id: number
  username: string
  email: string
  role: string
  name?: string
  profileImage?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user: User
  token: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface Enrollment {
  id: number
  userId: number
  activityId: number
  enrollmentDate: string
  status: "active" | "cancelled"
  activity?: Activity
}
