'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Clock, LoaderCircle } from "lucide-react";
import { useCollection, useDocument, useFirestore } from "@/firebase";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  doc,
} from 'firebase/firestore';
import { useMemo, useRef } from "react";
import { Article, ClubInfo, Photo } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


export default function Home() {
  const firestore = useFirestore();
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }), []);
  
  const articlesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'), limit(7));
  }, [firestore]);

  const photosQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'photos'), orderBy('createdAt', 'desc'), limit(3));
  }, [firestore]);

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: articles, loading: articlesLoading } = useCollection<Article>(articlesQuery);
  const { data: photos, loading: photosLoading } = useCollection<Photo>(photosQuery);
  const { data: clubInfo, loading: clubInfoLoading } = useDocument<ClubInfo>(clubInfoRef);

  const mainArticle = articles?.[0];
  const sideArticles = articles?.slice(1, 4) || [];
  const trendyArticles = articles?.slice(4, 7) || [];

  const loading = articlesLoading || clubInfoLoading || photosLoading;

  const welcomeImages = useMemo(() => {
    if (!clubInfo) return [];
    const images = [];
    if (clubInfo.welcomeImageUrl) images.push({ url: clubInfo.welcomeImageUrl, hint: clubInfo.welcomeImageHint });
    if (clubInfo.welcomeImageUrl2) images.push({ url: clubInfo.welcomeImageUrl2, hint: clubInfo.welcomeImageHint2 });
    if (clubInfo.welcomeImageUrl3) images.push({ url: clubInfo.welcomeImageUrl3, hint: clubInfo.welcomeImageHint3 });
    return images;
  }, [clubInfo]);

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }

  return (
    <div className="bg-gray-100/50">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                {loading && (
                    <Card className="overflow-hidden group relative w-full aspect-video flex items-center justify-center">
                        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                    </Card>
                )}
                {!loading && mainArticle && (
                  <Card className="overflow-hidden group relative">
                    <Link href={`/actus/${mainArticle.id}`}>
                      <Image
                        src={mainArticle.imageUrl}
                        alt={mainArticle.title}
                        width={800}
                        height={450}
                        className="object-cover w-full h-full"
                        data-ai-hint={mainArticle.imageHint || 'news article'}
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <CardContent className="absolute bottom-0 left-0 p-6">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold uppercase bg-accent text-accent-foreground px-2 py-1 rounded">{mainArticle.category}</span>
                        {mainArticle.createdAt && 
                          <div className="flex items-center gap-1 text-white text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(mainArticle.createdAt.toDate())}</span>
                          </div>
                        }
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-2 font-headline">{mainArticle.title}</h2>
                    </CardContent>
                    </Link>
                  </Card>
                )}
                {!loading && !mainArticle && (
                   <Carousel 
                      className="w-full" 
                      opts={{ loop: true }}
                      plugins={[autoplayPlugin]}
                    >
                      <CarouselContent>
                        {welcomeImages.length > 0 ? welcomeImages.map((img, index) => (
                          <CarouselItem key={index}>
                            <Card className="overflow-hidden group relative w-full aspect-video">
                              <Image
                                src={img.url}
                                alt={clubInfo?.welcomeTitle || "Bienvenue à l'ASC Khombole"}
                                fill
                                className="object-cover"
                                data-ai-hint={img.hint || "soccer celebration"}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                              <CardContent className="absolute bottom-0 left-0 p-6">
                                <h2 className="text-3xl font-extrabold text-white font-headline">{clubInfo?.welcomeTitle || "Bienvenue sur le site de l'ASC Khombole"}</h2>
                                <p className="text-white/90 mt-2">{clubInfo?.welcomeSubtitle || "Toute l'actualité du club, les matchs et plus encore."}</p>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        )) : (
                          <CarouselItem>
                             <Card className="overflow-hidden group relative w-full aspect-video">
                               <Image
                                 src={"https://images.unsplash.com/photo-1544189652-b7a393a25e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzb2NjZXIlMjBjZWxlYnJhdGlvbnxlbnwwfHx8fDE3Njc3MDc5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                                 alt={clubInfo?.welcomeTitle || "Bienvenue à l'ASC Khombole"}
                                 fill
                                 className="object-cover"
                                 data-ai-hint={clubInfo?.welcomeImageHint || "soccer celebration"}
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                               <CardContent className="absolute bottom-0 left-0 p-6">
                                   <h2 className="text-3xl font-extrabold text-white font-headline">{clubInfo?.welcomeTitle || "Bienvenue sur le site de l'ASC Khombole"}</h2>
                                   <p className="text-white/90 mt-2">{clubInfo?.welcomeSubtitle || "Toute l'actualité du club, les matchs et plus encore."}</p>
                               </CardContent>
                             </Card>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      <CarouselPrevious className="left-4"/>
                      <CarouselNext className="right-4"/>
                    </Carousel>
                )}
                </div>
              </div>
            </section>

             {/* Trendy News */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline text-primary">Actualités tendances</h2>
                <Button variant="link" asChild>
                  <Link href="/actus">Voir plus <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              {loading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="h-44 flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></Card>
                  <Card className="h-44 flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></Card>
                  <Card className="h-44 flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></Card>
              </div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trendyArticles.map((article) => (
                  <Link href={`/actus/${article.id}`} key={article.id}>
                    <Card className="overflow-hidden group">
                      <Image
                          src={article.imageUrl}
                          alt={article.title}
                          width={400}
                          height={250}
                          className="object-cover w-full h-32"
                          data-ai-hint={article.imageHint || 'trendy news'}
                        />
                      <CardContent className="p-4">
                        <span className="text-xs text-muted-foreground">{article.category}</span>
                        <h3 className="text-sm font-bold mt-1 line-clamp-2">{article.title}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Photo Album */}
            {photos && photos.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline text-primary">Album Photo</h2>
                <Button variant="link" asChild>
                  <Link href="/galerie">Voir plus <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
               <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[autoplayPlugin]}
                className="w-full"
              >
                <CarouselContent>
                  {photos.map((photo) => (
                    <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                      <Link href="/galerie" className="overflow-hidden rounded-lg group block">
                          <Image
                            src={photo.imageUrl}
                            alt={photo.title}
                            width={400}
                            height={250}
                            className="object-cover w-full aspect-video transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={photo.imageHint || 'gallery photo'}
                          />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <div role="tablist" className="flex justify-between border-b mb-4">
                    <button role="tab" className="text-sm font-semibold pb-2 border-b-2 border-primary">Dernières infos</button>
                    <button role="tab" className="text-sm text-muted-foreground pb-2">Top nouvelles</button>
                </div>
                {loading && <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4 p-2 rounded-lg">
                        <div className="w-24 h-16 rounded-md bg-muted animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                </div>}
                <div className="space-y-4">
                    {sideArticles.map((item) => (
                    <Link href={`/actus/${item.id}`} key={item.id} className={`flex items-start gap-4 p-2 rounded-lg hover:bg-gray-100`}>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={100}
                          height={75}
                          className="object-cover w-24 h-16 rounded-md"
                          data-ai-hint={item.imageHint || 'news side'}
                        />
                        <div>
                            <span className="text-xs text-muted-foreground">
                              {item.category} • {item.createdAt && formatTime(item.createdAt.toDate())}
                            </span>
                            <h4 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h4>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg font-headline mb-4">À la une</h3>
                {loading && <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4 p-2 rounded-lg">
                        <div className="w-16 h-16 rounded-lg bg-muted animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                </div>}
                <div className="space-y-4">
                    {sideArticles.map((item) => (
                      <Link href={`/actus/${item.id}`} key={item.id} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg">
                        <Image 
                          src={item.imageUrl}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-lg object-cover"
                          data-ai-hint={item.imageHint || 'spotlight news'}
                        />
                        <div>
                          <span className="text-xs text-muted-foreground">{item.category} • {item.createdAt && formatTime(item.createdAt.toDate())}</span>
                          <h4 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h4>
                        </div>
                      </Link>
                    ))}
                </div>
            </div>

            <div className="bg-muted p-4 rounded-lg shadow-sm text-center">
                <h3 className="font-bold text-lg">Publicité</h3>
                <div className="bg-gray-300 h-60 w-full mt-2 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Espace pub</p>
                </div>
            </div>

          </aside>
        </main>
      </div>
    </div>
  );
}
