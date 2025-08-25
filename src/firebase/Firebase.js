// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    GoogleAuthProvider,
    signInWithPopup,
    getAuth,
    signOut,
} from "firebase/auth";
import { getStorage } from "firebase/storage"
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    getCountFromServer
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

// Initialize Firebase

const analytics = getAnalytics(app);
export default app;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const usersRef = collection(db, "users");
export const storage = getStorage(app);
 


/*


const firebaseConfig = {
  apiKey: "AIzaSyAyyXKOb8eNxf6sMSSZxfnXr1DWqyOQfdw",
  authDomain: "gudservices-c1836.firebaseapp.com",
  projectId: "gudservices-c1836",
  storageBucket: "gudservices-c1836.appspot.com",
  messagingSenderId: "487128434541",
  appId: "1:487128434541:web:46dd06c717c6af6fd23c64",
  measurementId: "G-772GJ5R04S"
};
*/