import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnNHuvl7s8ToPkUumW6FUFfW54RhC8Cys",
  authDomain: "crypto-tracker54-c4e37.firebaseapp.com",
  projectId: "crypto-tracker54-c4e37",
  storageBucket: "crypto-tracker54-c4e37.firebasestorage.app",
  messagingSenderId: "1074616978488",
  appId: "1:1074616978488:web:95c3a4bab5995c01646acd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();