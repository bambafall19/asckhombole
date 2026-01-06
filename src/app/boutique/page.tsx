import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function BoutiquePage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">BOUTIQUE OFFICIELLE</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Portez les couleurs de votre équipe avec fierté.
        </p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Nos Produits</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-20">
          <Store className="w-24 h-24 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">Page en construction</h3>
          <p className="text-muted-foreground mt-2">
            Maillots, écharpes, tickets et plus encore... La boutique en ligne arrive bientôt !
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
