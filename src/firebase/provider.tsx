'use client';
import {
  FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  Auth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { createContext, useContext, useMemo } from 'react';
import { firebaseConfig } from './config';
import { FirebaseErrorListener } from '@/components/firebase-error-listener';


// The following 2 lines assumes you have a `firebase.json` file at the root of your project
// with the following content:
// {
//   "emulators": {
//     "auth": {
//       "port": 9099
//     },
//     "firestore": {
//       "port": 8080
//     }
//   }
// }
const USE_EMULATOR = process.env.NODE_ENV === 'development';

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

export function _getFirebase() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);

    if (USE_EMULATOR) {
      // Set up emulators
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
    }
  } else {
    firebaseApp = getApp();
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  }
  return { firebaseApp, firestore, auth };
}
export interface FirebaseProviderProps {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

const FirebaseContext = createContext<FirebaseProviderProps | null>(null);

export function FirebaseProvider({
  children,
  firebaseApp,
  firestore,
  auth,
}: FirebaseProviderProps) {
  const contextValue = useMemo(() => {
    return { firebaseApp, firestore, auth };
  }, [firebaseApp, firestore, auth]);

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        firestore,
        auth,
      }}
    >
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
}

export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}

export function useAuth() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}
