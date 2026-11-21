// services/firebaseAuth.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCeRwS80X7OGrWX681EWHKkcYsVViJgEgs",
    authDomain: "react-native-auth-demo-92065.firebaseapp.com",
    projectId: "react-native-auth-demo-92065",
    storageBucket: "react-native-auth-demo-92065.firebasestorage.app",
    messagingSenderId: "427008716125",
    appId: "1:427008716125:web:c273a2ee6696e52e610cb4",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('console------>app:', app);

// Get Auth instance (NO getReactNativePersistence!)
const auth = getAuth(app);
console.log("Firebase Auth initialized:", auth ? "Success" : "Failed");

console.log('console------>auth:', auth);

export { auth };

