// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getDatabase, ref } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firedb = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
