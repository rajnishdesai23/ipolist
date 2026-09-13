import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAm3Qg1BNJGnVrSyu3hAX5qiGXplvMhbmA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ipo-list-29f6e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ipo-list-29f6e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ipo-list-29f6e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "163545287634",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:163545287634:web:42d5eee36308f80f67960b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-SZCGET5FWX",
};

let app: any;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  if (typeof window !== "undefined") {
    auth = getAuth(app);
  }
} catch (e) {
  console.warn("Firebase initialization error:", e);
}

export { app, auth, db, storage };

