import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// VirtualVigyan Firebase configuration
// Production defaults ensure the client SPA connects seamlessly even if CI/CD environment variables are not injected.
const DEFAULT_CONFIG = {
  apiKey: 'AIzaSyABmdEtjq3RCSusy_yIXGN_jN1voBW3M6c',
  authDomain: 'virtualvigyan.firebaseapp.com',
  projectId: 'virtualvigyan',
  storageBucket: 'virtualvigyan.firebasestorage.app',
  messagingSenderId: '25318847855',
  appId: '1:25318847855:web:0d21dcff293e9250e6a49a',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_CONFIG.appId,
};

// Initialize Firebase App instance safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication instance
export const auth = getAuth(app);

// Cloud Firestore instance
export const db = getFirestore(app);
