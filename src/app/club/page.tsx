'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, User, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { doc } from 'firebase/firestore';
import { useDocument, useFirestore } from "@/firebase";
import { ClubInfo } from "@/lib/types";
import Image from 'next/image';
import { Skeleton } from "@/components/ui/skeleton";

function ClubPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-2/3 mx-auto" />
        <Skeleton className="h-5 w-1/2 mx-auto mt-4" />
      </div>
      <div className="space-y-16 md:space-y-24">
        <section className="rounded-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="aspect-square md:aspect-[4/5] h-full w-full rounded-lg" />
          </div>
        </section>
        <section className="relative overflow-hidden rounded-lg shadow-lg bg-black h-80 flex items-center justify-center">
           <div className="max-w-3xl mx-auto text-center space-y-4">
              <Skeleton className="h-9 w-48 mx-auto bg-gray-600"/>
              <Skeleton className="h-5 w-full mx-auto bg-gray-600"/>
              <Skeleton className="h-5 w-full mx-auto bg-gray-600"/>
              <Skeleton className="h-5 w-3/4 mx-auto bg-gray-600"/>
            </div>
        </section>
        <section className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-9 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}


export default function ClubPage() {
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: clubInfo, loading } = useDocument<ClubInfo>(clubInfoRef);

  if (loading) {
    return (
      <div className="bg-background">
        <ClubPageSkeleton />
      </div>
    );
  }

  const renderWishes = (wishes: string) => {
    const lines = wishes.split('\n').filter(line => line.trim() !== '');
    const listItems = lines.filter(line => line.trim().startsWith('-'));
    const intro = lines.find(line => !line.trim().startsWith('-') && line.includes('ambition'));
    const outro = lines.find(line => !line.trim().startsWith('-') && !line.includes('ambition'));
  
    return (
      <div className="space-y-6 text-lg">
        {intro && <p className="text-muted-foreground leading-relaxed text-justify">{intro}</p>}
        {listItems.length > 0 && (
          <ul className="space-y-4">
            {listItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">{item.substring(1).trim()}</span>
              </li>
            ))}
          </ul>
        )}
        {outro && <p className="text-muted-foreground leading-relaxed text-justify">{outro}</p>}
      </div>
    );
  };

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
          
          {/* President's Word Section */}
          <section className="rounded-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="prose prose-lg max-w-none">
                <h2 className="flex items-center gap-3 text-3xl font-headline text-primary not-prose">
                    <User className="w-8 h-8 text-accent" />
                    Mot du Président
                </h2>
                <div className="text-muted-foreground text-justify">
                   {clubInfo?.presidentWord ? clubInfo.presidentWord.split('\n').map((p, i) => <p key={i}>{p}</p>) : <p>Le mot du président n'a pas encore été renseigné.</p>}
                </div>
              </div>
              {clubInfo?.presidentWordImageUrl && (
                <div className="relative aspect-square md:aspect-[4/5] h-full w-full rounded-lg overflow-hidden shadow-md group">
                  <Image
                    src={clubInfo.presidentWordImageUrl}
                    alt="Mot du président"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    data-ai-hint={clubInfo.presidentWordImageHint || 'club president'}
                  />
                </div>
              )}
            </div>
          </section>

          {/* History Section */}
          <section className="relative overflow-hidden rounded-lg shadow-lg bg-black">
            {clubInfo?.historyImageUrl && (
                <div className="absolute inset-0">
                  <Image
                    src={clubInfo.historyImageUrl}
                    alt="Histoire du club"
                    fill
                    className="object-cover opacity-30"
                    data-ai-hint={clubInfo.historyImageHint || 'club history'}
                  />
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
                {clubInfo?.presidentWishes 
                  ? renderWishes(clubInfo.presidentWishes) 
                  : <p className="text-muted-foreground text-lg">La vision et les vœux n'ont pas encore été renseignés.</p>
                }
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}
