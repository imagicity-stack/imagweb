import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { InternalLinkSuggestion } from "@/types/blog";
import { clientDb } from "@/lib/firebase/client";

export const fetchInternalLinkSuggestions = async (keyword: string): Promise<InternalLinkSuggestion[]> => {
  if (!clientDb) return [];
  const blogsRef = collection(clientDb, "blogs");
  const clauses = keyword
    ? [where("searchIndex", "array-contains", keyword.toLowerCase()), orderBy("createdAt", "desc"), limit(6)]
    : [orderBy("createdAt", "desc"), limit(6)];
  const snapshot = await getDocs(query(blogsRef, ...clauses));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "",
      slug: data.slug || doc.id,
      category: data.category || "",
      tags: data.tags || []
    } as InternalLinkSuggestion;
  });
};
