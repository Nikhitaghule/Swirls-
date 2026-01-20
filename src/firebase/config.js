// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your NEW 'swirls-v2' configuration (I added your keys here)
const firebaseConfig = {
  apiKey: "AIzaSyD8zmTWwbjwbUEMPw_-xOEdCXOe1maSVUk",
  authDomain: "swirls-v2.firebaseapp.com",
  projectId: "swirls-v2",
  storageBucket: "swirls-v2.firebasestorage.app",
  messagingSenderId: "428762413611",
  appId: "1:428762413611:web:a583341666924d2048886e",
  measurementId: "G-VKEQXRE32B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🚨 THIS PART IS CRITICAL - DO NOT DELETE 🚨
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;