import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isAdminFirebaseConfigured = Boolean(projectId && clientEmail && privateKey);

let adminApp: App | null = null;

if (isAdminFirebaseConfigured && !getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey as string
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  });
} else if (getApps().length) {
  adminApp = getApps()[0];
}

export const adminDb = adminApp ? getFirestore(adminApp) : null;
export const adminStorage = adminApp ? getStorage(adminApp) : null;
export default adminApp;
