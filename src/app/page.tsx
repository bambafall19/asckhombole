

'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Clock, LoaderCircle, Calendar, Trophy, Handshake, BookOpen, User } from "lucide-react";
import { useCollection, useDocument, useFirestore } from "@/firebase";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  doc,
  where,
  Timestamp,
} from 'firebase/firestore';
import { useMemo, useState } from "react";
import { Article, ClubInfo, Photo, Match, Partner } from "@/lib/types";
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { NextMatchSidebar } from "@/components/next-match-sidebar";

function LastResultCard({ match }: { match: Match }) {
  const isHomeTeam = (team: string) => team.toLowerCase().includes('khombole');
  
  const getTeamClasses = (team: string, isWinner: boolean) => {
    return cn(
      "font-bold text-lg",
      isHomeTeam(team) && "text-primary",
      !isWinner && "text-muted-foreground/80"
    );
  };
  
  const homeWinner = match.homeScore! > match.awayScore!;
  const awayWinner = match.awayScore! > match.homeScore!;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="font-semibold">{match.competition}</span>
            <span>{format(match.date.toDate(), 'PPP', { locale: fr })}</span>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.homeTeamLogoUrl && <Image src={match.homeTeamLogoUrl} alt={match.homeTeam} width={40} height={40} className="object-contain" />}
                <p className={getTeamClasses(match.homeTeam, homeWinner)}>{match.homeTeam}</p>
            </div>
          <div className="flex items-center gap-4 font-bold text-2xl">
            <span className={cn(homeWinner && 'text-primary')}>{match.homeScore}</span>
            <span className="text-muted-foreground text-xl">-</span>
            <span className={cn(awayWinner && 'text-primary')}>{match.awayScore}</span>
          </div>
           <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                {match.awayTeamLogoUrl && <Image src={match.awayTeamLogoUrl} alt={match.awayTeam} width={40} height={40} className="object-contain" />}
                <p className={getTeamClasses(match.awayTeam, awayWinner)}>{match.awayTeam}</p>
            </div>
        </div>
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
    return query(collection(firestore, 'articles'), where('tags', 'array-contains', 'featured'), limit(1));
  }, [firestore]);
  
  const trendyQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), where('tags', 'array-contains', 'trendy'), limit(3));
  }, [firestore]);

  const latestQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'), limit(4));
  }, [firestore]);

  const topQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'articles'), where('tags', 'array-contains', 'top'), limit(4));
  }, [firestore]);

  const photosQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'photos'), orderBy('createdAt', 'desc'), limit(3));
  }, [firestore]);
  
  const partnersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'partners'), orderBy('name', 'asc'));
  }, [firestore]);

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const nextMatchQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'matches'),
      where('status', '==', 'À venir')
    );
  }, [firestore]);

  const lastResultQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'matches'), 
        where('status', '==', 'Terminé')
    );
  }, [firestore]);

  const { data: featuredArticlesData, loading: featuredLoading } = useCollection<Article>(featuredQuery);
  const { data: trendyArticlesData, loading: trendyLoading } = useCollection<Article>(trendyQuery);
  const { data: latestArticles, loading: latestLoading } = useCollection<Article>(latestQuery);
  const { data: topArticlesData, loading: topLoading } = useCollection<Article>(topQuery);
  const { data: photos, loading: photosLoading } = useCollection<Photo>(photosQuery);
  const { data: partners, loading: partnersLoading } = useCollection<Partner>(partnersQuery);
  const { data: clubInfo, loading: clubInfoLoading } = useDocument<ClubInfo>(clubInfoRef);
  const { data: allUpcomingMatches, loading: nextMatchLoading } = useCollection<Match>(nextMatchQuery);
  const { data: allFinishedMatches, loading: lastResultLoading } = useCollection<Match>(lastResultQuery);
  
  const featuredArticles = useMemo(() => {
    if (!featuredArticlesData) return [];
    return [...featuredArticlesData].sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis())
  }, [featuredArticlesData]);

  const trendyArticles = useMemo(() => {
    if (!trendyArticlesData) return [];
    return [...trendyArticlesData].sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis())
  }, [trendyArticlesData]);

  const topArticles = useMemo(() => {
    if (!topArticlesData) return [];
    return [...topArticlesData].sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis())
  }, [topArticlesData]);
  
  const nextMatch = useMemo(() => {
    if (!allUpcomingMatches) return null;
    const now = new Date();
    const sortedUpcoming = [...allUpcomingMatches]
      .filter(match => match.date.toDate() > now)
      .sort((a, b) => a.date.toMillis() - b.date.toMillis());
    return sortedUpcoming[0] || null;
  }, [allUpcomingMatches]);

  const lastResult = useMemo(() => {
    if (!allFinishedMatches) return null;
    const sorted = [...allFinishedMatches].sort((a,b) => b.date.toMillis() - a.date.toMillis());
    return sorted[0] || null;
  }, [allFinishedMatches]);

  const mainArticle = featuredArticles?.[0] || latestArticles?.[0];
  const sideArticles = sidebarTab === 'latest' ? latestArticles?.slice(1,4) : topArticles;
  
  const mainSectionLoading = featuredLoading || latestLoading || clubInfoLoading;

  const welcomeImages = useMemo(() => {
    if (!clubInfo) return [];
    const images = [];
    if (clubInfo.welcomeImageUrl) images.push({ url: clubInfo.welcomeImageUrl });
    if (clubInfo.welcomeImageUrl2) images.push({ url: clubInfo.welcomeImageUrl2 });
    if (clubInfo.welcomeImageUrl3) images.push({ url: clubInfo.welcomeImageUrl3 });
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
            
            {/* Last Result */}
            {lastResult && (
              <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-headline text-primary">Dernier résultat</h2>
                    <Button variant="link" asChild>
                    <Link href="/matchs">Voir plus <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
                {lastResultLoading && (
                  <Card className="h-40 flex items-center justify-center">
                    <LoaderCircle className="w-8 h-8 animate-spin text-primary"/>
                  </Card>
                )}
                {!lastResultLoading && <LastResultCard match={lastResult} />}
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
            <NextMatchSidebar match={nextMatch} loading={nextMatchLoading} />
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

            {/* Club Info Section in Sidebar */}
            {!clubInfoLoading && clubInfo && (
              <>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-lg">
                      <BookOpen className="w-5 h-5 text-accent" />
                      Notre Histoire
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div className="flex items-start gap-4">
                      {clubInfo.logoUrl && (
                        <div className="relative w-12 h-12 shrink-0">
                           <Image
                            src={clubInfo.logoUrl}
                            alt="Logo du club"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className="text-muted-foreground text-xs line-clamp-3">
                        {clubInfo.history}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/club">Découvrir le club</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-lg">
                      <User className="w-5 h-5 text-accent" />
                      Mot du Président
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-4">
                      {clubInfo.presidentWordImageUrl && (
                        <div className="relative w-16 h-16 shrink-0">
                           <Image
                            src={clubInfo.presidentWordImageUrl}
                            alt="Mot du président"
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <blockquote className="text-muted-foreground text-xs line-clamp-3 border-l-2 border-accent pl-3 italic">
                        {clubInfo.presidentWord}
                      </blockquote>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/club">Lire la suite</Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
            
            <div className="bg-muted p-4 rounded-lg shadow-sm text-center">
                <h3 className="font-bold text-lg">Publicité</h3>
                <div className="bg-gray-300 h-60 w-full mt-2 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Espace pub</p>
                </div>
            </div>

          </aside>
        </main>
        
        {/* Partners Section */}
        {partners && partners.length > 0 && (
        <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline text-primary flex items-center gap-2">
                  <Handshake />
                  Nos Partenaires
                </h2>
                <Button variant="link" asChild>
                <Link href="/partenaires">Voir tous <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
              className="w-full"
            >
              <CarouselContent>
                {partners.map((partner) => (
                  <CarouselItem key={partner.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                     <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block p-4">
                        <div className="flex justify-center items-center h-20 bg-card rounded-lg p-2 shadow-sm transition-transform duration-300 hover:scale-105">
                           <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            width={120}
                            height={60}
                            className="object-contain"
                          />
                        </div>
                      </a>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        </section>
        )}
      </div>
    </div>
  );
}
