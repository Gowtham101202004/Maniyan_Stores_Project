import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA8fEVn2fOA98uiIIiWVd3MBa8solugaOU",
  authDomain: "my-project-e4146.firebaseapp.com",
  projectId: "my-project-e4146",
  storageBucket: "my-project-e4146.firebasestorage.app",
  messagingSenderId: "489590404919",
  appId: "1:489590404919:web:346df5cd8a45c3f8b38cb2",
  measurementId: "G-0D2XL5Y6NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export{auth, provider, onAuthStateChanged, signOut};