// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';  
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWIHgi4yG01euny5OdUP-BNqgLtNbhR5Y",
  authDomain: "adv-final-project-98767.firebaseapp.com",
  projectId: "adv-final-project-98767",
  storageBucket: "adv-final-project-98767.firebasestorage.app",
  messagingSenderId: "828633400021",
  appId: "1:828633400021:web:537311ca4142a8ff91585c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };