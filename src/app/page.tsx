import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper, Users } from "lucide-react";
import { SoccerBallIcon } from "@/components/icons/soccer-ball-icon";
import { Logo } from "@/components/logo";

const newsArticles = [
  {
    id: 1,
    title: "Victoire importante à domicile",
    category: "Match",
    image: PlaceHolderImages.find(img => img.id === 'news-1'),
  },
  {
    id: 2,
    title: "Nouveau partenariat annoncé",
    category: "Club",
    image: PlaceHolderImages.find(img => img.id === 'news-2'),
  },
  {
    id: 3,
    title: "Journée de détection jeunes talents",
    category: "Formation",
    image: PlaceHolderImages.find(img => img.id === 'news-3'),
  },
  {
    id: 4,
    title: "Préparation pour le prochain derby",
    category: "Entraînement",
    image: PlaceHolderImages.find(img => img.id === 'news-4'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[70vh] md:h-[90vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full text-center text-primary-foreground pb-12 md:pb-20 px-4">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline uppercase">
            Ensemble, vers la victoire
          </h1>
          <p className="max-w-[700px] mt-4 text-lg md:text-xl text-gray-200">
            Suivez toute l'actualité de votre club de cœur.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/matchs">
                Prochain Match <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/boutique">
                Visiter la Boutique
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-20 lg:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Dernières Actualités</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Restez informés des dernières nouvelles du club, des résultats des matchs et des événements à venir.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {newsArticles.map((article) => (
                  <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden group h-full flex flex-col">
                        <CardHeader className="p-0">
                          {article.image && (
                            <Image
                              src={article.image.imageUrl}
                              alt={article.image.description}
                              width={600}
                              height={400}
                              className="object-cover w-full h-48 transition-transform duration-300 ease-in-out group-hover:scale-105"
                              data-ai-hint={article.image.imageHint}
                            />
                          )}
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                          <span className="text-xs font-semibold uppercase text-accent">{article.category}</span>
                          <h3 className="text-lg font-bold mt-2 font-headline">{article.title}</h3>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button asChild variant="link" className="p-0 h-auto text-primary">
                            <Link href="/actus">
                              Lire la suite <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
              <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 hidden sm:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-20 lg:py-24 bg-primary/5">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-primary">Prochain Match</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ne manquez pas le prochain rendez-vous de nos guerriers sur le terrain.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-4xl mt-8">
            <Card className="shadow-2xl">
              <CardContent className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Logo width={80} height={80} />
                  <span className="font-bold text-lg">ASC Khombole</span>
                </div>
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">Ligue Régionale 1</span>
                  <div className="font-extrabold text-4xl md:text-6xl my-2">VS</div>
                  <span className="font-semibold text-lg">Dimanche, 16:00</span>
                  <p className="text-muted-foreground">Stade Municipal de Khombole</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <span className="font-bold text-lg">Adversaire FC</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline text-primary">Nos Partenaires</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
            Ils nous soutiennent dans notre quête de succès.
          </p>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
            {['Sponsor 1', 'Sponsor 2', 'Sponsor 3', 'Sponsor 4', 'Sponsor 5'].map((sponsor, index) => (
              <div key={index} className="flex justify-center">
                <span className="text-2xl font-semibold text-muted-foreground grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">{sponsor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
