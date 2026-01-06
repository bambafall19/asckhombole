'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LoaderCircle, User, Shield } from "lucide-react";
import Image from "next/image";

const players = {
  gardiens: [
    { name: "Khadim DIOP", number: 1 },
    { name: "Daouda GUEYE", number: 16 },
    { name: "Babacar NIANG", number: 23 },
  ],
  defenseurs: [
    { name: "Macoura GUEYE", number: 2 },
    { name: "Mamadou MBAYE", number: 3 },
    { name: "Ibrahima Seck NDIAYE", number: 4 },
    { name: "Darou SY", number: 5 },
    { name: "Adiouma BODEL SOW", number: 12 },
    { name: "Amadou BARRY", number: 13 },
    { name: "Abdourahmane NDIAYE", number: 14 },
    { name: "Mamadou Falliou TRAORE", number: 15 },
    { name: "Moussa LO", number: 22 },
  ],
  milieux: [
    { name: "Pape Assane DIENG", number: 6 },
    { name: "Mbabck CISSE", number: 8 },
    { name: "Mody BEYE", number: 10 },
    { name: "Papa DIAGNE", number: 17 },
    { name: "Pape Mor SAMB", number: 18 },
    { name: "Ndiakhate DIAL", number: 19 },
    { name: "Malal FAYE", number: 20 },
    { name: "Serigne Saliou NDIAYE", number: 21 },
    { name: "Talla Coly GNING", number: 24 },
    { name: "Ibrahima Khalil MBAYE", number: 25 },
  ],
  attaquants: [
    { name: "Omar NIANG", number: 7 },
    { name: "Francis Yannick DIEME", number: 9 },
    { name: "Abdou MAR", number: 11 },
    { name: "Abdou KANDJI", number: 26 },
    { name: "Mor Seck El Hadji DIOUF", number: 27 },
    { name: "Serigne Abdou Aziz SEYE", number: 28 },
    { name: "Youssoupha MANGA", number: 29 },
  ],
};

const coach = {
  name: "Amadou Kiffa GUEYE",
  role: "Entraîneur Principal",
};

function PlayerCard({ name, number }: { name: string, number: number }) {
  return (
    <Card className="text-center overflow-hidden group">
      <div className="relative aspect-square w-full bg-muted overflow-hidden flex items-center justify-center">
        <User className="w-16 h-16 text-muted-foreground" />
      </div>
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-primary absolute top-2 right-2 bg-background/80 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm">
          {number}
        </p>
        <h3 className="text-lg font-bold mt-1">{name}</h3>
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
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOS JOUEURS</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          La force de l'ASC Khombole sur le terrain.
        </p>
      </div>

      <div className="space-y-12">
        <Section title="Gardiens">
          {players.gardiens.map((player) => (
            <PlayerCard key={player.name} name={player.name} number={player.number} />
          ))}
        </Section>
        <Section title="Défenseurs">
          {players.defenseurs.map((player) => (
            <PlayerCard key={player.name} name={player.name} number={player.number} />
          ))}
        </Section>
        <Section title="Milieux">
          {players.milieux.map((player) => (
            <PlayerCard key={player.name} name={player.name} number={player.number} />
          ))}
        </Section>
        <Section title="Attaquants">
          {players.attaquants.map((player) => (
            <PlayerCard key={player.name} name={player.name} number={player.number} />
          ))}
        </Section>

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
    </main>
  );
}
