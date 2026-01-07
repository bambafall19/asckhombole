"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";
import { Calendar, Info } from "lucide-react";
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
                 <Skeleton className="h-6 w-3/4 mx-auto" />
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
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!match) {
        setTimeLeft(null);
        return;
    }
    
    // Set initial time left
    setTimeLeft(calculateTimeLeft(match.date.toDate()));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(match.date.toDate()));
    }, 1000);

    return () => clearInterval(timer);
  }, [match]);

  if (loading) {
    return <CountdownSkeleton />;
  }

  if (!match || !timeLeft) {
    return <NoMatchAvailable />;
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
