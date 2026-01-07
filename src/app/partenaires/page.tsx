'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, LoaderCircle, Sparkles } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { Partner } from "@/lib/types";
import { useMemo } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function PartnerCard({ partner }: { partner: Partner }) {
    const cardContent = (
        <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50">
          <CardContent className="flex justify-center items-center p-6 h-32 bg-muted/30 group-hover:bg-muted/60 transition-colors">
            <Image
              src={partner.logoUrl}
              alt={`Logo de ${partner.name}`}
              width={160}
              height={80}
              className="object-contain max-h-16 transition-transform duration-300 group-hover:scale-105"
            />
          </CardContent>
        </Card>
    )

    if (partner.website) {
        return (
            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block h-full">
                {cardContent}
            </a>
        )
    }

    return cardContent;
}

function PartnerSection({ title, partners, loading }: { title: string, partners?: Partner[], loading: boolean }) {
    return (
        <section>
            <h2 className="text-3xl font-bold font-headline text-primary mb-6">{title}</h2>
            {loading ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
                 </div>
            ) : (
                partners && partners.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {partners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Aucun partenaire dans cette catégorie pour le moment.</p>
                )
            )}
        </section>
    )
}

export default function PartenairesPage() {
    const firestore = useFirestore();
    const partnersQuery = useMemo(() => {
        if (!firestore) return null;
        // You might want to add a 'tier' or 'category' field to your partner data
        // to easily query different types of partners.
        return query(collection(firestore, 'partners'), orderBy('name', 'asc'));
    }, [firestore]);

    const { data: partners, loading } = useCollection<Partner>(partnersQuery);
    
    // Example of splitting partners into categories. 
    // This logic should be adapted based on your actual data structure.
    const majorPartners = useMemo(() => partners?.filter(p => p.name.toLowerCase().includes('majeur')), [partners]);
    const officialSuppliers = useMemo(() => partners?.filter(p => !p.name.toLowerCase().includes('majeur')), [partners]);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOS PARTENAIRES</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Leur soutien est essentiel à notre succès. Découvrez ceux qui nous font confiance.
        </p>
      </div>

       {loading && (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
        </div>
      )}
      
      {!loading && partners && partners.length > 0 && (
        <div className="space-y-12">
            {/* You can create as many sections as you need based on partner categories */}
            <PartnerSection title="Partenaires Majeurs" partners={partners} loading={loading} />
            {/* <PartnerSection title="Fournisseurs Officiels" partners={officialSuppliers} loading={loading} /> */}
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

      <Card className="bg-muted/30">
          <CardContent className="p-8 md:p-12 text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-12 h-12 text-accent" />
              </div>
              <h2 className="text-3xl font-bold font-headline mb-4">Devenez Partenaire</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Associez votre image à nos valeurs de combativité et d'excellence et bénéficiez d'une visibilité unique auprès de notre communauté.
              </p>
              <Button size="lg" asChild>
                  <Link href="/contact">Nous Contacter</Link>
              </Button>
          </CardContent>
      </Card>
    </main>
  );
}
