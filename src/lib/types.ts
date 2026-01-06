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
  homeScore?: number | null;
  awayScore?: number | null;
  status: 'Terminé' | 'À venir' | 'Reporté';
}

export interface Photo {
    id: string;
    title: string;
    imageUrl: string;
    imageHint?: string;
    createdAt: Timestamp;
}

export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
}
