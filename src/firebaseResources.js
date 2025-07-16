import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSTPGT58lB-i0TekVyBt8i7rEUssR6t4s",
  authDomain: "cs110-project-62890.firebaseapp.com",
  projectId: "cs110-project-62890",
  storageBucket: "cs110-project-62890.firebasestorage.app",
  messagingSenderId: "1070181313585",
  appId: "1:1070181313585:web:637f38e12331ca83ce3910"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);