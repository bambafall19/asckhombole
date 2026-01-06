'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LoaderCircle, User, Shield } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from "@/firebase";
import { Player } from "@/lib/types";

const coach = {
  name: "Amadou Kiffa GUEYE",
  role: "Entraîneur Principal",
};

function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="text-center overflow-hidden group">
      <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden flex items-center justify-center">
        <Image
          src={player.imageUrl}
          alt={`Photo de ${player.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          data-ai-hint={player.imageHint || 'soccer player portrait'}
        />
        <p className="text-sm font-semibold text-primary absolute top-2 right-2 bg-background/80 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">
          {player.number}
        </p>
      </div>
      <CardContent className="p-3">
        <h3 className="text-base font-bold truncate">{player.name}</h3>
        <p className="text-xs text-muted-foreground">{player.position}</p>
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-accent" />
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {children}
      </div>
    </section>
  );
}


export default function EquipePage() {
    const firestore = useFirestore();
    const playersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'players'), orderBy('number', 'asc'));
    }, [firestore]);

    const { data: players, loading } = useCollection<Player>(playersQuery);

    const groupedPlayers = useMemo(() => {
        if (!players) return {};
        return players.reduce((acc, player) => {
            const position = player.position.toLowerCase();
            if (position.includes('gardien')) {
                (acc['Gardiens'] = acc['Gardiens'] || []).push(player);
            } else if (position.includes('défenseur')) {
                (acc['Défenseurs'] = acc['Défenseurs'] || []).push(player);
            } else if (position.includes('milieu')) {
                (acc['Milieux'] = acc['Milieux'] || []).push(player);
            } else if (position.includes('attaquant')) {
                (acc['Attaquants'] = acc['Attaquants'] || []).push(player);
            } else {
                 (acc['Autres'] = acc['Autres'] || []).push(player);
            }
            return acc;
        }, {} as Record<string, Player[]>);
    }, [players]);


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

      {!loading && (!players || players.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center py-20">
            <Users className="w-24 h-24 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aucun joueur dans l'effectif</h3>
            <p className="text-muted-foreground mt-2">
              Ajoutez des joueurs depuis le panneau d'administration pour les voir ici.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && players && players.length > 0 && (
         <div className="space-y-12">
            {Object.entries(groupedPlayers).sort(([a], [b]) => {
                const order = ['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants', 'Autres'];
                return order.indexOf(a) - order.indexOf(b);
            }).map(([position, playerList]) => (
                <Section key={position} title={position}>
                    {playerList.map((player) => (
                        <PlayerCard key={player.id} player={player} />
                    ))}
                </Section>
            ))}

            <section>
                <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3">
                    <User className="w-8 h-8 text-accent" />
                    Staff Technique
                </h2>
                <Card className="max-w-xs">
                    <CardHeader>
                        <CardTitle>{coach.name}</CardTitle>
                        <p className="text-muted-foreground">{coach.role}</p>
                    </CardHeader>
                </Card>
            </section>
        </div>
      )}
    </main>
  );
}
