import { Activity, ApiResponse, AuthResponse, Enrollment, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to get the auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper for making authenticated API requests
const authFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

// Auth services
export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      } else {
        return { success: false, message: data.message || 'Login failed', user: {} as User, token: '' };
      }
    } catch (error) {
      return { success: false, message: 'Network error', user: {} as User, token: '' };
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!getToken();
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
};

// Activity services
export const activityService = {
  getAllActivities: async (searchTerm?: string): Promise<ApiResponse<Activity[]>> => {
    try {
      const queryParams = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await authFetch(`/activities${queryParams}`);
      const data = await response.json();
      
      return { success: response.ok, data: data, message: response.ok ? undefined : 'Failed to fetch activities' };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  getActivityById: async (id: number): Promise<ApiResponse<Activity>> => {
    try {
      const response = await authFetch(`/activities/${id}`);
      const data = await response.json();
      
      return { success: response.ok, data: data, message: response.ok ? undefined : 'Failed to fetch activity' };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  enrollInActivity: async (activityId: number): Promise<ApiResponse<Enrollment>> => {
    try {
      const response = await authFetch(`/activities/${activityId}/enroll`, {
        method: 'POST',
      });
      const data = await response.json();
      
      return { success: response.ok, data: data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  getUserEnrollments: async (): Promise<ApiResponse<Enrollment[]>> => {
    try {
      const response = await authFetch('/enrollments');
      const data = await response.json();
      
      return { success: response.ok, data: data, message: response.ok ? undefined : 'Failed to fetch enrollments' };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  // Admin functions
  createActivity: async (activity: Omit<Activity, 'id'>): Promise<ApiResponse<Activity>> => {
    try {
      const response = await authFetch('/activities', {
        method: 'POST',
        body: JSON.stringify(activity),
      });
      const data = await response.json();
      
      return { success: response.ok, data: data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  updateActivity: async (id: number, activity: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    try {
      const response = await authFetch(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(activity),
      });
      const data = await response.json();
      
      return { success: response.ok, data: data, message: data.message };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  deleteActivity: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await authFetch(`/activities/${id}`, {
        method: 'DELETE',
      });
      
      const data = response.status === 204 ? {} : await response.json();
      
      return { 
        success: response.ok, 
        message: response.ok ? 'Activity deleted successfully' : (data.message || 'Failed to delete activity') 
      };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },
};