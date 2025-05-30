import type { ApiResponse } from '../types'

export const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json()
  if (response.ok) {
    return {
      success: true,
      data: data,
      message: ''
    }
  } else {
    return {
      success: false,
      data: undefined,
      message: data.error || 'Error en la solicitud'
    }
  }
}

export const handleError = (error: any): ApiResponse<any> => {
  return {
    success: false,
    data: undefined,
    message: error.message || 'Error en la solicitud'
  }
} 