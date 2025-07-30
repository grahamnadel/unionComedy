import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyAVaiYhzJYnskAQCDQvgvsZkA4okKkZkoY",
    authDomain: "unioncomedy-2d46f.firebaseapp.com",
    // databaseURL:"https://DATABASE_NAME.firebaseio.com",
    projectId: "unioncomedy-2d46f",
    storageBucket: "unioncomedy-2d46f.firebasestorage.app",
    appID:"1:234071770077:android:74891e4781c5c984fa2c34"
    // measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the needed Firestore functions and db instance
export { db, collection, getDocs, doc, updateDoc, increment, auth, onAuthStateChanged, signInAnonymously };
