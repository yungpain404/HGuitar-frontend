import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  type Auth,
} from 'firebase/auth'
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig'

let firebaseApp: FirebaseApp | undefined
let firebaseAuth: Auth | undefined

function requireAuth(): Auth {
  if (!isFirebaseConfigured) {
    throw new Error('FIREBASE_NOT_CONFIGURED')
  }

  if (!firebaseApp) {
    firebaseApp = getApps()[0] ?? initializeApp({
      apiKey: firebaseConfig.apiKey!,
      authDomain: firebaseConfig.authDomain!,
      projectId: firebaseConfig.projectId!,
      appId: firebaseConfig.appId!,
      messagingSenderId: firebaseConfig.messagingSenderId,
    })
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp)
  }

  return firebaseAuth
}

/**
 * Opens the Google account picker through Firebase and returns a fresh
 * Firebase ID token. The backend verifies this token and issues the app JWT.
 */
export async function signInWithGoogle(): Promise<string> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const result = await signInWithPopup(requireAuth(), provider)
  return result.user.getIdToken()
}
