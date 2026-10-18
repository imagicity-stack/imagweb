// Server-only newsletter subscribers (Admin SDK).

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { SUBSCRIBERS_COLLECTION } from "./blog";
import { sendNewPostNotification } from "./mailer";
import { isValidEmail } from "./validate";

export { isValidEmail };

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
  const cleanName = typeof name === "string" ? name.trim().slice(0, 120) : "";

  // Use the email as the doc id so re-subscribing never duplicates.
  const id = cleanEmail.replace(/[\/#?]/g, "_");
  const ref = getAdminDb().collection(SUBSCRIBERS_COLLECTION).doc(id);
  const existing = await ref.get();

  // Anyone can type any address here, so an existing subscriber is left exactly
  // as is: nobody can overwrite their name or silently re-subscribe someone who
  // unsubscribed. (Re-joining after unsubscribing goes through the team.)
  if (!existing.exists) {
    await ref.set({
      name: cleanName,
      email: cleanEmail,
      status: "subscribed",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  return { created: !existing.exists, email: cleanEmail };
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
