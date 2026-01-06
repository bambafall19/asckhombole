'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, LoaderCircle } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { Partner } from "@/lib/types";
import { useMemo } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import Image from "next/image";
import Link from "next/link";

function PartnerCard({ partner }: { partner: Partner }) {
    const cardContent = (
        <div className="flex justify-center items-center h-24 bg-card group-hover:bg-muted transition-colors">
            <Image
              src={partner.logoUrl}
              alt={`Logo de ${partner.name}`}
              width={150}
              height={75}
              className="object-contain max-h-16"
            />
        </div>
    )

    if (partner.website) {
        return (
            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="overflow-hidden">
                    {cardContent}
                </Card>
            </a>
        )
    }

    return (
        <Card>
            {cardContent}
        </Card>
    )
}

export default function PartenairesPage() {
    const firestore = useFirestore();
    const partnersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'partners'), orderBy('name', 'asc'));
    }, [firestore]);

    const { data: partners, loading } = useCollection<Partner>(partnersQuery);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOS PARTENAIRES</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Leur soutien est essentiel à notre succès. Découvrez-les et rejoignez-les.
        </p>
      </div>

       {loading && (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
        </div>
      )}
      
      {!loading && partners && partners.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      )}

      {!loading && (!partners || partners.length === 0) && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Ils nous font confiance</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center py-20">
              <Handshake className="w-24 h-24 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Aucun partenaire pour le moment</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Ajoutez des partenaires depuis le panneau d'administration.
              </p>
            </CardContent>
          </Card>
      )}

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold font-headline mb-4">Devenez Partenaire</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Associez votre image à nos valeurs de combativité et d'excellence et bénéficiez d'une visibilité unique auprès de notre communauté.
        </p>
        <Button size="lg" asChild>
            <Link href="/contact">Nous Contacter</Link>
        </Button>
      </div>
    </main>
  );
}
