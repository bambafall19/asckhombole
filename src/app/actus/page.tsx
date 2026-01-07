'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, LoaderCircle, Calendar } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  query,
  orderBy,
} from 'firebase/firestore';
import { useMemo } from "react";
import { Article } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function FeaturedArticleCard({ article }: { article: Article }) {
    const excerpt = article.content.split('\n').find(line => !line.startsWith('#') && line.trim() !== '')?.substring(0, 150) + '...';

    return (
        <Card className="overflow-hidden group transition-all duration-300 shadow-lg border-primary/20">
            <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                     <div className="relative w-full aspect-video md:aspect-auto">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            data-ai-hint={article.imageHint || 'featured news'}
                        />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                        <span className="text-sm text-primary font-semibold mb-1">{article.category}</span>
                        <h2 className="text-2xl lg:text-3xl font-bold font-headline line-clamp-3 mb-2">
                           <Link href={`/actus/${article.id}`} className="hover:underline">{article.title}</Link>
                        </h2>
                        {article.createdAt && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                <Calendar className="w-4 h-4" />
                                <span>{format(article.createdAt.toDate(), 'PPP', { locale: fr })}</span>
                            </div>
                        )}
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{excerpt}</p>
                        <Button asChild className="self-start">
                            <Link href={`/actus/${article.id}`}>Lire la suite</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function FeaturedArticleSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                    <Skeleton className="w-full aspect-video md:h-full md:min-h-[400px]" />
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                         <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-10 w-32 mt-2" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/actus/${article.id}`}>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint={article.imageHint || 'news article'}
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <span className="text-xs text-muted-foreground">{article.category}</span>
          <h3 className="text-lg font-bold mt-1 line-clamp-2 flex-grow">{article.title}</h3>
           {article.createdAt && (
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{format(article.createdAt.toDate(), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
            )}
        </CardContent>
      </Card>
    </Link>
  );
}

function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full aspect-[16/9]" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardContent>
    </Card>
  );
}


export default function ActusPage() {
  const firestore = useFirestore();
  const articlesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: articles, loading } = useCollection<Article>(articlesQuery);

  const featuredArticle = useMemo(() => articles?.[0], [articles]);
  const otherArticles = useMemo(() => articles?.slice(1), [articles]);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">ACTUALITÉS DU CLUB</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Toutes les dernières informations, interviews et analyses.
        </p>
      </div>

      {loading && (
        <div className="space-y-12">
            <FeaturedArticleSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <ArticleCardSkeleton key={i} />)}
            </div>
        </div>
      )}

      {!loading && articles && articles.length === 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Fil d'actualité</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-20">
            <Newspaper className="w-24 h-24 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Aucune actualité</h3>
            <p className="text-muted-foreground mt-2">
              Revenez bientôt ou ajoutez des articles dans la console Firebase.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && articles && articles.length > 0 && (
        <div className="space-y-12">
            {featuredArticle && <FeaturedArticleCard article={featuredArticle} />}
            
            {otherArticles && otherArticles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
      )}
    </main>
  );
}
