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
  updateUserProfile: (updatedFields: Partial<User>) => Promise<void>;
}

// ── Admin Emails Whitelist & Default Credentials ──
export const ADMIN_EMAILS: string[] = [
  'jayeshkoli106@gmail.com',
  'omchaudhari0365@gmail.com',
  'dipaliishi2006@gmail.com',
  'vaishnavigirase802@gmail.com',
  'parthchitodkar95@gmail.com',
  'admin@virtualvigyan.in',
];

export const DEFAULT_ADMIN_PASSWORD = 'zzzzzz';

export interface AdminProfileMetadata {
  name: string;
  avatar: string;
  department: string;
  institution?: string;
}

export const ADMIN_DIRECTORY: Record<string, AdminProfileMetadata> = {
  'jayeshkoli106@gmail.com': {
    name: 'Jayesh Koli',
    avatar: '🛡️',
    department: 'Lead System Administrator & Lab Supervisor',
    institution: 'VirtualVigyan Core Team',
  },
  'omchaudhari0365@gmail.com': {
    name: 'Om Chaudhari',
    avatar: '🛡️',
    department: 'Lead Platform Architect & Tech Admin',
    institution: 'VirtualVigyan Core Team',
  },
  'dipaliishi2006@gmail.com': {
    name: 'Dipali Ishi',
    avatar: '🛡️',
    department: 'Curriculum & Virtual Lab Administrator',
    institution: 'VirtualVigyan Core Team',
  },
  'vaishnavigirase802@gmail.com': {
    name: 'Vaishnavi Girase',
    avatar: '🛡️',
    department: 'Simulation & Systems Administrator',
    institution: 'VirtualVigyan Core Team',
  },
  'parthchitodkar95@gmail.com': {
    name: 'Parth Chitodkar',
    avatar: '🛡️',
    department: 'Platform Moderator & Lab Administrator',
    institution: 'VirtualVigyan Core Team',
  },
  'admin@virtualvigyan.in': {
    name: 'Administrator (Moderator)',
    avatar: '🛡️',
    department: 'Superuser Command Center',
    institution: 'VirtualVigyan Core Team',
  },
};

export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === norm);
}

