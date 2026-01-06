'use client';

import { useEffect, useReducer, useRef } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  Unsubscribe,
  QuerySnapshot,
} from 'firebase/firestore';

interface State<T> {
  loading: boolean;
  data?: T[];
  error?: FirestoreError;
}

type Action<T> =
  | { type: 'loading' }
  | { type: 'success'; payload: T[] }
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

export function useCollection<T>(
  query: Query<DocumentData> | null
): State<T> {
  const [state, dispatch] = useReducer(reducer<T>, initialState);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!query) {
      dispatch({ type: 'success', payload: [] });
      return;
    }

    unsubscribeRef.current = onSnapshot(
      query,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const data: T[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as unknown as T);
        });
        dispatch({ type: 'success', payload: data });
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
  }, [query]);

  return state;
}
