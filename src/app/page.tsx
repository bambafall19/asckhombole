import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const featuredNews = {
  main: {
    id: 1,
    title: "L'ASC Khombole dévoile son nouveau maillot pour la saison à venir",
    category: "Club",
    time: "39 minutes",
    image: PlaceHolderImages.find(img => img.id === 'news-hero-main'),
  },
  side: [
    {
      id: 2,
      title: "Le coach analyse la dernière victoire en championnat",
      category: "Interview",
      time: "20 min",
      image: PlaceHolderImages.find(img => img.id === 'news-side-1'),
    },
    {
      id: 3,
      title: "Recrue surprise : un nouvel attaquant rejoint l'équipe !",
      category: "Mercato",
      time: "45 min",
      image: PlaceHolderImages.find(img => img.id === 'news-side-2'),
      highlight: true,
    },
    {
      id: 4,
      title: "Résumé du match : une victoire écrasante à domicile",
      category: "Match",
      time: "1 hr",
      image: PlaceHolderImages.find(img => img.id === 'news-side-3'),
    }
  ]
};

const trendyNews = [
  {
    id: 1,
    title: "Le jeune prodige du centre de formation signe son premier contrat pro",
    category: "Formation",
    image: PlaceHolderImages.find(img => img.id === 'news-trendy-1'),
  },
  {
    id: 2,
    title: "Les supporters préparent un tifo géant pour le prochain derby",
    category: "Supporters",
    image: PlaceHolderImages.find(img => img.id === 'news-trendy-2'),
  },
  {
    id: 3,
    title: "Le capitaine optimiste avant le match crucial de ce week-end",
    category: "Interview",
    image: PlaceHolderImages.find(img => img.id === 'news-trendy-3'),
  },
];

const photoAlbum = [
  {
    id: 1,
    image: PlaceHolderImages.find(img => img.id === 'album-1'),
  },
  {
    id: 2,
    image: PlaceHolderImages.find(img => img.id === 'album-2'),
  },
  {
    id: 3,
    image: PlaceHolderImages.find(img => img.id === 'album-3'),
  },
]

const liveMatches = [
  {
    id: 1,
    sport: "Football",
    league: "Ligue 1 • 78m",
    teams: [
      { name: "ASC Khombole", score: "2" },
      { name: "ASC Jaraaf", score: "1" }
    ],
    logos: ["/icons/teams/fcb.svg", "/icons/teams/rma.svg"]
  },
  {
    id: 2,
    sport: "Football",
    league: "Coupe du Sénégal • Mi-temps",
    teams: [
      { name: "ASC Khombole", score: "1" },
      { name: "Génération Foot", score: "0" }
    ],
    logos: ["/icons/teams/fcb.svg", "/icons/teams/rma.svg"]
  },
];

const todaysSpotlight = [
  {
    id: 1,
    title: "Focus sur le parcours de notre gardien, le mur infranchissable",
    category: "Portrait",
    time: "3 jours",
    image: PlaceHolderImages.find(img => img.id === 'spotlight-1')
  },
  {
    id: 2,
    title: "Les infrastructures du club se modernisent avec un nouveau terrain",
    category: "Club",
    time: "4 jours",
    image: PlaceHolderImages.find(img => img.id === 'spotlight-2')
  },
  {
    id: 3,
    title: "L'équipe U17 remporte le tournoi régional",
    category: "Jeunes",
    time: "6 jours",
    image: PlaceHolderImages.find(img => img.id === 'spotlight-3')
  }
];

export default function Home() {

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
                  <Card className="overflow-hidden group relative">
                    {featuredNews.main.image && (
                      <Image
                        src={featuredNews.main.image.imageUrl}
                        alt={featuredNews.main.image.description}
                        width={800}
                        height={450}
                        className="object-cover w-full h-full"
                        data-ai-hint={featuredNews.main.image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <CardContent className="absolute bottom-0 left-0 p-6">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold uppercase bg-accent text-accent-foreground px-2 py-1 rounded">{featuredNews.main.category}</span>
                        <div className="flex items-center gap-1 text-white text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{featuredNews.main.time}</span>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-2 font-headline">{featuredNews.main.title}</h2>
                    </CardContent>
                  </Card>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {trendyNews.map((article) => (
                  <Card key={article.id} className="overflow-hidden group">
                     {article.image && (
                      <Image
                        src={article.image.imageUrl}
                        alt={article.image.description}
                        width={400}
                        height={250}
                        className="object-cover w-full h-32"
                        data-ai-hint={article.image.imageHint}
                      />
                    )}
                    <CardContent className="p-4">
                      <span className="text-xs text-muted-foreground">{article.category}</span>
                      <h3 className="text-sm font-bold mt-1 line-clamp-2">{article.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Photo Album */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline text-primary">Album Photo</h2>
                <Button variant="link" asChild>
                  <Link href="/galerie">Voir plus <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photoAlbum.map((photo) => (
                  <Link key={photo.id} href="/galerie" className="overflow-hidden rounded-lg group">
                     {photo.image && (
                      <Image
                        src={photo.image.imageUrl}
                        alt={photo.image.description}
                        width={400}
                        height={250}
                        className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={photo.image.imageHint}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <div role="tablist" className="flex justify-between border-b mb-4">
                    <button role="tab" className="text-sm font-semibold pb-2 border-b-2 border-primary">Dernières infos</button>
                    <button role="tab" className="text-sm text-muted-foreground pb-2">Top nouvelles</button>
                </div>
                <div className="space-y-4">
                    {featuredNews.side.map((item) => (
                    <Link href="/actus" key={item.id} className={`flex items-start gap-4 p-2 rounded-lg ${item.highlight ? 'bg-accent/20' : 'hover:bg-gray-100'}`}>
                        {item.image && (
                           <Image
                            src={item.image.imageUrl}
                            alt={item.image.description}
                            width={100}
                            height={75}
                            className="object-cover w-24 h-16 rounded-md"
                            data-ai-hint={item.image.imageHint}
                          />
                        )}
                        <div>
                            <span className="text-xs text-muted-foreground">{item.category} • {item.time}</span>
                            <h4 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h4>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h3 className="font-bold text-lg font-headline">Matchs en direct</h3>
              </div>
              <div className="space-y-4">
                {liveMatches.map((match) => (
                  <div key={match.id} className="text-sm border-t pt-4">
                    <p className="font-semibold text-muted-foreground">{match.sport} - {match.league}</p>
                    <div className="space-y-2 mt-2">
                      {match.teams.map((team, index) => (
                        <div key={team.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Avatar className="w-5 h-5">
                              <AvatarImage src={match.logos?.[index]} />
                              <AvatarFallback>{team.name.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <span>{team.name}</span>
                          </div>
                          <span className="font-bold">{team.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg font-headline mb-4">À la une</h3>
              <div className="space-y-4">
                {todaysSpotlight.map((item) => (
                  <Link href="/actus" key={item.id} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg">
                    {item.image && (
                      <Image 
                        src={item.image.imageUrl}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover"
                        data-ai-hint={item.image.imageHint}
                      />
                    )}
                    <div>
                      <span className="text-xs text-muted-foreground">{item.category} • {item.time}</span>
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
