'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from "@/firebase";
import { Photo } from "@/lib/types";

function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <Card className="overflow-hidden group">
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          data-ai-hint={photo.imageHint || 'gallery photo'}
        />
        </div>
        <CardContent className="p-3">
            <p className="text-sm font-medium truncate">{photo.title}</p>
        </CardContent>
    </Card>
  );
}

export default function GaleriePage() {
  const firestore = useFirestore();
  const photosQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'photos'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: photos, loading } = useCollection<Photo>(photosQuery);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">GALERIE MÉDIA</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Revivez les meilleurs moments en photos et vidéos.
        </p>
      </div>
      
       {loading && (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
        </div>
      )}

      {!loading && photos && photos.length === 0 && (
        <Card>
            <CardContent className="flex flex-col items-center justify-center text-center py-20">
                <ImageIcon className="w-24 h-24 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Aucune photo dans la galerie</h3>
                <p className="text-muted-foreground mt-2">
                    Ajoutez des photos depuis le panneau d'administration.
                </p>
            </CardContent>
        </Card>
      )}
      
      {!loading && photos && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

    </main>
  );
}
