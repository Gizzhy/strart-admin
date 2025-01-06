import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvOt7ET2urs__YJj0Xy2nylGpV4djU9NU",
  authDomain: "strart-a8361.firebaseapp.com",
  projectId: "strart-a8361",
  storageBucket: "strart-a8361.firebasestorage.app",
  messagingSenderId: "1085168173208",
  appId: "1:1085168173208:web:b8b06b732aac21c51d50ed",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
