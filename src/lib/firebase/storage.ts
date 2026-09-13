import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

/**
 * Uploads an image File to Firebase Cloud Storage (or returns base64 fallback if storage rules block).
 * @param file File object from file input
 * @param folder Subfolder in storage bucket (e.g. 'logos' or 'blogs')
 * @returns Download URL string
 */
export async function uploadImageToStorage(file: File, folder = "uploads"): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file format. Please select an image file (PNG, JPG, WEBP, SVG).");
  }

  // 1. Try Firebase Storage if initialized
  if (storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const timestamp = Date.now();
      const storageRef = ref(storage, `${folder}/${timestamp}_${sanitizedName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err: any) {
      console.warn("Firebase Storage upload notice (falling back to Data URL):", err?.message || err);
    }
  }

  // 2. Fallback: Convert to optimized Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image file"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
