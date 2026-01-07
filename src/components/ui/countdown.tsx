
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { Calendar, Info, LoaderCircle } from "lucide-react";
import { Match } from "@/lib/types";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft | null => {
  const difference = +targetDate - +new Date();
  if (difference <= 0) {
    return null;
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownUnit = ({ value, unit }: { value: number; unit: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-bold text-primary">{String(value).padStart(2, "0")}</span>
    <span className="text-xs text-muted-foreground uppercase">{unit}</span>
  </div>
);

function CountdownSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                 <CardTitle className="text-lg font-headline text-muted-foreground flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5"/>
                    Prochain Match à Domicile
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="flex justify-around">
                    <div className="flex flex-col items-center space-y-1">
                        <Skeleton className="h-8 w-10" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                     <div className="flex flex-col items-center space-y-1">
                        <Skeleton className="h-8 w-10" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                     <div className="flex flex-col items-center space-y-1">
                        <Skeleton className="h-8 w-10" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                     <div className="flex flex-col items-center space-y-1">
                        <Skeleton className="h-8 w-10" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                </div>
                <Skeleton className="h-4 w-1/2 mx-auto" />
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
                    Prochain Match à Domicile
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
                <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucun match à domicile programmé.</p>
            </CardContent>
        </Card>
    );
}


export function Countdown({ match, loading }: { match?: Match | null, loading: boolean }) {
  // Initialize timeLeft to undefined to prevent hydration mismatch.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(undefined);

  useEffect(() => {
    if (!match) {
        setTimeLeft(null); // Explicitly set to null when no match
        return;
    }
    
    // Initial calculation on client mount
    const initialTimeLeft = calculateTimeLeft(match.date.toDate());
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft === null) return; // Stop if match has already started

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(match.date.toDate());
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        // Time is up
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [match]); // Rerun effect if match changes

  if (loading) {
    return <CountdownSkeleton />;
  }

  // Handle case where there is no upcoming match
  if (!match) {
    return <NoMatchAvailable />;
  }

  // Handle case where countdown is over or not yet calculated on client
  if (timeLeft === null || timeLeft === undefined) {
    return (
        <Card className="bg-primary/5 border-primary/20 shadow-lg">
             <CardHeader className="pb-3">
                <CardTitle className="text-lg font-headline text-primary flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5"/>
                    Prochain Match à Domicile
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
                 {timeLeft === null ? (
                    <p className="text-sm text-muted-foreground">Le match a commencé !</p>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        <span>Calcul...</span>
                    </div>
                )}
                 <p className="text-sm text-muted-foreground font-semibold mt-2">{match.homeTeam} vs {match.awayTeam}</p>
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="bg-primary/5 border-primary/20 shadow-lg">
       <CardHeader className="pb-3">
        <CardTitle className="text-lg font-headline text-primary flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5"/>
            Prochain Match à Domicile
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
         <div className="flex justify-around my-4">
            <CountdownUnit value={timeLeft.days} unit="Jours" />
            <CountdownUnit value={timeLeft.hours} unit="Heures" />
            <CountdownUnit value={timeLeft.minutes} unit="Min" />
            <CountdownUnit value={timeLeft.seconds} unit="Sec" />
        </div>
        <p className="text-sm text-muted-foreground font-semibold mt-2">{match.homeTeam} vs {match.awayTeam}</p>
      </CardContent>
    </Card>
  );
}
