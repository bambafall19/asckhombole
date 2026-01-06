import { _getFirebase } from '@/firebase/provider';
import { firebaseConfig } from './config';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
export { useCollection } from './firestore/use-collection';
export { useDocument } from './firestore/use-doc';
export { useUser } from './auth/use-user';
export { FirebaseClientProvider } from './client-provider';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}
