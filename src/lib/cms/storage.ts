import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import { clientStorage } from "@/lib/firebase/client";

export const compressImage = async (file: File) =>
  imageCompression(file, {
    maxSizeMB: 1.2,
    maxWidthOrHeight: 2000,
    useWebWorker: true,
    fileType: "image/webp"
  });

export const uploadImage = async (file: File, blogId: string, filename: string) => {
  if (!clientStorage) throw new Error("Firebase Storage is not configured");
  const compressed = await compressImage(file);
  const storageRef = ref(clientStorage, `blogs/${blogId}/media/${filename}`);
  await uploadBytes(storageRef, compressed, { contentType: compressed.type });
  return getDownloadURL(storageRef);
};

export const deleteImage = async (path: string) => {
  if (!clientStorage) return;
  await deleteObject(ref(clientStorage, path));
};

export const listBlogMedia = async (blogId: string) => {
  if (!clientStorage) return [] as string[];
  const items = await listAll(ref(clientStorage, `blogs/${blogId}/media`));
  return Promise.all(items.items.map((item) => getDownloadURL(item)));
};
