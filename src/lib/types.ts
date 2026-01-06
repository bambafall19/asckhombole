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

export interface Match {
  id: string;
  date: Timestamp;
  competition: string;
  homeTeam: string;
  awayTeam:string;
  homeScore?: number;
  awayScore?: number;
  status: 'Terminé' | 'À venir' | 'Reporté';
}

export interface Photo {
    id: string;
    title: string;
    imageUrl: string;
    imageHint?: string;
    createdAt: Timestamp;
}
