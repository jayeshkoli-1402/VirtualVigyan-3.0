import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// VirtualVigyan Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyABmdEtjq3RCSusy_yIXGN_jN1voBW3M6c',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'virtualvigyan.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'virtualvigyan',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'virtualvigyan.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '25318847855',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:25318847855:web:0d21dcff293e9250e6a49a',
};

// Initialize Firebase App instance
export const app = initializeApp(firebaseConfig);

// Firebase Authentication instance
export const auth = getAuth(app);

// Cloud Firestore instance
export const db = getFirestore(app);
