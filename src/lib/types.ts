import { Timestamp } from "firebase/firestore";

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: Timestamp;
  tags?: ('featured' | 'trendy' | 'top')[];
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  imageUrl: string;
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
    logoUrl?: string;
    history: string;
    historyImageUrl?: string;
    presidentWord: string;
    presidentWordImageUrl?: string;
    presidentWishes: string;
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    welcomeImageUrl?: string;
    welcomeImageUrl2?: string;
    welcomeImageUrl3?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    googleMapsUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
}
