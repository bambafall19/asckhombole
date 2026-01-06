'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// This is a client-side component that listens for Firestore permission errors
// and throws them. This is so that they can be caught by the Next.js development
// overlay and displayed to the developer.
export function FirebaseErrorListener() {
  useEffect(() => {
    const onPermissionError = (error: FirestorePermissionError) => {
      // This is a special error that we want to show to the developer
      // in the Next.js development overlay.
      //
      // We throw the error here so that it can be caught by the overlay.
      throw error;
    };
    errorEmitter.on('permission-error', onPermissionError);
    return () => {
      errorEmitter.off('permission-error', onPermissionError);
    };
  }, []);

  return null;
}
