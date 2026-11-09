import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAhUIx7Tr3-WV2tLDL16D_pK5ZpqPRn_M8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jayarams-web.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jayarams-web",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jayarams-web.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "933301774199",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:933301774199:web:1b2ac5fc3b7ab348a86372",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DCGG1ZPBD7"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId && firebaseConfig.apiKey
);

export const app = isFirebaseConfigured 
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const db = app ? getFirestore(app) : null;
