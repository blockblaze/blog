// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // eslint-disable-next-line no-undef
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "personal-blog-8ea87.firebaseapp.com",
  projectId: "personal-blog-8ea87",
  storageBucket: "personal-blog-8ea87.appspot.com",
  messagingSenderId: "1031419973185",
  appId: "1:1031419973185:web:e99909049c003948ea80c0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);