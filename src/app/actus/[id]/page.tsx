'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { doc, getFirestore } from 'firebase/firestore';
import { useDocument } from '@/firebase/firestore/use-doc'; // This will need to be created
import { Article } from '@/lib/types';
import Image from 'next/image';
import { LoaderCircle, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ArticlePage() {
  const params = useParams();
  const { id } = params;
  const firestore = getFirestore();

  const articleRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'articles', id as string);
  }, [firestore, id]);

  const { data: article, loading } = useDocument<Article>(articleRef);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Article non trouvé</h2>
        <p className="text-muted-foreground mt-2">
          Cet article n'existe pas ou a été supprimé.
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
      <article>
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-headline mb-4">
            {article.title}
          </h1>
          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>{article.category}</span>
            </div>
            {article.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(article.createdAt.toDate(), 'PPP', { locale: fr })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
          <Image
            src={article.imageUrl}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={article.imageHint || 'article image'}
          />
        </div>

        <div className="prose prose-lg max-w-none text-foreground text-justify">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}