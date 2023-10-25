import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwlB_sSqNL7YVIqiJy7hHKmNFFk6WjTSs",
  authDomain: "medical-41f0d.firebaseapp.com",
  projectId: "medical-41f0d",
  storageBucket: "medical-41f0d.appspot.com",
  messagingSenderId: "815929719920",
  appId: "1:815929719920:web:5722bb9caef4bee47e88b5",
  measurementId: "G-9W2FG22R5L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { app, auth, db };
