import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import type { User, UserRole } from '../auth/types';

export interface FirestoreStatus {
  isLocked: boolean;
  message?: string;
  lastChecked?: number;
}

// Global variable tracking Firestore locked mode
let firestoreLockedMode = false;
let onFirestoreStatusChange: ((status: FirestoreStatus) => void) | null = null;

export const setFirestoreStatusListener = (cb: (status: FirestoreStatus) => void) => {
  onFirestoreStatusChange = cb;
};

const notifyFirestoreStatus = (isLocked: boolean, message?: string) => {
  firestoreLockedMode = isLocked;
  if (onFirestoreStatusChange) {
    onFirestoreStatusChange({
      isLocked,
      message,
      lastChecked: Date.now(),
    });
  }
};

export const isFirestoreLocked = () => firestoreLockedMode;

/**
 * Fetch a single user profile from Firestore by User ID
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      notifyFirestoreStatus(false);
      return snap.data() as User;
    }
    return null;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(
        true,
        'Cloud Firestore is currently in Locked Mode. Update rules in Firebase Console to enable cloud persistence.'
      );
      console.warn('[Firestore] Permission denied: Firestore is in locked mode.');
    } else {
      console.warn('[Firestore] Error fetching user profile:', error.message || error);
    }
    return null;
  }
}

// Remove undefined values to prevent Firestore 'Unsupported field value: undefined' errors
function sanitizeForFirestore(obj: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Save or update a user profile document in Firestore
 */
export async function saveUserProfile(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', user.id);
    const sanitized = sanitizeForFirestore(user as unknown as Record<string, any>);
    await setDoc(userDocRef, sanitized, { merge: true });
    notifyFirestoreStatus(false);
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(
        true,
        'Cloud Firestore is currently in Locked Mode. Update rules in Firebase Console to enable cloud persistence.'
      );
      console.warn('[Firestore] Profile saved locally only. Firestore is in locked mode (permission-denied).');
      return { success: false, error: 'permission-denied' };
    }
    console.error('[Firestore] Error saving profile:', error);
    return { success: false, error: error.message || 'Failed to save profile' };
  }
}

/**
 * Fetch all registered users from Firestore
 */
export async function getAllUserProfiles(): Promise<User[]> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    const users: User[] = [];
    snap.forEach((docSnap) => {
      users.push(docSnap.data() as User);
    });
    notifyFirestoreStatus(false);
    return users;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(
        true,
        'Cloud Firestore is currently in Locked Mode. Falling back to local cohort cache.'
      );
    }
    return [];
  }
}

/**
 * Update user role in Firestore
 */
export async function updateUserRoleInFirestore(
  userId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { role: newRole });
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(true);
      return { success: false, error: 'permission-denied' };
    }
    return { success: false, error: error.message };
  }
}

/**
 * Delete user document from Firestore
 */
export async function deleteUserFromFirestore(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(true);
      return { success: false, error: 'permission-denied' };
    }
    return { success: false, error: error.message };
  }
}
