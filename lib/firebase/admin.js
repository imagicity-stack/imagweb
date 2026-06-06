// Firebase Admin SDK (server side) initialization.
// Credentials come from a service account exposed through Vercel environment
// variables — never hardcoded. The SDK is initialized lazily so the site still
// builds (with an empty blog) before the credentials are configured.

import { cert, getApps, getApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const projectId =
  process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

export const adminStorageBucket =
  process.env.FIREBASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  (projectId ? `${projectId}.appspot.com` : undefined);

// Optional named Firestore database. Leave unset to use the "(default)"
// database. Configured via env so the database is never hardcoded.
export const firestoreDatabaseId =
  process.env.FIREBASE_DATABASE_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ||
  "";

export const isAdminConfigured = Boolean(projectId && clientEmail && privateKey);

function notConfigured() {
  const error = new Error(
    "Firebase Admin SDK is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
  );
  error.code = "admin/not-configured";
  error.statusCode = 503;
  return error;
}

let cachedApp = null;

function getAdminApp() {
  if (!isAdminConfigured) {
    throw notConfigured();
  }
  if (!cachedApp) {
    cachedApp = getApps().length
      ? getApp()
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
          storageBucket: adminStorageBucket
        });
  }
  return cachedApp;
}

export function getAdminDb() {
  const app = getAdminApp();
  return firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}

export function getAdminBucket() {
  return getStorage(getAdminApp()).bucket(adminStorageBucket);
}
