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

export function getFirebaseFriendlyErrorMessage(code?: string, fallbackMessage?: string): string {
  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled in Firebase Console. Please enable "Email/Password" under Firebase Console > Authentication > Sign-in method.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase. Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection or firewall/ad-blocker.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead, or use a different email.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/user-not-found':
      return 'No account found for this email. Please register to create an account.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before trying again.';
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Firebase API key is invalid or restricted in Google Cloud Console.';
    default:
      return fallbackMessage || 'Authentication failed. Please check your credentials and try again.';
  }
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<AuthResponse>;
  register: (data: RegistrationData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  allUsers: User[];
  deleteUser?: (id: string) => Promise<{ success: boolean; message: string }>;
  deleteCurrentAccount: (password?: string) => Promise<{ success: boolean; message: string }>;
  changeUserRole?: (id: string, newRole: UserRole) => Promise<void>;
  firestoreLocked: boolean;
  firestoreMessage: string | null;
  refreshUsers: () => Promise<void>;
  updateUserProfile: (updatedFields: Partial<User>) => Promise<void>;
}

// ── Admin Emails Whitelist ──
// NOTE: This list is used for client-side admin badge display only.
// Actual authorization is enforced by Firestore Security Rules and Firebase Auth Custom Claims.
export const ADMIN_EMAILS: string[] = [
  'jayeshkoli106@gmail.com',
  'omchaudhari0365@gmail.com',
  'dipaliishi2006@gmail.com',
  'vaishnavigirase802@gmail.com',
];

// SECURITY: DEFAULT_ADMIN_PASSWORD removed — admin login MUST go through Firebase Auth.
// SECURITY: ADMIN_DIRECTORY with PII (personal names, departments) removed from client bundle.
// Admin profile metadata is now fetched from Firestore /users/{uid} documents.

export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adm) => adm.toLowerCase() === norm);
}

// Demo seed users for local cohort visualization (only @virtualvigyan.in demo accounts)
// SECURITY: Personal emails removed from seed data. Real users come from Firestore.
const SEED_USERS: User[] = [
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
];

