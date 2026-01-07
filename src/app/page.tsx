'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Clock, LoaderCircle, Calendar, Trophy } from "lucide-react";
import { useCollection, useDocument, useFirestore } from "@/firebase";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  doc,
  where,
} from 'firebase/firestore';
import { useMemo, useState } from "react";
import { Article, ClubInfo, Photo, Match } from "@/lib/types";
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


function NextMatchSidebar({ match }: { match: Match }) {
  const isHomeTeam = (team: string) => team.toLowerCase().includes('khombole');

  return (
    <Card className="bg-primary/5 border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-headline text-primary flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5"/>
            Prochain Match
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{match.competition}</p>
        <p className="text-sm font-semibold text-muted-foreground">{format(match.date.toDate(), 'eeee d MMMM yyyy \'à\' HH:mm', { locale: fr })}</p>
        <div className="flex items-center justify-around my-4">
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.homeTeamLogoUrl && <Image src={match.homeTeamLogoUrl} alt={match.homeTeam} width={48} height={48} className="object-contain" />}
                <p className={cn("font-bold", isHomeTeam(match.homeTeam) && "text-primary")}>{match.homeTeam}</p>
            </div>
            <span className="text-muted-foreground font-bold text-xl">VS</span>
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.awayTeamLogoUrl && <Image src={match.awayTeamLogoUrl} alt={match.awayTeam} width={48} height={48} className="object-contain" />}
                <p className={cn("font-bold", isHomeTeam(match.awayTeam) && "text-primary")}>{match.awayTeam}</p>
            </div>
        </div>
         <Button asChild size="sm">
            <Link href="/matchs">Voir les matchs</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function NextMatchSidebarSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent className="text-center space-y-2">
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <div className="flex items-center justify-around my-4">
                    <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                     <span className="text-muted-foreground font-bold text-xl">VS</span>
                     <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
                 <Skeleton className="h-9 w-28 mx-auto" />
            </CardContent>
        </Card>
    );
}

export default function Home() {
  const firestore = useFirestore();
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true }), []);
  const [sidebarTab, setSidebarTab] = useState<'latest' | 'top'>('latest');

  // Queries for different article sections
  const featuredQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), where('tags', 'array-contains', 'featured'), orderBy('createdAt', 'desc'), limit(1));
  }, [firestore]);
  
  const trendyQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), where('tags', 'array-contains', 'trendy'), orderBy('createdAt', 'desc'), limit(3));
  }, [firestore]);

  const latestQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'), limit(4));
  }, [firestore]);

  const topQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), where('tags', 'array-contains', 'top'), orderBy('createdAt', 'desc'), limit(4));
  }, [firestore]);

  const photosQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'photos'), orderBy('createdAt', 'desc'), limit(3));
  }, [firestore]);
  
  const nextMatchQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'matches'), where('status', '==', 'À venir'), orderBy('date', 'asc'), limit(1));
  }, [firestore]);

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: featuredArticles, loading: featuredLoading } = useCollection<Article>(featuredQuery);
  const { data: trendyArticles, loading: trendyLoading } = useCollection<Article>(trendyQuery);
  const { data: latestArticles, loading: latestLoading } = useCollection<Article>(latestQuery);
  const { data: topArticles, loading: topLoading } = useCollection<Article>(topQuery);
  const { data: photos, loading: photosLoading } = useCollection<Photo>(photosQuery);
  const { data: clubInfo, loading: clubInfoLoading } = useDocument<ClubInfo>(clubInfoRef);
  const { data: nextMatches, loading: nextMatchLoading } = useCollection<Match>(nextMatchQuery);

  const mainArticle = featuredArticles?.[0] || latestArticles?.[0];
  const sideArticles = sidebarTab === 'latest' ? latestArticles?.slice(1,4) : topArticles;
  const nextMatch = nextMatches?.[0];
  
  const mainSectionLoading = featuredLoading || latestLoading || clubInfoLoading;

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
                {mainSectionLoading && (
                    <Card className="overflow-hidden group relative w-full aspect-video flex items-center justify-center">
                        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                    </Card>
                )}
                {!mainSectionLoading && mainArticle && (
                  <Card className="overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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
                {!mainSectionLoading && !mainArticle && (
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
                    </Carousel>
                )}
                </div>
              </div>
            </section>

             {/* Trendy News */}
             {trendyArticles && trendyArticles.length > 0 && (
                <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-headline text-primary">Actualités tendances</h2>
                    <Button variant="link" asChild>
                    <Link href="/actus">Voir plus <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
                {trendyLoading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="h-44 flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></Card>
                    <Card className="h-44 flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></Card>
                    <Card className="h-44 flex items-center justify-center"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></Card>
                </div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {trendyArticles.map((article) => (
                    <Link href={`/actus/${article.id}`} key={article.id}>
                        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
             )}


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
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
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
              </Carousel>
            </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
             {nextMatchLoading && <NextMatchSidebarSkeleton />}
             {!nextMatchLoading && nextMatch && <NextMatchSidebar match={nextMatch} />}

            <div className="bg-card p-4 rounded-lg shadow-sm">
                <div role="tablist" className="flex justify-between border-b mb-4">
                    <button role="tab" aria-selected={sidebarTab === 'latest'} onClick={() => setSidebarTab('latest')} className={`text-sm font-semibold pb-2 border-b-2 ${sidebarTab === 'latest' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Dernières infos</button>
                    <button role="tab" aria-selected={sidebarTab === 'top'} onClick={() => setSidebarTab('top')} className={`text-sm font-semibold pb-2 border-b-2 ${sidebarTab === 'top' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Top nouvelles</button>
                </div>
                {(latestLoading || topLoading) && <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4 p-2 rounded-lg">
                        <Skeleton className="w-24 h-16 rounded-md" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    ))}
                </div>}
                <div className="space-y-4">
                    {sideArticles && sideArticles.map((item) => (
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
            
            {/* Spotlight section has been removed as it was redundant with the main news feed. The new match component is a better use of space. */}

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
