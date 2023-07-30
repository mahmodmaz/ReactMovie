// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAGR29QAj93E92vzQcwJpzFMz63DUoN-mw",
//   authDomain: "movieapp-80e7e.firebaseapp.com",
//   projectId: "movieapp-80e7e",
//   storageBucket: "movieapp-80e7e.appspot.com",
//   messagingSenderId: "57166146082",
//   appId: "1:57166146082:web:8f4b9b1222eec4d845f87b"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDrWF5OOj7YbK_Ajs7xp7JXdVOtbFF6h10",
  authDomain: "movie-web-siraj.firebaseapp.com",
  projectId: "movie-web-siraj",
  storageBucket: "movie-web-siraj.appspot.com",
  messagingSenderId: "836032755374",
  appId: "1:836032755374:web:324f5903c0826b01585f3f",
  measurementId: "G-YPDJPGX07R"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore(app)
export { auth, firestore }