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
  homeTeamLogoUrl?: string;
  awayTeamLogoUrl?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: 'Terminé' | 'À venir' | 'Reporté';
  location?: string;
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

export interface ClubInfo {
    id: string;
    history: string;
    historyImageUrl?: string;
    historyImageHint?: string;
    presidentWord: string;
    presidentWordImageUrl?: string;
    presidentWordImageHint?: string;
    presidentWishes: string;
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    welcomeImageUrl?: string;
    welcomeImageHint?: string;
}
