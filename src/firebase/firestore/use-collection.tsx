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
): State<T> & { mutate: () => void } {
  const [state, dispatch] = useReducer(reducer<T>, initialState);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const fetchData = () => {
    if (!query) {
      dispatch({ type: 'success', payload: [] });
      return;
    }
    
    dispatch({ type: 'loading' });

    if (unsubscribeRef.current) {
        unsubscribeRef.current();
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
        console.error("Firestore error in useCollection:", error);
        dispatch({ type: 'error', payload: error });
      }
    );
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  return { ...state, mutate: fetchData };
}
