import { initializeApp, getApps, App, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage, Storage } from 'firebase-admin/storage'

// Firebase Admin configuration
let app: App
let db: Firestore
let storage: Storage

try {
  // Check if Firebase Admin app is already initialized
  if (getApps().length === 0) {
    // Initialize Firebase Admin with service account
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    const projectId = process.env.FIREBASE_PROJECT_ID
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

    if (!serviceAccount || !projectId) {
      throw new Error('Firebase Admin configuration missing. Please set FIREBASE_SERVICE_ACCOUNT and FIREBASE_PROJECT_ID environment variables.')
    }

    const serviceAccountKey = JSON.parse(serviceAccount)

    app = initializeApp({
      credential: cert(serviceAccountKey),
      projectId: projectId,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
    })
  } else {
    app = getApps()[0]
  }

  // Initialize Firestore and Storage
  db = getFirestore(app)
  storage = getStorage(app)

  // Configure Firestore settings
  db.settings({ ignoreUndefinedProperties: true })

} catch (error) {
  console.error('Firebase Admin initialization error:', error)
  throw error
}

export { app as firebaseApp, db as firebaseDb, storage as firebaseStorage }

// Helper function to handle Firestore timestamps
export const convertTimestamp = (timestamp: any) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate()
  }
  return timestamp
}

// Helper function to convert Firestore document to plain object
export const convertFirestoreDoc = (doc: any) => {
  if (!doc.exists) {
    return null
  }

  const data = doc.data()
  const converted: any = { id: doc.id }

  for (const [key, value] of Object.entries(data)) {
    converted[key] = convertTimestamp(value)
  }

  return converted
}

// Helper function to convert Firestore query snapshot to array of objects
export const convertFirestoreSnapshot = (snapshot: any) => {
  return snapshot.docs.map(convertFirestoreDoc)
}