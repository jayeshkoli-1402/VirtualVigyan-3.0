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

/**
 * Fetch a single user profile from Firestore by User ID
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await withTimeout(getDoc(userDocRef), 2000, null as any);
    if (snap && snap.exists && snap.exists()) {
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

// Deeply remove undefined values to prevent Firestore 'Unsupported field value: undefined' errors
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        clean[key] = sanitizeForFirestore(value);
      }
    }
    return clean as T;
  }
  return data;
}

/**
 * Save or update a user profile document in Firestore
 */
export async function saveUserProfile(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    const userDocRef = doc(db, 'users', user.id);
    const sanitized = sanitizeForFirestore(user as unknown as Record<string, any>);
    await withTimeout(setDoc(userDocRef, sanitized, { merge: true }), 2500, undefined);
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
    const snap = await withTimeout(getDocs(usersCol), 2500, null as any);
    const users: User[] = [];
    if (snap && snap.forEach) {
      snap.forEach((docSnap: any) => {
        users.push(docSnap.data() as User);
      });
    }
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
    await withTimeout(deleteDoc(userDocRef), 2000, undefined);
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

// ── Private Lab Firestore Persistence ──

import type { PrivateLab, PrivateLabEnrolledStudent, PrivateLabSubmission } from '../types/privateLab';

/**
 * Save or update a private lab document in Firestore
 */
export async function savePrivateLabToFirestore(
  lab: PrivateLab
): Promise<{ success: boolean; error?: string }> {
  try {
    const labDocRef = doc(db, 'private_labs', lab.id);
    const sanitized = sanitizeForFirestore(lab as unknown as Record<string, any>);
    await withTimeout(setDoc(labDocRef, sanitized, { merge: true }), 3000, undefined);
    notifyFirestoreStatus(false);
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(true);
      return { success: false, error: 'permission-denied' };
    }
    console.warn('[Firestore] Error saving private lab:', error);
    return { success: false, error: error.message || 'Failed to save private lab to cloud' };
  }
}

/**
 * Fetch all private labs from Firestore
 */
export async function getAllPrivateLabsFromFirestore(): Promise<PrivateLab[]> {
  try {
    const labsCol = collection(db, 'private_labs');
    const snap = await withTimeout(getDocs(labsCol), 3000, null as any);
    const labs: PrivateLab[] = [];
    if (snap && snap.forEach) {
      snap.forEach((docSnap: any) => {
        labs.push(docSnap.data() as PrivateLab);
      });
    }
    notifyFirestoreStatus(false);
    return labs;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'permission-denied') {
      notifyFirestoreStatus(true);
    }
    return [];
  }
}

/**
 * Find a private lab from Firestore by code
 */
export async function getPrivateLabFromFirestoreByCode(code: string): Promise<PrivateLab | null> {
  if (!code) return null;
  const cleanInput = code.trim().toUpperCase().replace(/[^A-Z0-9]/gi, '');

  try {
    const labs = await getAllPrivateLabsFromFirestore();
    const match = labs.find((l) => {
      const cleanLabCode = (l.code || '').toUpperCase().replace(/[^A-Z0-9]/gi, '');
      return cleanLabCode === cleanInput || cleanLabCode.endsWith(cleanInput) || cleanInput.endsWith(cleanLabCode);
    });
    return match || null;
  } catch (err) {
    console.warn('[Firestore] Error querying private lab by code:', err);
    return null;
  }
}

/**
 * Append enrolled student to Firestore private lab
 */
export async function enrollStudentInFirestoreLab(
  labId: string,
  enrollment: PrivateLabEnrolledStudent
): Promise<{ success: boolean; error?: string }> {
  try {
    const labDocRef = doc(db, 'private_labs', labId);
    const snap = await withTimeout(getDoc(labDocRef), 2500, null as any);
    if (snap && snap.exists && snap.exists()) {
      const data = snap.data() as PrivateLab;
      const enrolled = Array.isArray(data.enrolledStudents) ? data.enrolledStudents : [];
      const already = enrolled.some(
        (s) => s.studentEmail.toLowerCase() === enrollment.studentEmail.toLowerCase()
      );
      if (!already) {
        enrolled.push(enrollment);
        await withTimeout(updateDoc(labDocRef, { enrolledStudents: enrolled }), 2500, undefined);
      }
      return { success: true };
    }
    return { success: false, error: 'Lab not found in cloud database' };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return { success: false, error: error.message };
  }
}

/**
 * Append or update student submission in Firestore private lab
 */
export async function addSubmissionToFirestoreLab(
  labId: string,
  submission: PrivateLabSubmission
): Promise<{ success: boolean; error?: string }> {
  try {
    const labDocRef = doc(db, 'private_labs', labId);
    const snap = await withTimeout(getDoc(labDocRef), 3000, null as any);
    if (snap && snap.exists && snap.exists()) {
      const data = snap.data() as PrivateLab;
      const submissions = Array.isArray(data.submissions) ? [...data.submissions] : [];
      const existingIdx = submissions.findIndex(
        (s) => s.id === submission.id || (
          s.studentEmail?.toLowerCase() === submission.studentEmail?.toLowerCase() &&
          s.experimentId === submission.experimentId &&
          s.attemptNumber === submission.attemptNumber
        )
      );

      if (existingIdx >= 0) {
        submissions[existingIdx] = submission;
      } else {
        submissions.unshift(submission);
      }

      const sanitizedSubmissions = sanitizeForFirestore(submissions);
      await withTimeout(updateDoc(labDocRef, { submissions: sanitizedSubmissions }), 3000, undefined);
      return { success: true };
    }
    return { success: false, error: 'Lab not found in cloud database' };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.warn('[Firestore] Error saving submission to cloud:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a private lab from Firestore
 */
export async function deletePrivateLabFromFirestore(
  labId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const labDocRef = doc(db, 'private_labs', labId);
    await withTimeout(deleteDoc(labDocRef), 2000, undefined);
    return { success: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return { success: false, error: error.message };
  }
}

