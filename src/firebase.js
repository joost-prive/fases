import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyA48LIqisQl7H7O7pqkyyGax3pulsu3rKE",
  authDomain: "fases-13cc7.firebaseapp.com",
  projectId: "fases-13cc7",
  storageBucket: "fases-13cc7.firebasestorage.app",
  messagingSenderId: "826207067861",
  appId: "1:826207067861:web:a3cd946a2a24a1ca934c5c"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
