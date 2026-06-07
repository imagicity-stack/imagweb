// Server-only blog categories (Admin SDK). Authors can create their own
// categories simply by typing a new one — saving the post persists it here so
// it's suggested everywhere afterwards.

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminConfigured } from "./firebase/admin";
import { CATEGORIES_COLLECTION } from "./blog";

const toId = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export async function getCategories() {
  if (!isAdminConfigured) return [];
  try {
    const snapshot = await getAdminDb().collection(CATEGORIES_COLLECTION).get();
    return snapshot.docs
      .map((doc) => doc.data().name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }
}

export async function ensureCategories(names = []) {
  if (!isAdminConfigured) return;
  const clean = [...new Set(names.map((n) => String(n || "").trim()).filter(Boolean))];
  await Promise.all(
    clean.map(async (name) => {
      const id = toId(name);
      if (!id) return;
      try {
        await getAdminDb()
          .collection(CATEGORIES_COLLECTION)
          .doc(id)
          .set({ name, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      } catch (error) {
        /* non-critical */
      }
    })
  );
}

export async function deleteCategory(id) {
  if (!isAdminConfigured || !id) return;
  await getAdminDb().collection(CATEGORIES_COLLECTION).doc(id).delete();
}
