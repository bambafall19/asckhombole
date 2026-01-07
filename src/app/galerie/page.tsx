'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from "@/firebase";
import { Photo } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PhotoCard({ photo, onClick }: { photo: Photo, onClick: () => void }) {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" onClick={onClick}>
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
        <Image
          src={photo.imageUrl}
          alt={photo.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          data-ai-hint={photo.imageHint || 'gallery photo'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        </div>
        <CardContent className="p-3">
            <p className="text-sm font-medium truncate">{photo.title}</p>
        </CardContent>
    </Card>
  );
}

function PhotoCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
    )
}

export default function GaleriePage() {
  const firestore = useFirestore();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const photosQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'photos'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: photos, loading } = useCollection<Photo>(photosQuery);

  const selectedPhoto = selectedPhotoIndex !== null ? photos?.[selectedPhotoIndex] : null;

  const handleNext = () => {
    if (selectedPhotoIndex !== null && photos && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedPhotoIndex === null) return;
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, photos]);


  return (
    <>
      <main className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">GALERIE MÉDIA</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Revivez les meilleurs moments en photos et vidéos.
          </p>
        </div>
        
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <PhotoCardSkeleton key={i} />)}
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
            {photos.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} onClick={() => setSelectedPhotoIndex(index)} />
            ))}
          </div>
        )}

      </main>

      <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0 flex items-center justify-center">
            {selectedPhoto ? (
                <div className="relative w-full h-full">
                    <Image
                      src={selectedPhoto.imageUrl}
                      alt={selectedPhoto.title}
                      width={1600}
                      height={900}
                      className="object-contain w-full h-auto max-h-[90vh] rounded-lg"
                    />

                    {selectedPhotoIndex !== null && selectedPhotoIndex > 0 && (
                      <Button variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/80 text-white" onClick={handlePrev}>
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    )}

                    {selectedPhotoIndex !== null && photos && selectedPhotoIndex < photos.length - 1 && (
                      <Button variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/80 text-white" onClick={handleNext}>
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    )}
                </div>
            ) : (
                <LoaderCircle className="w-12 h-12 animate-spin text-white" />
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
