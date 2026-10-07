import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// VirtualVigyan Firebase configuration
// Credentials are supplied via environment variables (see .env / .env.example).
// Secrets are NEVER hardcoded in source control.
const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const nodeEnv = typeof globalThis !== 'undefined' && (globalThis as any).process?.env ? (globalThis as any).process.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || nodeEnv.VITE_FIREBASE_API_KEY || 'AIzaSyMockKeyForDevelopmentOnly00000000',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || nodeEnv.VITE_FIREBASE_AUTH_DOMAIN || 'virtualvigyan.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || nodeEnv.VITE_FIREBASE_PROJECT_ID || 'virtualvigyan',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || nodeEnv.VITE_FIREBASE_STORAGE_BUCKET || 'virtualvigyan.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || nodeEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: env.VITE_FIREBASE_APP_ID || nodeEnv.VITE_FIREBASE_APP_ID || '1:000000000000:web:mock0000000000000000',
};

// Initialize Firebase App instance safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication instance
export const auth = getAuth(app);

// Cloud Firestore instance
export const db = getFirestore(app);
