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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOTRE CLUB</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'histoire, la vision et les personnes qui font la fierté de l'ASC Khombole.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          
          {/* History Section */}
          <section className="relative overflow-hidden rounded-lg shadow-lg">
            {clubInfo?.historyImageUrl && (
                <div className="absolute inset-0">
                  <Image
                    src={clubInfo.historyImageUrl}
                    alt="Histoire du club"
                    fill
                    className="object-cover"
                    data-ai-hint={clubInfo.historyImageHint || 'club history'}
                  />
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>
              )}
              <div className="relative container mx-auto px-4 py-16 md:py-24 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-accent" />
                        <h2 className="text-3xl font-headline text-white">Historique</h2>
                    </div>
                    <p className="text-lg text-white/90 whitespace-pre-wrap text-justify leading-relaxed">
                        {clubInfo?.history || "L'histoire du club n'a pas encore été renseignée."}
                    </p>
                </div>
              </div>
          </section>

          {/* President's Word Section */}
          <section className="bg-muted/50 rounded-lg p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
               {clubInfo?.presidentWordImageUrl && (
                <div className="relative aspect-square md:aspect-auto h-full w-full rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={clubInfo.presidentWordImageUrl}
                    alt="Mot du président"
                    fill
                    className="object-cover"
                    data-ai-hint={clubInfo.presidentWordImageHint || 'club president'}
                  />
                </div>
              )}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                    <User className="w-8 h-8 text-accent" />
                    <h2 className="text-3xl font-headline text-primary">Mot du Président</h2>
                </div>
                <div className="prose prose-lg max-w-none text-muted-foreground text-justify">
                   {clubInfo?.presidentWord ? clubInfo.presidentWord.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p>Le mot du président n'a pas encore été renseigné.</p>}
                </div>
              </div>
            </div>
          </section>
          
          {/* Vision Section */}
          <section className="max-w-4xl mx-auto">
            <Card className="transition-shadow hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <Target className="w-8 h-8 text-accent" />
                  <span className="font-headline">Vœux & Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap text-justify text-lg leading-relaxed">
                  {clubInfo?.presidentWishes || "La vision et les vœux n'ont pas encore été renseignés."}
                </p>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
