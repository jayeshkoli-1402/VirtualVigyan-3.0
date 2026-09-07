import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, RegistrationData, AuthResponse } from './types';

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => AuthResponse;
  register: (data: RegistrationData) => AuthResponse;
  logout: () => void;
  allUsers: User[];
  deleteUser?: (id: string) => void;
  changeUserRole?: (id: string, newRole: UserRole) => void;
}

const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_admin_01',
    name: 'Administrator (Moderator)',
    email: 'admin@virtualvigyan.in',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-15',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry'],
    passwordHash: 'admin123',
  },
  {
    id: 'usr_teacher_01',
    name: 'Prof. Rajesh Sharma',
    email: 'teacher@virtualvigyan.in',
    role: 'teacher',
    avatar: '👨‍🏫',
    institution: 'DBATU Lonere / Kendriya Vidyalaya',
    department: 'Engineering Chemistry & Applied Sciences',
    teacherId: 'T-CHEM-884',
    studentsCount: 64,
    createdAt: '2026-02-01',
    passwordHash: 'teacher123',
  },
  {
    id: 'usr_student_01',
    name: 'Aarav Patel',
    email: 'student@virtualvigyan.in',
    role: 'student',
    avatar: '🎓',
    grade: 'F.Y. B.Tech (Chemical Engg)',
    school: 'Dr. Babasaheb Ambedkar Tech University',
    completedLabs: 6,
    avgScore: 94,
    createdAt: '2026-02-10',
    passwordHash: 'student123',
  },
  {
    id: 'usr_student_02',
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@school.edu',
    role: 'student',
    avatar: '👩‍🎓',
    grade: 'Class 11 (Science)',
    school: 'Kendriya Vidyalaya No. 1',
    completedLabs: 4,
    avgScore: 88,
    createdAt: '2026-02-18',
    passwordHash: 'student123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<(User & { passwordHash: string })[]>(() => {
    const saved = localStorage.getItem('vv_users_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem('vv_active_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch {
        // fallback
      }
    }
    // Default to guest or null
    return null;
  });

  // Save users db to localStorage on change
  useEffect(() => {
    localStorage.setItem('vv_users_db', JSON.stringify(users));
  }, [users]);

  // Save active session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vv_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vv_active_user');
    }
  }, [currentUser]);

  // Login with auto-detection of role
  const login = (emailOrUsername: string, password: string): AuthResponse => {
    const term = emailOrUsername.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === term ||
          u.name.toLowerCase().includes(term) ||
          (term === 'admin' && u.role === 'admin') ||
          (term === 'teacher' && u.role === 'teacher') ||
          (term === 'student' && u.role === 'student')) &&
        u.passwordHash === password
    );

    if (!found) {
      return {
        success: false,
        message: 'Invalid credentials. Please verify your email / username and password.',
      };
    }

    const { passwordHash: _, ...safeUser } = found;
    setCurrentUser(safeUser);

    return {
      success: true,
      message: `Welcome back, ${safeUser.name}!`,
      role: safeUser.role,
    };
  };

  // Registration: only student or teacher can register
  const register = (data: RegistrationData): AuthResponse => {
    const emailNorm = data.email.trim().toLowerCase();

    // Check if email already registered
    const existing = users.find((u) => u.email.toLowerCase() === emailNorm);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    if (!data.name.trim()) {
      return { success: false, message: 'Please provide your full name.' };
    }

    if (!data.password || data.password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    // Role safety: strictly ensure admin cannot be registered
    if (data.role !== 'student' && data.role !== 'teacher') {
      return { success: false, message: 'Invalid registration role.' };
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: emailNorm,
      role: data.role,
      avatar: data.role === 'teacher' ? '👨‍🏫' : '🎓',
      createdAt: new Date().toISOString().split('T')[0],
      grade: data.grade,
      school: data.school,
      institution: data.institution,
      department: data.department,
      completedLabs: 0,
      avgScore: 0,
      passwordHash: data.password,
    };

    setUsers((prev) => [...prev, newUser]);
    const { passwordHash: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);

    return {
      success: true,
      message: `Account created successfully! Welcome to VirtualVigyan.`,
      role: safeUser.role,
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  const changeUserRole = (id: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const allUsers: User[] = users.map(({ passwordHash: _, ...u }) => u);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        login,
        register,
        logout,
        allUsers,
        deleteUser,
        changeUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
