// Firebase Web SDK (client side) initialization.
// All values come from NEXT_PUBLIC_FIREBASE_* environment variables that you
// set in Vercel after registering a Web App in your Firebase project.
// Nothing is hardcoded, and initialization is lazy so the app still builds
// and renders before Firebase is configured.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Optional named Firestore database (defaults to "(default)" when unset).
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "";

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let cachedApp = null;

export function getFirebaseApp() {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase Web SDK is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables."
    );
  }
  if (!cachedApp) {
    cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return cachedApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getDb() {
  const app = getFirebaseApp();
  return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export function getStorageInstance() {
  return getStorage(getFirebaseApp());
}
