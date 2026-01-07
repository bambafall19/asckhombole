'use client';

import { Match } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Calendar, Info } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

function Countdown({ toDate }: { toDate: Date }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(toDate) - +new Date();
        let timeLeft = {
            jours: 0,
            heures: 0,
            minutes: 0,
            secondes: 0,
        };

        if (difference > 0) {
            timeLeft = {
                jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
                heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                secondes: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const hasEnded = Object.values(timeLeft).every(val => val === 0);

    if (hasEnded) {
        return (
            <div className="text-center my-4">
                <p className="font-semibold text-primary">Le match a commencé !</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-4 gap-2 text-center my-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-primary/10 p-2 rounded-lg">
                    <div className="text-xl font-bold text-primary">{value.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-primary/80 capitalize">{unit}</div>
                </div>
            ))}
        </div>
    );
}


function NextMatchSidebarSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent className="text-center space-y-2">
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <div className="flex items-center justify-around my-4">
                    <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                     <span className="text-muted-foreground font-bold text-xl">VS</span>
                     <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
                 <Skeleton className="h-9 w-28 mx-auto" />
            </CardContent>
        </Card>
    );
}

function NoMatchAvailable() {
    return (
        <Card className="bg-muted/50 border-dashed">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-headline text-muted-foreground flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5"/>
                    Prochain Match
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
                <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun match à venir n'est programmé pour le moment.</p>
            </CardContent>
        </Card>
    );
}


export function NextMatchSidebar({ match, loading }: { match?: Match | null, loading: boolean }) {
  if (loading) {
    return <NextMatchSidebarSkeleton />;
  }

  if (!match) {
    return <NoMatchAvailable />;
  }
  
  const isHomeTeam = (team: string) => team.toLowerCase().includes('khombole');

  return (
    <Card className="bg-primary/5 border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-headline text-primary flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5"/>
            Prochain Match
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{match.competition}</p>
        <p className="text-sm font-semibold text-muted-foreground">{format(match.date.toDate(), 'eeee d MMMM yyyy', { locale: fr })}</p>
        
        <Countdown toDate={match.date.toDate()} />
        
        <div className="flex items-center justify-around my-4">
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.homeTeamLogoUrl ? <Image src={match.homeTeamLogoUrl} alt={match.homeTeam} width={48} height={48} className="object-contain" /> : <div className="w-12 h-12"></div>}
                <p className={cn("font-bold", isHomeTeam(match.homeTeam) && "text-primary")}>{match.homeTeam}</p>
            </div>
            <span className="text-muted-foreground font-bold text-xl">VS</span>
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.awayTeamLogoUrl ? <Image src={match.awayTeamLogoUrl} alt={match.awayTeam} width={48} height={48} className="object-contain" /> : <div className="w-12 h-12"></div>}
                <p className={cn("font-bold", isHomeTeam(match.awayTeam) && "text-primary")}>{match.awayTeam}</p>
            </div>
        </div>
         <p className="text-sm font-semibold text-muted-foreground">Coup d'envoi à {format(match.date.toDate(), 'HH:mm', { locale: fr })}</p>
         <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/matchs">Voir les matchs</Link>
         </Button>
      </CardContent>
    </Card>
  )
}
