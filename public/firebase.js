// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";
import { 
  getStorage, 
  ref as sref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/9.24.0/firebase-storage.js";

// YOUR NEW CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyDT5uzoSZ4xtLsTfoSEoPuhJ4Ypfj4azMk",
  authDomain: "lostandfound-24525.firebaseapp.com",
  projectId: "lostandfound-24525",
  storageBucket: "lostandfound-24525.firebasestorage.app",
  messagingSenderId: "106228672608",
  appId: "1:106228672608:web:bd6ecb45639969b8ba7b05"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  sref, 
  uploadBytes, 
  getDownloadURL, 
  storage 
};