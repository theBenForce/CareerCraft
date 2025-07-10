import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

// Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate configuration
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.warn('Firebase client configuration incomplete. Some features may not work.')
}

// Initialize Firebase client app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize services
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099')
  } catch (error) {
    // Emulator connection may fail if not already connected or not running
    console.log('Firebase Auth emulator not available:', error)
  }

  try {
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080)
  } catch (error) {
    console.log('Firestore emulator not available:', error)
  }

  try {
    // Connect to Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch (error) {
    console.log('Storage emulator not available:', error)
  }
}

export { app as firebaseClientApp, db as clientDb, storage as clientStorage, auth as clientAuth }