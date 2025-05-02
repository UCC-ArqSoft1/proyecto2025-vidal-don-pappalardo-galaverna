// Define main types/interfaces used throughout the application

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'socio' | 'admin'; // The two roles mentioned in requirements
    token?: string;
  }
  
  export interface Activity {
    id: number;
    title: string;
    description: string;
    category: string;
    day: string;
    startTime: string;
    endTime: string;
    duration: number; // In minutes
    instructor: string;
    capacity: number;
    enrolledCount: number;
    imageUrl: string;
  }
  
  export interface Enrollment {
    id: number;
    userId: number;
    activityId: number;
    enrollmentDate: string;
    activity?: Activity;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
    success: boolean;
    message?: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
  }