// ── Client-Side Rate Limiter ──
const LOGIN_RATE_LIMIT_KEY = 'vv_login_rate';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function checkLoginRateLimit(): { allowed: boolean; waitSeconds?: number } {
  try {
    const raw = sessionStorage.getItem(LOGIN_RATE_LIMIT_KEY);
    if (!raw) return { allowed: true };
    const { count, firstAttempt } = JSON.parse(raw);
    const elapsed = Date.now() - firstAttempt;
    if (elapsed > LOCKOUT_DURATION_MS) {
      sessionStorage.removeItem(LOGIN_RATE_LIMIT_KEY);
      return { allowed: true };
    }
    if (count >= MAX_LOGIN_ATTEMPTS) {
      return { allowed: false, waitSeconds: Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 1000) };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordLoginAttempt(): void {
  try {
    const raw = sessionStorage.getItem(LOGIN_RATE_LIMIT_KEY);
    if (!raw) {
      sessionStorage.setItem(LOGIN_RATE_LIMIT_KEY, JSON.stringify({ count: 1, firstAttempt: Date.now() }));
      return;
    }
    const data = JSON.parse(raw);
    const elapsed = Date.now() - data.firstAttempt;
    if (elapsed > LOCKOUT_DURATION_MS) {
      sessionStorage.setItem(LOGIN_RATE_LIMIT_KEY, JSON.stringify({ count: 1, firstAttempt: Date.now() }));
    } else {
      sessionStorage.setItem(LOGIN_RATE_LIMIT_KEY, JSON.stringify({ ...data, count: data.count + 1 }));
    }
  } catch { /* ignore */ }
}

function clearLoginRateLimit(): void {
  try { sessionStorage.removeItem(LOGIN_RATE_LIMIT_KEY); } catch { /* ignore */ }
}

// Helper to deduce initial role from email/identifier
// SECURITY: Removed email.includes('admin') substring escalation — role deduction
// never grants admin based on email content alone.
function deduceRole(email: string): UserRole {
  const norm = email.toLowerCase().trim();
  if (isAdminEmail(norm)) return 'admin';
  if (norm.includes('teacher') || norm.includes('prof') || norm.includes('faculty')) return 'teacher';
  return 'student';
}

// Map username shortcuts to emails
function resolveIdentifierToEmail(identifier: string): string {
  const term = identifier.trim().toLowerCase();
  if (term === 'teacher') return 'teacher@virtualvigyan.in';
  if (term === 'student') return 'student@virtualvigyan.in';
  if (term === 'aarav') return 'student@virtualvigyan.in';
  // Admin first-name shortcuts (4 Designated Admins)
  if (term === 'jayesh' || term === 'jayeshkoli') return 'jayeshkoli106@gmail.com';
  if (term === 'om' || term === 'omchaudhari') return 'omchaudhari0365@gmail.com';
  if (term === 'dipali' || term === 'dipaliishi') return 'dipaliishi2006@gmail.com';
  if (term === 'vaishnavi' || term === 'vaishnavigirase') return 'vaishnavigirase802@gmail.com';
  return term;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // SECURITY: Initial state is null. Firebase Auth onAuthStateChanged is the sole authority.
  // A minimal cached display-name is used only for instant UI rendering before Firebase responds.
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [firestoreLockedState, setFirestoreLockedState] = useState(isFirestoreLocked());
  const [firestoreMessage, setFirestoreMessage] = useState<string | null>(null);

  // SECURITY: allUsers initialized from SEED_USERS only (no localStorage vv_users_db cache).
  // Full user directory is fetched on-demand from Firestore via refreshUsers(), never cached client-side.
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const deletedAccounts = getDeletedAccounts();
    return SEED_USERS.filter((u) => !deletedAccounts.includes(u.email.toLowerCase()));
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

  // Save minimal active user info to local cache (display-only fields for instant UI rendering)
  // SECURITY: Only stores non-sensitive fields. Permissions and role are NOT trusted from cache.
  useEffect(() => {
    if (currentUser) {
      const minimalCache = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        avatar: currentUser.avatar,
      };
      localStorage.setItem('vv_active_user', JSON.stringify(minimalCache));
    } else {
      localStorage.removeItem('vv_active_user');
    }
  }, [currentUser]);

  // SECURITY: Removed vv_users_db localStorage cache. Full user directory is never stored client-side.

  // Load all users from Firestore
  const refreshUsers = useCallback(async () => {
    try {
      const remoteUsers = await getAllUserProfiles();
      const deletedAccounts = getDeletedAccounts();
      if (remoteUsers && remoteUsers.length > 0) {
        setAllUsers((prev) => {
          const map = new Map<string, User>();
          SEED_USERS.forEach((u) => {
            if (!deletedAccounts.includes(u.email.toLowerCase())) {
              map.set(u.email.toLowerCase(), u);
            }
          });
          prev.forEach((u) => {
            if (!deletedAccounts.includes(u.email.toLowerCase())) {
              map.set(u.email.toLowerCase(), u);
            }
          });
          remoteUsers.forEach((u) => {
            if (!deletedAccounts.includes(u.email.toLowerCase())) {
              map.set(u.email.toLowerCase(), u);
            }
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
          // Check local seed users for demo accounts
          const localMatch = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

          // Role priority: admin whitelist > seed user > deduceRole fallback
          const role = isSpecialAdmin
            ? 'admin'
            : (localMatch?.role || deduceRole(email));

          profile = {
            id: uid,
            name: firebaseUser.displayName || localMatch?.name || (email.split('@')[0] || 'User'),
            email,
            role,
            avatar: role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓',
            createdAt: localMatch?.createdAt || new Date().toISOString().split('T')[0],
            grade: localMatch?.grade || (role === 'student' ? 'Class 11' : undefined),
            school: localMatch?.school || '',
            institution: localMatch?.institution || '',
            department: localMatch?.department || '',
            completedLabs: localMatch?.completedLabs || 0,
            avgScore: localMatch?.avgScore || 0,
            permissions: role === 'admin' ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'] : undefined,
          };
          saveUserProfile(profile).catch(() => {});
        }

        // Enforce admin role for designated admin emails (validated via Firebase Auth)
        if (isSpecialAdmin) {
          profile.role = 'admin';
          profile.avatar = '🛡️';
          profile.permissions = ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'];
        }

        setCurrentUser(profile);
      } else {
        // SECURITY: Firebase Auth says no user is signed in.
        // Do NOT restore from localStorage — that would allow session forging.
        // Clear any stale cached session.
        localStorage.removeItem('vv_active_user');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Login handler — Firebase Authentication ONLY (no fallbacks) ──
  const login = async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    const emailNorm = resolveIdentifierToEmail(emailOrUsername);
    const isSpecialAdmin = isAdminEmail(emailNorm);

    // SECURITY: Rate limiting to prevent brute-force attacks
    const rateCheck = checkLoginRateLimit();
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: `Too many login attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
      };
    }

    // Reject deleted accounts immediately
    if (isAccountDeleted(emailNorm)) {
      return {
        success: false,
        message: 'This account has been deleted. Please register if you wish to create a new account.',
      };
    }

    try {
      // SECURITY: Firebase Auth is the SOLE authentication authority. No fallbacks.
      const userCredential = await signInWithEmailAndPassword(auth, emailNorm, password);
      const fbUser = userCredential.user;
      const uid = fbUser.uid;

      // Login succeeded — clear rate limit counter
      clearLoginRateLimit();

      let profile = await getUserProfile(uid);

      if (!profile) {
        const seed = SEED_USERS.find((u) => u.email.toLowerCase() === emailNorm);
        const role = isSpecialAdmin ? 'admin' : (seed?.role || deduceRole(emailNorm));
        profile = {
          id: uid,
          name: fbUser.displayName || seed?.name || (emailNorm.split('@')[0] || 'User'),
          email: emailNorm,
          role,
          avatar: role === 'admin' ? '🛡️' : role === 'teacher' ? '👨‍🏫' : '🎓',
          createdAt: seed?.createdAt || new Date().toISOString().split('T')[0],
          grade: seed?.grade || (role === 'student' ? 'Class 11' : undefined),
          school: seed?.school || '',
          institution: seed?.institution || '',
          department: seed?.department || '',
          completedLabs: seed?.completedLabs || 0,
          avgScore: seed?.avgScore || 0,
          permissions: role === 'admin'
            ? ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override']
            : undefined,
        };
        saveUserProfile(profile).catch(() => {});
      }

      // Enforce admin privileges for designated admin emails (validated through Firebase Auth)
      if (isSpecialAdmin) {
        profile.role = 'admin';
        profile.avatar = '🛡️';
        profile.permissions = ['all_access', 'experiment_editor', 'user_moderation', 'telemetry', 'admin_override'];
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
      // SECURITY: Record failed attempt for rate limiting
      recordLoginAttempt();

      const error = err as { code?: string; message?: string };
      console.warn('[Auth] Login failed for:', emailNorm, 'Code:', error.code);
      const message = getFirebaseFriendlyErrorMessage(error.code, error.message);

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

    // Non-admin emails can NEVER register with admin role
    if (!isSpecialAdmin && (data.role as string) === 'admin') {
      return { success: false, message: 'Unauthorized role assignment. Administrator accounts cannot be self-assigned.' };
    }

    if (!isSpecialAdmin && data.role !== 'student' && data.role !== 'teacher') {
      return { success: false, message: 'Invalid registration role.' };
    }

    try {
      let fbUser: any = null;
      try {
        // Create user in Firebase Auth — this is the ONLY way to register
        const userCredential = await createUserWithEmailAndPassword(auth, emailNorm, data.password);
        fbUser = userCredential.user;
        await updateProfile(fbUser, { displayName: data.name.trim() }).catch(() => {});
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          return {
            success: false,
            message: 'An account with this email address already exists. Please sign in instead.',
          };
        } else {
          // SECURITY: No fallback paths — Firebase Auth is required for registration
          console.error('[Auth] Firebase Auth creation error:', authErr);
          const friendlyMessage = getFirebaseFriendlyErrorMessage(authErr.code, authErr.message);
          return {
            success: false,
            message: friendlyMessage,
          };
        }
      }

      const uid = fbUser?.uid || `usr_${crypto.randomUUID()}`;

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
        institution: data.institution || '',
        department: data.department || '',
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

      // Save to Cloud Firestore
      try {
        await withTimeout(saveUserProfile(newUser), 3000, { success: false });
      } catch (e) {
        console.warn('[Firestore] Non-blocking registration save:', e);
      }

      return {
        success: true,
        message: isSpecialAdmin
          ? `Admin account registered! Welcome Administrator ${newUser.name}.`
          : 'Account created successfully! Welcome to VirtualVigyan.',
        role: newUser.role,
      };
    } catch (err: unknown) {
      // SECURITY: No fallback registration paths. Firebase Auth is mandatory.
      const error = err as { code?: string; message?: string };
      const message = getFirebaseFriendlyErrorMessage(error.code, error.message || 'Registration failed. Please try again.');

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

  // ── Delete user (Admin capability to purge any user from database) ──
  const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
    // SECURITY: Enforce admin role check before performing administrative deletion
    if (currentUser?.role !== 'admin') {
      return { success: false, message: 'Unauthorized: Administrator privileges required to delete accounts.' };
    }

    const targetUser = allUsers.find((u) => u.id === id);
    const userEmail = targetUser?.email?.toLowerCase();

    // 1. Delete document from Firestore
    try {
      await deleteUserFromFirestore(id);
    } catch (e) {
      console.warn('[Admin] Firestore user delete notice:', e);
    }

    // 2. Mark account as deleted so it never resurrects
    if (userEmail) {
      markAccountAsDeleted(userEmail);
    }

    // 3. Purge from local caches (vv_registered_users)
    try {
      const rawReg = localStorage.getItem('vv_registered_users');
      if (rawReg) {
        const parsed = JSON.parse(rawReg);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (u: any) => u.id !== id && (!userEmail || u.email?.toLowerCase() !== userEmail)
          );
          localStorage.setItem('vv_registered_users', JSON.stringify(filtered));
        }
      }
    } catch {}

    // 4. Update in-memory state (no longer persisted to localStorage)
    const updatedUsers = allUsers.filter(
      (u) => u.id !== id && (!userEmail || u.email?.toLowerCase() !== userEmail)
    );
    setAllUsers(updatedUsers);

    // 5. If the admin deleted their own currently logged-in account, logout cleanly
    if (currentUser?.id === id || (userEmail && currentUser?.email?.toLowerCase() === userEmail)) {
      await logout();
    }

    return {
      success: true,
      message: `User ${targetUser?.name || 'account'} (${targetUser?.email || id}) was permanently removed from the platform database.`,
    };
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
    // SECURITY: Enforce admin role check before changing user roles
    if (currentUser?.role !== 'admin') {
      console.warn('[Security] Unauthorized attempt to change user role.');
      return;
    }

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
