import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

/**
 * Uploads an image File to Firebase Cloud Storage with a 5s timeout & instant base64 Data URL fallback.
 * @param file File object from file input
 * @param folder Subfolder in storage bucket (e.g. 'logos' or 'blogs')
 * @returns Download URL string or Data URL
 */
export async function uploadImageToStorage(file: File, folder = "uploads"): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file format. Please select an image file (PNG, JPG, WEBP, SVG).");
  }

  // Helper to convert file to Base64 Data URL
  const readAsDataUrl = (): Promise<string> => {
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
  };

  // 1. Try Firebase Storage if initialized with a 5s race timeout
  if (storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const timestamp = Date.now();
      const storageRef = ref(storage, `${folder}/${timestamp}_${sanitizedName}`);

      const uploadPromise = (async () => {
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      })();

      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("Firebase Storage timeout - using instant fallback")), 5000)
      );

      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch (err: any) {
      console.warn("Firebase Storage upload notice (using instant Data URL fallback):", err?.message || err);
    }
  }

  // 2. Fallback to instant Data URL
  return await readAsDataUrl();
}
