import type { Activity, ApiResponse, AuthResponse, Enrollment, User, UserRegistration } from "../types"

const API_URL = "http://localhost:8080"

// Helper to get the auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("token")
}

// Helper for making authenticated API requests
const authFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })
}

// Auth services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Decode the JWT token to get user info
        const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]))
        
        // Create minimal user object with just id and role_name
        const user: User = {
          id: tokenPayload.user_id,
          role_name: tokenPayload.role_name,
          email: "", // Required by type but not used
          nombre: "", // Required by type but not used
          apellido: "", // Required by type but not used
          active: true // Required by type but not used
        }

        // Store token and user in localStorage
        localStorage.setItem("token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        localStorage.setItem("user", JSON.stringify(user))

        return {
          success: true,
          message: "Login successful",
          user: user,
          token: data.access_token,
          refreshToken: data.refresh_token,
        }
      } else {
        return {
          success: false,
          message: data.message || "Login failed",
          user: {} as User,
          token: "",
          refreshToken: "",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "Network error",
        user: {} as User,
        token: "",
        refreshToken: "",
      }
    }
  },

  register: async (userData: UserRegistration): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? "Registration successful" : data.message || "Registration failed",
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ access_token: string }>> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      const data = await response.json()

      if (response.ok) {
        // Update token in localStorage
        localStorage.setItem("token", data.access_token)
        return { success: true, data: data }
      } else {
        return { success: false, message: data.message || "Failed to refresh token" }
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await authFetch("/auth/logout", {
        method: "POST",
      })

      // Clear local storage regardless of response
      localStorage.removeItem("token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")

      return {
        success: response.ok,
        message: response.ok ? "Logout successful" : "Logout failed on server",
      }
    } catch (error) {
      // Still clear local storage on error
      localStorage.removeItem("token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")

      return { success: false, message: "Network error during logout" }
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: (): boolean => {
    return !!getToken()
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser()
    return user?.role_name === "admin"
  },
}

// Activity services
export const activityService = {
  getAllActivities: async (filters?: { nombre?: string; dia?: string; categoria?: string }): Promise<
    ApiResponse<Activity[]>
  > => {
    try {
      let queryParams = ""

      if (filters) {
        const params = new URLSearchParams()
        if (filters.nombre) params.append("nombre", filters.nombre)
        if (filters.dia) params.append("dia", filters.dia)
        if (filters.categoria) params.append("categoria", filters.categoria)
        queryParams = `?${params.toString()}`
      }

      const response = await authFetch(`/actividades${queryParams}`)
      const data = await response.json()

      return { success: response.ok, data: data, message: response.ok ? undefined : "Failed to fetch activities" }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },

  getActivityById: async (id: number): Promise<ApiResponse<Activity>> => {
    try {
      const response = await authFetch(`/actividades/${id}`)
      const data = await response.json()

      return { success: response.ok, data: data, message: response.ok ? undefined : "Failed to fetch activity" }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },

  // Admin functions
  createActivity: async (activity: Omit<Activity, "id">): Promise<ApiResponse<Activity>> => {
    try {
      const response = await authFetch("/actividades", {
        method: "POST",
        body: JSON.stringify(activity),
      })
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? "Activity created successfully" : data.message || "Failed to create activity",
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },

  updateActivity: async (id: number, activity: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    try {
      const response = await authFetch(`/actividades/${id}`, {
        method: "PUT",
        body: JSON.stringify(activity),
      })
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? "Activity updated successfully" : data.message || "Failed to update activity",
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },

  deleteActivity: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await authFetch(`/actividades/${id}`, {
        method: "DELETE",
      })

      const data = response.status === 204 ? {} : await response.json()

      return {
        success: response.ok,
        message: response.ok ? "Activity deleted successfully" : data.message || "Failed to delete activity",
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  },
}

// Enrollment services
export const enrollmentService = {
  enrollInActivity: async (activityId: number): Promise<ApiResponse<Enrollment>> => {
    try {
      const response = await authFetch(`/inscripciones/${activityId}`, {
        method: "POST",
      })
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data.data : undefined,
        message: response.ok ? "Inscripción exitosa" : data.error || "Error al inscribirse",
      }
    } catch (error) {
      return { success: false, message: "Error de red" }
    }
  },

  getUserEnrollments: async (): Promise<ApiResponse<Enrollment[]>> => {
    try {
      const response = await authFetch("/inscripciones/usuarios/me")
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? undefined : "Error al obtener inscripciones",
      }
    } catch (error) {
      return { success: false, message: "Error de red" }
    }
  },

  getEnrollmentById: async (enrollmentId: number): Promise<ApiResponse<Enrollment>> => {
    try {
      const response = await authFetch(`/inscripciones/${enrollmentId}`)
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? undefined : "Error al obtener inscripción",
      }
    } catch (error) {
      return { success: false, message: "Error de red" }
    }
  },

  getEnrollmentsByActivity: async (activityId: number): Promise<ApiResponse<Enrollment[]>> => {
    try {
      const response = await authFetch(`/inscripciones/actividad/${activityId}`)
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? undefined : "Error al obtener inscripciones de la actividad",
      }
    } catch (error) {
      return { success: false, message: "Error de red" }
    }
  },

  getAllEnrollments: async (): Promise<ApiResponse<Enrollment[]>> => {
    try {
      const response = await authFetch("/inscripciones/all")
      const data = await response.json()

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        message: response.ok ? undefined : "Error al obtener todas las inscripciones",
      }
    } catch (error) {
      return { success: false, message: "Error de red" }
    }
  },

  cancelEnrollment: async (enrollmentId: number): Promise<ApiResponse<void>> => {
    try {
      const response = await authFetch(`/inscripciones/${enrollmentId}`, {
        method: "DELETE",
      })

      return {
        success: response.ok,
        message: response.ok ? "Inscripción cancelada exitosamente" : "Error al cancelar inscripción",
      }
    } catch (error) {
      return { success: false, message: "Error de red" }
    }
  },
}
