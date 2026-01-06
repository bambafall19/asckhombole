'use client';

import { useEffect, useReducer, useRef } from 'react';
import {
  onSnapshot,
  doc,
  getDoc,
  DocumentReference,
  DocumentData,
  FirestoreError,
  Unsubscribe,
  DocumentSnapshot,
} from 'firebase/firestore';

interface State<T> {
  loading: boolean;
  data?: T;
  error?: FirestoreError;
}

type Action<T> =
  | { type: 'loading' }
  | { type: 'success'; payload: T | undefined }
  | { type: 'error'; payload: FirestoreError };

const initialState = {
  loading: true,
};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return { loading: true };
    case 'success':
      return { loading: false, data: action.payload };
    case 'error':
      return { loading: false, error: action.payload };
    default:
      throw new Error('Invalid action');
  }
}

export function useDocument<T>(
  docRef: DocumentReference<DocumentData> | null
): State<T> {
  const [state, dispatch] = useReducer(reducer<T>, initialState);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!docRef) {
      dispatch({ type: 'success', payload: undefined });
      return;
    }

    unsubscribeRef.current = onSnapshot(
      docRef,
      (docSnapshot: DocumentSnapshot<DocumentData>) => {
        if (docSnapshot.exists()) {
          const data = { id: docSnapshot.id, ...docSnapshot.data() } as unknown as T;
          dispatch({ type: 'success', payload: data });
        } else {
          dispatch({ type: 'success', payload: undefined });
        }
      },
      (error: FirestoreError) => {
        dispatch({ type: 'error', payload: error });
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [docRef]);

  return state;
}