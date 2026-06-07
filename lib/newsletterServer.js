// Server-only newsletter subscribers (Admin SDK).

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { SUBSCRIBERS_COLLECTION } from "./blog";
import { sendNewPostNotification } from "./mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email || "").trim());
}

export async function subscribeEmail({ name, email }) {
  if (!isAdminConfigured) {
    const error = new Error("The newsletter is unavailable right now.");
    error.statusCode = 503;
    throw error;
  }
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    const error = new Error("Please enter a valid email address.");
    error.statusCode = 400;
    throw error;
  }
  const cleanName = String(name || "").trim().slice(0, 120);

  // Use the email as the doc id so re-subscribing never duplicates.
  const id = cleanEmail.replace(/[\/#?]/g, "_");
  const ref = getAdminDb().collection(SUBSCRIBERS_COLLECTION).doc(id);
  const existing = await ref.get();

  await ref.set(
    {
      name: cleanName,
      email: cleanEmail,
      status: "subscribed",
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return {
    created: !existing.exists,
    alreadySubscribed: existing.exists && existing.data().status === "subscribed",
    name: cleanName,
    email: cleanEmail
  };
}

export async function getSubscriberEmails() {
  if (!isAdminConfigured) return [];
  try {
    const snapshot = await getAdminDb()
      .collection(SUBSCRIBERS_COLLECTION)
      .where("status", "==", "subscribed")
      .get();
    return snapshot.docs.map((doc) => doc.data().email).filter(Boolean);
  } catch (error) {
    console.error("getSubscriberEmails failed:", error.message);
    return [];
  }
}

// Emails all subscribers about a freshly published post. Never throws.
export async function notifyNewPost(post) {
  try {
    const emails = await getSubscriberEmails();
    if (emails.length) await sendNewPostNotification({ emails, post });
  } catch (error) {
    console.error("notifyNewPost failed:", error.message);
  }
}
