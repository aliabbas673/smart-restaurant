import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEh_3lmZU7ZL2eD3MXuwDyEbSaqf_V9LM",
  authDomain: "smart-restaurant-1e366.firebaseapp.com",
  projectId: "smart-restaurant-1e366",
  storageBucket: "smart-restaurant-1e366.firebasestorage.app",
  messagingSenderId: "374991945421",
  appId: "1:374991945421:web:bcd2dfde57a9252e97f384",
  measurementId: "G-JJQFCKSQQE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };