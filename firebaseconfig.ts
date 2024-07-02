// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHZpg7KCG2JW_XmNG3vY2UtrHPfcPG_lc",
    authDomain: "wellness-6082a.firebaseapp.com",
    databaseURL: "https://wellness-6082a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wellness-6082a",
    storageBucket: "wellness-6082a.appspot.com",
    messagingSenderId: "1020750557862",
    appId: "1:1020750557862:web:dbf5bf93a7c04954e4ba67",
    measurementId: "G-ZJ67CKS539"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

const db = getFirestore(initializeApp(firebaseConfig));
export { app, db };