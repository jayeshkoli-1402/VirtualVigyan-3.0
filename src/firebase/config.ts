import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// VirtualVigyan Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAa0ZyBQK_Yl4RYuWVFBV7irbTOisfrNK4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'virtual-vigyan.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'virtual-vigyan',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'virtual-vigyan.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '485959492647',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:485959492647:web:323914fd05696831f25a02',
};

// Initialize Firebase App instance
export const app = initializeApp(firebaseConfig);

// Firebase Authentication instance
export const auth = getAuth(app);

// Cloud Firestore instance
export const db = getFirestore(app);
