'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useDocument, useFirestore } from '@/firebase';
import { Article } from '@/lib/types';
import Image from 'next/image';
import { Calendar, Tag, Quote, Goal, ListChecks } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

// Helper function to parse simple markdown-like syntax
const renderContent = (content: string) => {
    if (!content) return null;
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

function ArticlePageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded-md" />
                </div>
                <Skeleton className="h-10 md:h-14 w-3/4 mx-auto rounded-md" />
            </div>
             <Skeleton className="relative w-full aspect-video rounded-lg mb-12" />
             <div className="space-y-4">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-2/3 rounded-md" />
                <br/>
                <Skeleton className="h-20 w-full rounded-md" />
                <br/>
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
             </div>
        </div>
    )
}


export default function ArticlePage({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { id } = use(params);
  if (searchParams) {
    use(searchParams);
  }
  const firestore = useFirestore();

  const articleRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'articles', id);
  }, [firestore, id]);

  const { data: article, loading } = useDocument<Article>(articleRef);

  if (loading) {
    return (
      <main className="container mx-auto py-12 px-4 md:px-6">
          <ArticlePageSkeleton />
      </main>
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
      <article className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="mb-8 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
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

        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 shadow-lg animate-in fade-in-0 zoom-in-95 duration-500 bg-muted/20">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-contain"
          />
        </div>

        <div className="prose prose-lg max-w-none text-foreground text-justify animate-in fade-in-0 slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
          {renderContent(article.content)}
        </div>
      </article>
    </main>
  );
}