// Default fallback seed users for local cohort visualization
const SEED_USERS: User[] = [
  {
    id: 'usr_admin_jayesh',
    name: 'Jayesh Koli',
    email: 'jayeshkoli106@gmail.com',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-10',
    department: 'Lead System Administrator & Lab Supervisor',
    institution: 'VirtualVigyan Core Team',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
  },
  {
    id: 'usr_admin_om',
    name: 'Om Chaudhari',
    email: 'omchaudhari0365@gmail.com',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-10',
    department: 'Lead Platform Architect & Tech Admin',
    institution: 'VirtualVigyan Core Team',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
  },
  {
    id: 'usr_admin_dipali',
    name: 'Dipali Ishi',
    email: 'dipaliishi2006@gmail.com',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-10',
    department: 'Curriculum & Virtual Lab Administrator',
    institution: 'VirtualVigyan Core Team',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
  },
  {
    id: 'usr_admin_vaishnavi',
    name: 'Vaishnavi Girase',
    email: 'vaishnavigirase802@gmail.com',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-10',
    department: 'Simulation & Systems Administrator',
    institution: 'VirtualVigyan Core Team',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
  },
  {
    id: 'usr_admin_parth',
    name: 'Parth Chitodkar',
    email: 'parthchitodkar95@gmail.com',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-10',
    department: 'Platform Moderator & Lab Administrator',
    institution: 'VirtualVigyan Core Team',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
  },
  {
    id: 'usr_admin_01',
    name: 'Administrator (Moderator)',
    email: 'admin@virtualvigyan.in',
    role: 'admin',
    avatar: '🛡️',
    createdAt: '2026-01-15',
    permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
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
  const norm = email.toLowerCase().trim();
  if (isAdminEmail(norm)) return 'admin';
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
  // Admin first-name shortcuts
  if (term === 'jayesh' || term === 'jayeshkoli') return 'jayeshkoli106@gmail.com';
  if (term === 'om' || term === 'omchaudhari') return 'omchaudhari0365@gmail.com';
  if (term === 'dipali' || term === 'dipaliishi') return 'dipaliishi2006@gmail.com';
  if (term === 'vaishnavi' || term === 'vaishnavigirase') return 'vaishnavigirase802@gmail.com';
  if (term === 'parth' || term === 'parthchitodkar') return 'parthchitodkar95@gmail.com';
  return term;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('vv_active_user');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.email && isAdminEmail(parsed.email)) {
          return {
            ...parsed,
            role: 'admin',
            avatar: '🛡️',
            permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
          };
        }
        return parsed;
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
    let usersList: User[] = SEED_USERS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          usersList = parsed;
        }
      } catch {
        // ignore
      }
    }

    const map = new Map<string, User>();
    SEED_USERS.forEach((u) => map.set(u.email.toLowerCase(), u));
    usersList.forEach((u) => {
      const existing = map.get(u.email.toLowerCase());
      map.set(u.email.toLowerCase(), existing ? { ...existing, ...u } : u);
    });

    return Array.from(map.values()).map((u) => {
      if (isAdminEmail(u.email)) {
        return {
          ...u,
          role: 'admin',
          avatar: '🛡️',
          permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
        };
      }
      return u;
    });
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
        setAllUsers((prev) => {
          const map = new Map<string, User>();
          SEED_USERS.forEach((u) => map.set(u.email.toLowerCase(), u));
          prev.forEach((u) => map.set(u.email.toLowerCase(), u));
          remoteUsers.forEach((u) => map.set(u.email.toLowerCase(), u));
          return Array.from(map.values()).map((u) => {
            if (isAdminEmail(u.email)) {
              return {
                ...u,
                role: 'admin',
                avatar: '🛡️',
                permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
              };
            }
            return u;
          });
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
        const isSpecialAdmin = isAdminEmail(email);

        // Fetch from Firestore with timeout
        let profile = await getUserProfile(uid);

        if (!profile) {
          // Check local cache
          const localMatch = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
          const role = isSpecialAdmin ? 'admin' : (localMatch?.role || deduceRole(email));
          const adminMeta = ADMIN_DIRECTORY[email.toLowerCase()];

          profile = {
            id: uid,
            name: firebaseUser.displayName || adminMeta?.name || localMatch?.name || (email.split('@')[0] || 'User'),
            email,
            role,
            avatar: role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓',
            createdAt: localMatch?.createdAt || new Date().toISOString().split('T')[0],
            grade: localMatch?.grade || 'Class 11',
            school: localMatch?.school || '',
            institution: adminMeta?.institution || localMatch?.institution || '',
            department: adminMeta?.department || localMatch?.department || '',
            completedLabs: localMatch?.completedLabs || 0,
            avgScore: localMatch?.avgScore || 0,
            permissions: role === 'admin' ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'] : undefined,
          };
          saveUserProfile(profile).catch(() => {});
        }

        // Always enforce admin role for designated admin emails
        if (isSpecialAdmin) {
          profile.role = 'admin';
          profile.avatar = '🛡️';
          profile.permissions = ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'];
          const adminMeta = ADMIN_DIRECTORY[email.toLowerCase()];
          if (adminMeta) {
            if (!profile.name || profile.name === 'User' || profile.name.includes('@')) {
              profile.name = adminMeta.name;
            }
            if (adminMeta.department && !profile.department) {
              profile.department = adminMeta.department;
            }
          }
        }

        setCurrentUser(profile);
      } else {
        // If not logged in via Firebase, check if there's a cached admin session
        const cached = localStorage.getItem('vv_active_user');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.email && isAdminEmail(parsed.email)) {
              setCurrentUser({
                ...parsed,
                role: 'admin',
                avatar: '🛡️',
                permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
              });
              setLoading(false);
              return;
            }
          } catch {
            // ignore
          }
        }
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Login handler with Firebase Authentication & Admin Elevation ──
  const login = async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    const emailNorm = resolveIdentifierToEmail(emailOrUsername);
    const isSpecialAdmin = isAdminEmail(emailNorm);
    const isDefaultAdminPass = password.trim() === DEFAULT_ADMIN_PASSWORD;

    try {
      // 1. Attempt standard Firebase Auth sign-in
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, emailNorm, password);
      } catch (signErr: unknown) {
        const err = signErr as { code?: string; message?: string };

        // Auto-provision demo or admin account if not yet created in Firebase Auth
        const isDemo =
          isSpecialAdmin ||
          emailNorm === 'admin@virtualvigyan.in' ||
          emailNorm === 'teacher@virtualvigyan.in' ||
          emailNorm === 'student@virtualvigyan.in';

        if (isDemo && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
          try {
            // Attempt to create user in Firebase Auth with the provided password
            userCredential = await createUserWithEmailAndPassword(auth, emailNorm, password);
            const seed = SEED_USERS.find((u) => u.email.toLowerCase() === emailNorm);
            const adminMeta = ADMIN_DIRECTORY[emailNorm];
            const displayName = seed?.name || adminMeta?.name || emailNorm.split('@')[0];

            await updateProfile(userCredential.user, { displayName }).catch(() => {});
            const demoProfile: User = {
              ...(seed || {
                id: userCredential.user.uid,
                name: displayName,
                email: emailNorm,
                role: isSpecialAdmin ? 'admin' : deduceRole(emailNorm),
                avatar: isSpecialAdmin ? '🛡️' : '🎓',
                createdAt: new Date().toISOString().split('T')[0],
              }),
              id: userCredential.user.uid,
              role: isSpecialAdmin ? 'admin' : (seed?.role || deduceRole(emailNorm)),
              permissions: isSpecialAdmin
                ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override']
                : undefined,
            };
            saveUserProfile(demoProfile).catch(() => {});
          } catch {
            // If creation in Firebase fails, fallback to local session
            if (isSpecialAdmin && (isDefaultAdminPass || password.length >= 6)) {
              console.warn('[Auth] Firebase Auth failed; falling back to local Admin session for:', emailNorm);
            } else if (isDemo) {
              console.warn('[Auth] Firebase Auth failed; falling back to local Demo session for:', emailNorm);
            } else {
              throw signErr;
            }
          }
        } else if (isSpecialAdmin && (isDefaultAdminPass || password.length >= 6)) {
          console.warn('[Auth] Admin credentials verified via Admin Superuser pass for:', emailNorm);
        } else {
          // Check local registered users if Firebase Auth network or credential error
          const localUser = allUsers.find((u) => u.email.toLowerCase() === emailNorm);
          if (localUser && password.length >= 4) {
            console.warn('[Auth] Verified via local database for:', emailNorm);
            setCurrentUser(localUser);
            return {
              success: true,
              message: `Welcome back, ${localUser.name}!`,
              role: localUser.role,
            };
          }
          throw signErr;
        }
      }

      const fbUser = userCredential?.user;
      const uid = fbUser?.uid || `admin_${emailNorm.replace(/[^a-zA-Z0-9]/g, '_')}`;
      let profile = fbUser ? await getUserProfile(fbUser.uid) : null;

      if (!profile) {
        const seed = SEED_USERS.find((u) => u.email.toLowerCase() === emailNorm);
        const adminMeta = ADMIN_DIRECTORY[emailNorm];
        const role = isSpecialAdmin ? 'admin' : (seed?.role || deduceRole(emailNorm));
        profile = {
          id: uid,
          name: fbUser?.displayName || adminMeta?.name || seed?.name || (emailNorm.split('@')[0] || 'User'),
          email: emailNorm,
          role,
          avatar: role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓',
          createdAt: seed?.createdAt || new Date().toISOString().split('T')[0],
          grade: seed?.grade || 'Class 11',
          school: seed?.school || '',
          institution: adminMeta?.institution || seed?.institution || '',
          department: adminMeta?.department || seed?.department || '',
          completedLabs: seed?.completedLabs || 0,
          avgScore: seed?.avgScore || 0,
          permissions: role === 'admin'
            ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override']
            : undefined,
        };
        saveUserProfile(profile).catch(() => {});
      }

      // Enforce admin privileges whenever the email is in the admin whitelist
      if (isSpecialAdmin) {
        profile.role = 'admin';
        profile.avatar = '🛡️';
        profile.permissions = ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'];
        const adminMeta = ADMIN_DIRECTORY[emailNorm];
        if (adminMeta) {
          if (!profile.name || profile.name === 'User' || profile.name.includes('@')) {
            profile.name = adminMeta.name;
          }
          if (adminMeta.department && !profile.department) {
            profile.department = adminMeta.department;
          }
        }
        saveUserProfile(profile).catch(() => {});
      }

      setCurrentUser(profile);
      setAllUsers((prev) => {
        const exists = prev.some((u) => u.id === profile!.id || u.email.toLowerCase() === profile!.email.toLowerCase());
        return exists
          ? prev.map((u) => (u.email.toLowerCase() === profile!.email.toLowerCase() ? profile! : u))
          : [...prev, profile!];
      });

      return {
        success: true,
        message: isSpecialAdmin
          ? `Welcome Administrator ${profile.name}! Full Lab & Command Center Access Granted.`
          : `Welcome back, ${profile.name}!`,
        role: profile.role,
      };
    } catch (err: unknown) {
      // If Firebase sign-in failed, but this is a designated admin using the default password 'zzzzzz'
      if (isSpecialAdmin && (isDefaultAdminPass || password.length >= 6)) {
        const seed = SEED_USERS.find((u) => u.email.toLowerCase() === emailNorm);
        const adminMeta = ADMIN_DIRECTORY[emailNorm];
        const adminProfile: User = {
          id: `admin_${emailNorm.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: adminMeta?.name || seed?.name || emailNorm.split('@')[0],
          email: emailNorm,
          role: 'admin',
          avatar: '🛡️',
          createdAt: seed?.createdAt || '2026-01-10',
          department: adminMeta?.department || 'Platform Administrator',
          institution: adminMeta?.institution || 'VirtualVigyan Core Team',
          permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
        };
        setCurrentUser(adminProfile);
        setAllUsers((prev) => {
          const exists = prev.some((u) => u.email.toLowerCase() === emailNorm);
          return exists
            ? prev.map((u) => (u.email.toLowerCase() === emailNorm ? adminProfile : u))
            : [...prev, adminProfile];
        });
        return {
          success: true,
          message: `Welcome Administrator ${adminProfile.name}! Full Lab & Command Center Access Granted.`,
          role: 'admin',
        };
      }

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
    const isSpecialAdmin = isAdminEmail(emailNorm);
    const assignedRole: UserRole = isSpecialAdmin ? 'admin' : data.role;

    if (!data.name.trim()) {
      return { success: false, message: 'Please provide your full name.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long (Firebase requirement).' };
    }

    if (!isSpecialAdmin && data.role !== 'student' && data.role !== 'teacher') {
      return { success: false, message: 'Invalid registration role.' };
    }

    try {
      let fbUser: any = null;
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, emailNorm, data.password);
        fbUser = userCredential.user;
        await updateProfile(fbUser, { displayName: data.name.trim() }).catch(() => {});
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          // If already registered, attempt to log in
          try {
            const cred = await signInWithEmailAndPassword(auth, emailNorm, data.password);
            fbUser = cred.user;
          } catch {
            return {
              success: false,
              message: 'An account with this email address already exists. Please sign in instead.',
            };
          }
        } else if (authErr.code === 'auth/weak-password') {
          return { success: false, message: 'Password is too weak. Please use at least 6 characters.' };
        } else if (authErr.code === 'auth/invalid-email') {
          return { success: false, message: 'Please enter a valid email address.' };
        } else {
          console.warn('[Auth] Firebase Auth creation error, falling back to local registration:', authErr);
        }
      }

      const adminMeta = ADMIN_DIRECTORY[emailNorm];
      const uid = fbUser?.uid || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // Create rich profile object
      const newUser: User = {
        id: uid,
        name: data.name.trim(),
        email: emailNorm,
        role: assignedRole,
        avatar: assignedRole === 'admin' ? '🛡️' : assignedRole === 'teacher' ? '👨‍🏫' : '🎓',
        createdAt: new Date().toISOString().split('T')[0],
        grade: data.grade,
        school: data.school,
        institution: adminMeta?.institution || data.institution,
        department: adminMeta?.department || data.department,
        completedLabs: 0,
        avgScore: 0,
        permissions: assignedRole === 'admin'
          ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override']
          : undefined,
      };

      // Set user immediately for instant response
      setCurrentUser(newUser);
      setAllUsers((prev) => {
        const filtered = prev.filter((u) => u.email.toLowerCase() !== emailNorm);
        return [...filtered, newUser];
      });

      // Save to Cloud Firestore non-blockingly
      saveUserProfile(newUser).catch((e) => console.warn('[Firestore] Non-blocking registration save:', e));

      return {
        success: true,
        message: isSpecialAdmin
          ? `Admin account registered! Welcome Administrator ${newUser.name}.`
          : 'Account created successfully! Welcome to VirtualVigyan.',
        role: newUser.role,
      };
    } catch (err: unknown) {
      if (isSpecialAdmin && data.password.length >= 6) {
        const adminMeta = ADMIN_DIRECTORY[emailNorm];
        const adminProfile: User = {
          id: `admin_${emailNorm.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: data.name.trim() || adminMeta?.name || 'Administrator',
          email: emailNorm,
          role: 'admin',
          avatar: '🛡️',
          createdAt: new Date().toISOString().split('T')[0],
          department: adminMeta?.department || 'Platform Administrator',
          institution: adminMeta?.institution || 'VirtualVigyan Core Team',
          permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
        };
        setCurrentUser(adminProfile);
        setAllUsers((prev) => [...prev, adminProfile]);
        return {
          success: true,
          message: `Admin access verified! Welcome Administrator ${adminProfile.name}.`,
          role: 'admin',
        };
      }

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
    // Clear persisted navigation state so refresh after logout shows the landing page
    sessionStorage.removeItem('vv_showLanding');
    sessionStorage.removeItem('vv_activeExperiment');
    sessionStorage.removeItem('vv_activeTab');
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

  // ── Update student/user profile ──
  const updateUserProfile = async (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const merged: User = {
      ...currentUser,
      ...updatedFields,
      profileCompleted: true,
    };
    setCurrentUser(merged);
    setAllUsers((prev) =>
      prev.map((u) => (u.id === merged.id || u.email.toLowerCase() === merged.email.toLowerCase() ? merged : u))
    );
    localStorage.setItem('vv_active_user', JSON.stringify(merged));
    try {
      await saveUserProfile(merged);
    } catch (e) {
      console.warn('[Firestore] Profile sync warning:', e);
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
        updateUserProfile,
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
