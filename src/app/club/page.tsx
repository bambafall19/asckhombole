'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, User, LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { doc } from 'firebase/firestore';
import { useDocument, useFirestore } from "@/firebase";
import { ClubInfo } from "@/lib/types";
import Image from 'next/image';

export default function ClubPage() {
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: clubInfo, loading } = useDocument<ClubInfo>(clubInfoRef);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOTRE CLUB</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'histoire, la vision et les personnes qui font la fierté de l'ASC Khombole.
          </p>
        </div>

        <div className="space-y-12 max-w-4xl mx-auto">
          <Card className="overflow-hidden group transition-shadow hover:shadow-lg">
            <div className="grid md:grid-cols-2">
              {clubInfo?.historyImageUrl && (
                <div className="relative aspect-video md:aspect-auto">
                  <Image
                    src={clubInfo.historyImageUrl}
                    alt="Histoire du club"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={clubInfo.historyImageHint || 'club history'}
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-center">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-accent" />
                    <span className="font-headline">Historique</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground whitespace-pre-wrap text-justify">
                    {clubInfo?.history || "L'histoire du club n'a pas encore été renseignée."}
                  </p>
                </CardContent>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden group transition-shadow hover:shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="p-6 flex flex-col justify-center md:order-last">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-3">
                    <User className="w-8 h-8 text-accent" />
                    <span className="font-headline">Mot du Président</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground whitespace-pre-wrap text-justify">
                    {clubInfo?.presidentWord || "Le mot du président n'a pas encore été renseigné."}
                  </p>
                </CardContent>
              </div>
              {clubInfo?.presidentWordImageUrl && (
                <div className="relative aspect-video md:aspect-auto">
                  <Image
                    src={clubInfo.presidentWordImageUrl}
                    alt="Mot du président"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={clubInfo.presidentWordImageHint || 'club president'}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-8 h-8 text-accent" />
                <span className="font-headline">Vœux & Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap text-justify">
                {clubInfo?.presidentWishes || "La vision et les vœux n'ont pas encore été renseignés."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
