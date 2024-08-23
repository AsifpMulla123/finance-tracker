// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDqI8jcwt1oTsXGOvWWcyPwblnMBt60g-w",
    authDomain: "fintrack-9990e.firebaseapp.com",
    projectId: "fintrack-9990e",
    storageBucket: "fintrack-9990e.appspot.com",
    messagingSenderId: "892044535886",
    appId: "1:892044535886:web:700c68985201b549263b1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };