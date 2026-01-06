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
