import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, Users } from "lucide-react";

export default function ClubPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOTRE CLUB</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'histoire, la vision et les personnes qui font la fierté de l'ASC Khombole.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-accent" />
                <span className="font-headline">Historique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fondé avec passion, l'ASC Khombole a une riche histoire de triomphes et de défis. Page en construction.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-8 h-8 text-accent" />
                <span className="font-headline">Vision & Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nous visons l'excellence sportive tout en ayant un impact positif sur notre communauté. Page en construction.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-8 h-8 text-accent" />
                <span className="font-headline">Staff Dirigeant</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Rencontrez l'équipe dévouée qui travaille en coulisses pour le succès du club. Page en construction.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
