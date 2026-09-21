export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  // Student attributes
  username?: string;
  grade?: string;
  branch?: string;
  school?: string;
  rollNumber?: string;
  bio?: string;
  profileCompleted?: boolean;
  completedLabs?: number;
  avgScore?: number;
  // Teacher attributes
  institution?: string;
  department?: string;
  teacherId?: string;
  studentsCount?: number;
  // Admin attributes
  permissions?: string[];
}

export interface RegistrationData {
  role: 'student' | 'teacher'; // Admin cannot be registered publicly
  name: string;
  email: string;
  password: string;
  // Role-specific fields
  grade?: string;
  school?: string;
  institution?: string;
  department?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  role?: UserRole;
}
