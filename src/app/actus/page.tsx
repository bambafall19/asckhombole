'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, LoaderCircle } from "lucide-react";
import { useCollection } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useMemo } from "react";
import { Article } from "@/lib/types";


function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/actus/${article.id}`}>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={400}
          height={225}
          className="object-cover w-full h-48 transition-transform group-hover:scale-105"
          data-ai-hint={article.imageHint || 'news article'}
        />
        <CardContent className="p-4">
          <span className="text-xs text-muted-foreground">{article.category}</span>
          <h3 className="text-lg font-bold mt-1 line-clamp-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{article.content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function ActusPage() {
  const firestore = getFirestore();
  const articlesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: articles, loading } = useCollection<Article>(articlesQuery);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">ACTUALITÉS DU CLUB</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Toutes les dernières informations, interviews et analyses.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
