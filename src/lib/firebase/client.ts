import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const isClientFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const clientApp: FirebaseApp | null =
  isClientFirebaseConfigured && getApps().length ? getApp() : isClientFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const clientDb = clientApp ? getFirestore(clientApp) : null;
export const clientStorage = clientApp ? getStorage(clientApp) : null;
export const clientAuth = clientApp ? getAuth(clientApp) : null;

export default clientApp;
