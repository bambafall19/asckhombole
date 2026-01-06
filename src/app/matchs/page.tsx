'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trophy, LoaderCircle, Calendar, MapPin } from "lucide-react";
import { useMemo } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollection, useFirestore } from "@/firebase";
import { Match } from "@/lib/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'Terminé';
  const isHomeTeam = (team: string) => team.toLowerCase().includes('khombole');
  
  const getTeamClasses = (team: string, isWinner: boolean) => {
    return cn(
      "font-bold text-lg",
      isHomeTeam(team) && "text-primary",
      isFinished && !isWinner && "text-muted-foreground/80"
    );
  };
  
  const homeWinner = isFinished && match.homeScore! > match.awayScore!;
  const awayWinner = isFinished && match.awayScore! > match.homeScore!;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="font-semibold">{match.competition}</span>
            <span>{format(match.date.toDate(), 'PPP', { locale: fr })}</span>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.homeTeamLogoUrl && <Image src={match.homeTeamLogoUrl} alt={match.homeTeam} width={40} height={40} className="object-contain" />}
                <p className={getTeamClasses(match.homeTeam, homeWinner)}>{match.homeTeam}</p>
            </div>
          <div className="flex items-center gap-4 font-bold text-2xl">
            <span className={cn(homeWinner && 'text-primary')}>{isFinished ? match.homeScore : '-'}</span>
            <span className="text-muted-foreground text-xl">vs</span>
            <span className={cn(awayWinner && 'text-primary')}>{isFinished ? match.awayScore : '-'}</span>
          </div>
           <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.awayTeamLogoUrl && <Image src={match.awayTeamLogoUrl} alt={match.awayTeam} width={40} height={40} className="object-contain" />}
                <p className={getTeamClasses(match.awayTeam, awayWinner)}>{match.awayTeam}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="py-2 text-xs justify-center text-muted-foreground flex-wrap gap-x-4 gap-y-1">
          {match.status === 'À venir' && <span>Coup d'envoi à {format(match.date.toDate(), 'HH:mm', { locale: fr })}</span>}
          {match.status === 'Terminé' && <span>Match terminé</span>}
          {match.status === 'Reporté' && <span>Match reporté</span>}
          {match.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{match.location}</span>
            </div>
          )}
      </CardFooter>
    </Card>
  );
}


export default function MatchsPage() {
  const firestore = useFirestore();
  const matchesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'matches'), orderBy('date', 'desc'));
  }, [firestore]);

  const { data: matches, loading } = useCollection<Match>(matchesQuery);

  const upcomingMatches = useMemo(() => matches?.filter(m => m.status === 'À venir').sort((a,b) => a.date.toMillis() - b.date.toMillis()), [matches]);
  const finishedMatches = useMemo(() => matches?.filter(m => m.status === 'Terminé'), [matches]);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">MATCHS & RÉSULTATS</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Le calendrier complet, les scores et les classements de la saison.
        </p>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
        </div>
      )}

      {!loading && (!matches || matches.length === 0) && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Saison 2024-2025</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-20">
            <Trophy className="w-24 h-24 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aucun match programmé</h3>
            <p className="text-muted-foreground mt-2">
              Le calendrier des matchs sera bientôt disponible. Ajoutez des matchs depuis le panneau d'administration.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && matches && matches.length > 0 && (
        <div className="space-y-12">
          {upcomingMatches && upcomingMatches.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-center mb-6 font-headline flex items-center justify-center gap-3">
                <Calendar className="w-8 h-8 text-accent"/> Prochaines Rencontres
              </h2>
              <div className="space-y-4 max-w-4xl mx-auto">
                {upcomingMatches.map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            </section>
          )}

          {finishedMatches && finishedMatches.length > 0 && (
             <section>
              <h2 className="text-3xl font-bold text-center mb-6 font-headline flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-accent"/> Derniers Résultats
              </h2>
              <div className="space-y-4 max-w-4xl mx-auto">
                {finishedMatches.map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
