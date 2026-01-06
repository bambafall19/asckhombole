// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_rUo-2JhWawjUfJnK79ScbxiYSmfgxWw",
  authDomain: "asc-khombole.firebaseapp.com",
  projectId: "asc-khombole",
  storageBucket: "asc-khombole.appspot.com",
  messagingSenderId: "1027080159890",
  appId: "1:1027080159890:web:aa26f5ccacf018c6fb5c4b",
  measurementId: "G-0CXL5Y4BFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export { firebaseConfig };
