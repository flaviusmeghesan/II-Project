// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ii-project-b2e19.firebaseapp.com",
  projectId: "ii-project-b2e19",
  storageBucket: "ii-project-b2e19.appspot.com",
  messagingSenderId: "992974986111",
  appId: "1:992974986111:web:4b1b563a69b1e7ded7584a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);