import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function EquipePage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOS JOUEURS</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          La force de l'ASC Khombole sur le terrain.
        </p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Effectif 2025-2026</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-20">
          <Users className="w-24 h-24 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Bientôt disponible</h3>
          <p className="text-muted-foreground mt-2">
            La liste des joueurs sera bientôt récupérée depuis la base de données.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
