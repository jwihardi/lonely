import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDwSZxwr3AxPZ-L5t_14LRDnpEYpXRnqA8",
  authDomain: "groupfinder-d9f80.firebaseapp.com",
  projectId: "groupfinder-d9f80",
  storageBucket: "groupfinder-d9f80.firebasestorage.app",
  messagingSenderId: "680017491696",
  appId: "1:680017491696:web:7661af8da8ff6a72e77435",
  measurementId: "G-FXM1LB62X3"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage };