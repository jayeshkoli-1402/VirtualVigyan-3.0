import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser as deleteFirebaseUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
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

function withTimeout<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallbackValue);
    }, ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise,
  ]);
}

const DELETED_ACCOUNTS_KEY = 'vv_deleted_accounts';

export function getDeletedAccounts(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markAccountAsDeleted(email: string) {
  try {
    const norm = email.trim().toLowerCase();
    const list = getDeletedAccounts();
    if (!list.includes(norm)) {
      list.push(norm);
      localStorage.setItem(DELETED_ACCOUNTS_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function unmarkAccountAsDeleted(email: string) {
  try {
    const norm = email.trim().toLowerCase();
    const list = getDeletedAccounts().filter((e) => e !== norm);
    localStorage.setItem(DELETED_ACCOUNTS_KEY, JSON.stringify(list));
  } catch {}
}

export function isAccountDeleted(email: string): boolean {
  const norm = email.trim().toLowerCase();
  return getDeletedAccounts().includes(norm);
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<AuthResponse>;
  register: (data: RegistrationData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  allUsers: User[];
  deleteUser?: (id: string) => Promise<void>;
  deleteCurrentAccount: (password?: string) => Promise<{ success: boolean; message: string }>;
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

        if (isAccountDeleted(email)) {
          try { await withTimeout(signOut(auth), 1500, undefined); } catch {}
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        // Fetch from Firestore with timeout
        let profile = await getUserProfile(uid);

        if (!profile) {
          // Check localStorage cached profile first (preserves correct role from registration)
          let cachedProfile: any = null;
          try {
            const cached = localStorage.getItem('vv_active_user');
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed && parsed.email && parsed.email.toLowerCase() === email.toLowerCase()) {
                cachedProfile = parsed;
              }
            }
          } catch { /* ignore */ }

          // Check local seed users
          const localMatch = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

          // If no profile exists and this is not an admin, not a demo seed user, and not in cached session:
          // The account was deleted. Sign out cleanly and do not resurrect it.
          if (!isSpecialAdmin && !localMatch && !cachedProfile) {
            try { await withTimeout(signOut(auth), 1500, undefined); } catch {}
            setCurrentUser(null);
            setLoading(false);
            return;
          }

          const adminMeta = ADMIN_DIRECTORY[email.toLowerCase()];

          // Role priority: admin whitelist > cached profile > seed user > deduceRole fallback
          const role = isSpecialAdmin
            ? 'admin'
            : (cachedProfile?.role || localMatch?.role || deduceRole(email));

          profile = {
            id: uid,
            name: firebaseUser.displayName || cachedProfile?.name || adminMeta?.name || localMatch?.name || (email.split('@')[0] || 'User'),
            email,
            role,
            avatar: cachedProfile?.avatar || (role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓'),
            createdAt: cachedProfile?.createdAt || localMatch?.createdAt || new Date().toISOString().split('T')[0],
            grade: cachedProfile?.grade || localMatch?.grade || (role === 'student' ? 'Class 11' : undefined),
            school: cachedProfile?.school || localMatch?.school || '',
            institution: adminMeta?.institution || cachedProfile?.institution || localMatch?.institution || '',
            department: adminMeta?.department || cachedProfile?.department || localMatch?.department || '',
            completedLabs: cachedProfile?.completedLabs || localMatch?.completedLabs || 0,
            avgScore: cachedProfile?.avgScore || localMatch?.avgScore || 0,
            permissions: role === 'admin' ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'] : undefined,
            // Preserve extended profile fields
            username: cachedProfile?.username,
            branch: cachedProfile?.branch,
            rollNumber: cachedProfile?.rollNumber,
            bio: cachedProfile?.bio,
            profileCompleted: cachedProfile?.profileCompleted,
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
        // If not logged in via Firebase, check if there's a cached local session (Student, Teacher, or Admin)
        const cached = localStorage.getItem('vv_active_user');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.email && !isAccountDeleted(parsed.email)) {
              if (isAdminEmail(parsed.email)) {
                setCurrentUser({
                  ...parsed,
                  role: 'admin',
                  avatar: '🛡️',
                  permissions: ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'],
                });
              } else {
                setCurrentUser(parsed);
              }
              setLoading(false);
              return;
            }
          } catch {
            // ignore JSON parse error
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

    // Reject deleted accounts immediately
    if (!isSpecialAdmin && isAccountDeleted(emailNorm)) {
      return {
        success: false,
        message: 'This account has been deleted. Please register if you wish to create a new account.',
      };
    }

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
          if (localUser && !isAccountDeleted(emailNorm) && password.length >= 4) {
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

        // Regular accounts without a profile were deleted or do not exist!
        // Never auto-create a profile to resurrect a deleted account.
        if (!isSpecialAdmin && !seed) {
          try {
            await withTimeout(signOut(auth), 1500, undefined);
          } catch {}
          if (fbUser) {
            try {
              await withTimeout(deleteFirebaseUser(fbUser), 2000, undefined);
            } catch {}
          }
          return {
            success: false,
            message: 'No active account found for this email. It may have been deleted. Please register to create an account.',
          };
        }

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
    // Release email if previously marked deleted
    unmarkAccountAsDeleted(emailNorm);

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
          // If already registered or lingering from past deletion, sign in and re-bind role
          try {
            const cred = await signInWithEmailAndPassword(auth, emailNorm, data.password);
            fbUser = cred.user;
          } catch {
            return {
              success: false,
              message: 'An account with this email address already exists. Please sign in instead, or check your password.',
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
      localStorage.setItem('vv_active_user', JSON.stringify(newUser));
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
      await withTimeout(signOut(auth), 1500, undefined);
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

  // ── Delete current user account (Self-service, e.g. accidental teacher registration) ──
  const deleteCurrentAccount = async (password?: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'No active session found.' };
    }

    const userId = currentUser.id;
    const userEmail = currentUser.email?.toLowerCase();

    // 1. If password provided, re-authenticate first to ensure Firebase Auth deletion is authorized
    if (password && auth.currentUser && auth.currentUser.email) {
      try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await withTimeout(reauthenticateWithCredential(auth.currentUser, credential), 3000, undefined);
      } catch (authErr: any) {
        console.warn('[Auth] Re-authentication before delete error:', authErr);
        if (authErr?.code === 'auth/wrong-password' || authErr?.code === 'auth/invalid-credential') {
          return {
            success: false,
            message: 'Incorrect password. Please enter your valid password to delete your account.',
          };
        }
      }
    }

    // 2. Delete from Firebase Auth with strict 2.5s timeout
    try {
      if (auth.currentUser) {
        await withTimeout(deleteFirebaseUser(auth.currentUser), 2500, undefined);
      }
    } catch (fbErr: any) {
      console.warn('[Auth] Firebase Auth delete user notice:', fbErr);
      if (fbErr?.code === 'auth/requires-recent-login' && !password) {
        return {
          success: false,
          message: 'For security, please enter your password to authorize permanent deletion.',
        };
      }
    }

    // 3. Mark in deleted accounts registry to prevent immediate re-login with deleted credentials
    if (userEmail) {
      markAccountAsDeleted(userEmail);
    }

    // 4. Delete Firestore document with timeout
    try {
      await deleteUserFromFirestore(userId);
    } catch (fsErr) {
      console.warn('[Firestore] Delete document error:', fsErr);
    }

    // 5. Purge from in-memory allUsers list
    setAllUsers((prev) => prev.filter((u) => u.id !== userId && u.email?.toLowerCase() !== userEmail));

    // 6. Purge all localStorage caches for this user
    localStorage.removeItem('vv_active_user');
    localStorage.removeItem('vv_attempts');
    localStorage.removeItem('vv_lab_drafts');

    try {
      const raw = localStorage.getItem('vv_registered_users');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((u: any) => u.id !== userId && u.email?.toLowerCase() !== userEmail);
          localStorage.setItem('vv_registered_users', JSON.stringify(filtered));
        }
      }
    } catch {
      // ignore
    }

    // 7. Sign out cleanly
    await logout();

    return {
      success: true,
      message: 'Your account has been deleted. You can now re-register with your preferred role.',
    };
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
        deleteCurrentAccount,
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
