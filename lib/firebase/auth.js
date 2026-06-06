// Client-side authentication helpers wrapping the Firebase Web SDK.
// Supports Email/Password, Google Sign-in and Phone (SMS) authentication.

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

export function onAuthChange(callback) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function getCurrentUser() {
  return getFirebaseAuth().currentUser;
}

export async function getIdToken(forceRefresh = false) {
  const user = getFirebaseAuth().currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(getFirebaseAuth(), provider);
  return result.user;
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return result.user;
}

export async function signUpWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  return result.user;
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(getFirebaseAuth(), email);
}

// Creates (once) an invisible reCAPTCHA verifier required for phone auth.
export function createRecaptcha(containerId) {
  const auth = getFirebaseAuth();
  if (typeof window !== "undefined" && window.__imagicityRecaptcha) {
    return window.__imagicityRecaptcha;
  }
  const verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  if (typeof window !== "undefined") {
    window.__imagicityRecaptcha = verifier;
  }
  return verifier;
}

export function clearRecaptcha() {
  if (typeof window !== "undefined" && window.__imagicityRecaptcha) {
    try {
      window.__imagicityRecaptcha.clear();
    } catch (error) {
      /* noop */
    }
    window.__imagicityRecaptcha = null;
  }
}

export async function sendPhoneOtp(phoneNumber, verifier) {
  // Returns a confirmationResult; call confirmationResult.confirm(code) next.
  return signInWithPhoneNumber(getFirebaseAuth(), phoneNumber, verifier);
}

export async function signOutUser() {
  return signOut(getFirebaseAuth());
}
