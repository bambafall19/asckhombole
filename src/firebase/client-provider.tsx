'use client';
import {
  FirebaseProvider,
  FirebaseProviderProps,
  _getFirebase,
} from '@/firebase/provider';
import { useMemo } from 'react';

/**
 * A client-side component that initializes Firebase and provides it to the app.
 *
 * This component should be used at the root of the client-side app.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const
    { firebaseApp, firestore, auth } = useMemo(() => _getFirebase(), []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
