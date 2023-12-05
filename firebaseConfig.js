// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Try-catch ini dihapus saja karena hanya dipakai di website demo: https://pw14-firebase.vercel.app/
let cfgEnv = null;
try {
  cfgEnv = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
  console.log(cfgEnv);
} catch (e) {
  alert("Firebase Config belum diatur. Ikuti tutorial setup di modul untuk men setup firebaseConfig.js");
  throw new Error("Firebase Config belum diatur. Ikuti tutorial setup di modul untuk men setup firebaseConfig.js");
}
// -----------------------------

const firebaseConfig = cfgEnv;
/**
 * Contoh firebaseConfig:
 * const firebaseConfig = {
 *   apiKey: "...",
 *   authDomain: "...",
 *   projectId: "...",
 *   storageBucket: "...",
 *   messagingSenderId: "...",
 *   appId: "...",
 *   databaseURL: "..." // didapat waktu setup Realtime Database
 * };
 */

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const signInProvider = new GoogleAuthProvider();
signInProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export const auth = getAuth(app);
export default app;

// Firebase Realtime Database
export const db = getDatabase(app);
export const DB_TODO_KEY = 'todos';