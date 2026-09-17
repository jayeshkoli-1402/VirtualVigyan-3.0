import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  getUserProfile,
  saveUserProfile,
  getAllUserProfiles,
  updateUserRoleInFirestore,
  deleteUserFromFirestore,
  setFirestoreStatusListener,
  isFirestoreLocked,
  type FirestoreStatus,
} from '../firebase/firestoreService';
import type { User, UserRole, RegistrationData, AuthResponse } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<AuthResponse>;
  register: (data: RegistrationData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  allUsers: User[];
  deleteUser?: (id: string) => Promise<void>;
  changeUserRole?: (id: string, newRole: UserRole) => Promise<void>;
  firestoreLocked: boolean;
  firestoreMessage: string | null;
  refreshUsers: () => Promise<void>;
}

// Default fallback seed users for local cohort visualization
const SEED_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Administrator (Moderator)',
    email: 'admin@virtualvigyan.in',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-15',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry'],
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
  },
];

// Helper to deduce initial role from email/identifier
function deduceRole(email: string): UserRole {
  const norm = email.toLowerCase();
  if (norm.includes('admin')) return 'admin';
  if (norm.includes('teacher') || norm.includes('prof') || norm.includes('faculty')) return 'teacher';
  return 'student';
}

// Map username shortcuts to emails
function resolveIdentifierToEmail(identifier: string): string {
  const term = identifier.trim().toLowerCase();
  if (term === 'admin') return 'admin@virtualvigyan.in';
  if (term === 'teacher') return 'teacher@virtualvigyan.in';
  if (term === 'student') return 'student@virtualvigyan.in';
  if (term === 'aarav') return 'student@virtualvigyan.in';
  return term;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('vv_active_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [firestoreLockedState, setFirestoreLockedState] = useState(isFirestoreLocked());
  const [firestoreMessage, setFirestoreMessage] = useState<string | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vv_users_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return SEED_USERS;
  });

  // Listen to Firestore status changes (locked mode / permission-denied detection)
  useEffect(() => {
    setFirestoreStatusListener((status: FirestoreStatus) => {
      setFirestoreLockedState(status.isLocked);
      if (status.message) {
        setFirestoreMessage(status.message);
      }
    });
  }, []);

  // Save active user to local cache for instant reload
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vv_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vv_active_user');
    }
  }, [currentUser]);

  // Save users to local cache
  useEffect(() => {
    localStorage.setItem('vv_users_db', JSON.stringify(allUsers));
  }, [allUsers]);

  // Load all users from Firestore
  const refreshUsers = useCallback(async () => {
    try {
      const remoteUsers = await getAllUserProfiles();
      if (remoteUsers && remoteUsers.length > 0) {
        // Merge with existing SEED_USERS so demo accounts remain visible
        setAllUsers((prev) => {
          const map = new Map<string, User>();
          SEED_USERS.forEach((u) => map.set(u.email.toLowerCase(), u));
          prev.forEach((u) => map.set(u.email.toLowerCase(), u));
          remoteUsers.forEach((u) => map.set(u.email.toLowerCase(), u));
          return Array.from(map.values());
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Firebase Auth State Listener (Restores session automatically on reload)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const email = firebaseUser.email || '';

        // Fetch from Firestore
        let profile = await getUserProfile(uid);

        if (!profile) {
          // Check local cache
          const localMatch = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
          const role = localMatch?.role || deduceRole(email);
          profile = {
            id: uid,
            name: firebaseUser.displayName || localMatch?.name || (email.split('@')[0] || 'User'),
            email,
            role,
            avatar: role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓',
            createdAt: localMatch?.createdAt || new Date().toISOString().split('T')[0],
            grade: localMatch?.grade || 'Class 11',
            school: localMatch?.school || '',
            institution: localMatch?.institution || '',
            department: localMatch?.department || '',
            completedLabs: localMatch?.completedLabs || 0,
            avgScore: localMatch?.avgScore || 0,
          };
          // Try saving to Firestore
          await saveUserProfile(profile);
        }

        setCurrentUser(profile);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
      refreshUsers();
    });

    return () => unsubscribe();
  }, [refreshUsers, allUsers]);

  // ── Login handler with Firebase Authentication ──
  const login = async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    const emailNorm = resolveIdentifierToEmail(emailOrUsername);

    try {
      // 1. Attempt standard Firebase Auth sign-in
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, emailNorm, password);
      } catch (signErr: unknown) {
        const err = signErr as { code?: string; message?: string };

        // Auto-provision demo account if not yet created in Firebase Auth
        const isDemo =
          emailNorm === 'admin@virtualvigyan.in' ||
          emailNorm === 'teacher@virtualvigyan.in' ||
          emailNorm === 'student@virtualvigyan.in';

        if (isDemo && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, emailNorm, password);
            const seed = SEED_USERS.find((u) => u.email === emailNorm);
            if (seed) {
              await updateProfile(userCredential.user, { displayName: seed.name });
              const demoProfile: User = { ...seed, id: userCredential.user.uid };
              await saveUserProfile(demoProfile);
            }
          } catch {
            throw signErr;
          }
        } else {
          throw signErr;
        }
      }

      const fbUser = userCredential.user;
      let profile = await getUserProfile(fbUser.uid);

      if (!profile) {
        const seed = SEED_USERS.find((u) => u.email.toLowerCase() === emailNorm);
        const role = seed?.role || deduceRole(emailNorm);
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || seed?.name || (emailNorm.split('@')[0] || 'User'),
          email: emailNorm,
          role,
          avatar: role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓',
          createdAt: new Date().toISOString().split('T')[0],
          grade: seed?.grade || 'Class 11',
          school: seed?.school || '',
          institution: seed?.institution || '',
          department: seed?.department || '',
          completedLabs: seed?.completedLabs || 0,
          avgScore: seed?.avgScore || 0,
        };
        await saveUserProfile(profile);
      }

      setCurrentUser(profile);
      setAllUsers((prev) => {
        const exists = prev.some((u) => u.id === profile!.id || u.email === profile!.email);
        return exists ? prev.map((u) => (u.email === profile!.email ? profile! : u)) : [...prev, profile!];
      });

      return {
        success: true,
        message: `Welcome back, ${profile.name}!`,
        role: profile.role,
      };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let message = 'Invalid credentials. Please verify your email / username and password.';

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found for this email. Please register to create an account.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed sign-in attempts. Please wait a moment or reset your password.';
      }

      return {
        success: false,
        message,
      };
    }
  };

  // ── Registration handler with Firebase Authentication ──
  const register = async (data: RegistrationData): Promise<AuthResponse> => {
    const emailNorm = data.email.trim().toLowerCase();

    if (!data.name.trim()) {
      return { success: false, message: 'Please provide your full name.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long (Firebase requirement).' };
    }

    if (data.role !== 'student' && data.role !== 'teacher') {
      return { success: false, message: 'Invalid registration role.' };
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, emailNorm, data.password);
      const fbUser = userCredential.user;

      // Update Firebase Auth profile display name
      await updateProfile(fbUser, { displayName: data.name.trim() });

      // Create rich profile object
      const newUser: User = {
        id: fbUser.uid,
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
      };

      // Save to Cloud Firestore
      await saveUserProfile(newUser);

      // Update state
      setCurrentUser(newUser);
      setAllUsers((prev) => [...prev, newUser]);

      return {
        success: true,
        message: 'Account created successfully! Welcome to VirtualVigyan.',
        role: newUser.role,
      };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let message = 'Registration failed. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email address already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters with numbers or symbols.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'The email address format is not valid. Please verify.';
      }

      return {
        success: false,
        message,
      };
    }
  };

  // ── Logout handler ──
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut error:', err);
    }
    setCurrentUser(null);
  };

  // ── Delete user (Admin capability) ──
  const deleteUser = async (id: string) => {
    try {
      await deleteUserFromFirestore(id);
    } catch {
      // handled
    }
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) {
      await logout();
    }
  };

  // ── Change user role (Admin capability) ──
  const changeUserRole = async (id: string, newRole: UserRole) => {
    try {
      await updateUserRoleInFirestore(id, newRole);
    } catch {
      // handled
    }
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        loading,
        login,
        register,
        logout,
        allUsers,
        deleteUser,
        changeUserRole,
        firestoreLocked: firestoreLockedState,
        firestoreMessage,
        refreshUsers,
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
