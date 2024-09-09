// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD45a6Jp6Q8G4z7G34D6rJ9AR5YikWv4Bk",
  authDomain: "briefly-a78c4.firebaseapp.com",
  projectId: "briefly-a78c4",
  storageBucket: "briefly-a78c4.appspot.com",
  messagingSenderId: "24021999590",
  appId: "1:24021999590:web:3f5764c4da3631be514027",
  measurementId: "G-HBTRTXXYLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;