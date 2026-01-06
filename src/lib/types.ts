import { Timestamp } from "firebase/firestore";

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imageHint?: string;
  category: string;
  createdAt: Timestamp;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  imageUrl: string;
  imageHint?: string;
}
