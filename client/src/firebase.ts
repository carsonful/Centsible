// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVCqD2fb6WEeVStB-yRk1bvr2DvSxbC3E",
  authDomain: "centsible-83859.firebaseapp.com",
  projectId: "centsible-83859",
  storageBucket: "centsible-83859.firebasestorage.app",
  messagingSenderId: "818803970690",
  appId: "1:818803970690:web:385f455d50e8211bf71a9b",
  measurementId: "G-1R4NW69FKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);