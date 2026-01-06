'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { doc, getFirestore } from 'firebase/firestore';
import { useDocument } from '@/firebase/firestore/use-doc';
import { Article } from '@/lib/types';
import Image from 'next/image';
import { LoaderCircle, Calendar, Tag, Quote, Goal, ListChecks } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';

// Helper function to parse simple markdown-like syntax
const renderContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
        if (line.startsWith('### ')) {
            return <h3 key={index} className="text-2xl font-bold font-headline text-primary mt-8 mb-4 flex items-center gap-2"><ListChecks className="w-6 h-6 text-accent"/> {line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-3xl font-bold font-headline text-primary mt-10 mb-6 flex items-center gap-2"><Goal className="w-7 h-7 text-accent" /> {line.substring(3)}</h2>;
        }
        if (line.startsWith('- ')) {
            // This is a simple list item, we can wrap it in a <ul> if we detect consecutive items
            return <li key={index} className="list-disc ml-6">{line.substring(2)}</li>;
        }
        if (line.startsWith('> ')) {
             return (
                <Card key={index} className="bg-muted/50 border-l-4 border-accent my-8">
                    <CardContent className="p-6">
                        <Quote className="w-8 h-8 text-accent mb-4" />
                        <blockquote className="text-lg italic text-foreground font-medium leading-relaxed">
                            {line.substring(2)}
                        </blockquote>
                    </CardContent>
                </Card>
            );
        }
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
    });
};


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
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-muted-foreground text-sm mb-4">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <Tag className="w-4 h-4" />
              <span className="font-semibold">{article.category}</span>
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
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-headline">
            {article.title}
          </h1>
        </div>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 shadow-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={article.imageHint || 'article image'}
          />
        </div>

        <div className="prose prose-lg max-w-none text-foreground text-justify">
          {renderContent(article.content)}
        </div>
      </article>
    </main>
  );
}
