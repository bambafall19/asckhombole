import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";

export default function PartenairesPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOS PARTENAIRES</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Leur soutien est essentiel à notre succès. Découvrez-les et rejoignez-les.
        </p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Ils nous font confiance</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-20">
          <Handshake className="w-24 h-24 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Page en construction</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            La liste de nos précieux partenaires et le formulaire pour le devenir seront affichés ici.
          </p>
          <Button size="lg">Devenir Partenaire</Button>
        </CardContent>
      </Card>
    </main>
  );
}
