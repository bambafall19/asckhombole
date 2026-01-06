'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from "@/firebase";
import { Player } from "@/lib/types";

function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="text-center overflow-hidden group">
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        <Image
          src={player.imageUrl}
          alt={`Photo de ${player.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          data-ai-hint={player.imageHint || 'soccer player portrait'}
        />
      </div>
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-primary absolute top-2 right-2 bg-background/80 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">
          {player.number}
        </p>
        <h3 className="text-lg font-bold mt-1">{player.name}</h3>
        <p className="text-muted-foreground text-sm">{player.position}</p>
      </CardContent>
    </Card>
  );
}

export default function EquipePage() {
  const firestore = useFirestore();
  const playersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'players'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: players, loading } = useCollection<Player>(playersQuery);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOS JOUEURS</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          La force de l'ASC Khombole sur le terrain.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
        </div>
      )}

      {!loading && players && players.length === 0 && (
         <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Effectif 2025-2026</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-20">
            <Users className="w-24 h-24 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aucun joueur dans l'effectif</h3>
            <p className="text-muted-foreground mt-2">
              Ajoutez des joueurs depuis le panneau d'administration.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && players && players.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </main>
  );
}
