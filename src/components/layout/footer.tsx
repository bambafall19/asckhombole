import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "../icons/social-icons";

const SocialIcon = ({ children, href }: { children: React.ReactNode, href: string }) => (
  <Button variant="ghost" size="icon" asChild>
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
      {children}
    </a>
  </Button>
);

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Logo />
            <p className="text-muted-foreground text-sm max-w-xs">
              Le site officiel de l'Association Sportive et Culturelle de Khombole, toute l'actualité du club.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Le Club</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/club" className="text-base text-muted-foreground hover:text-primary">Histoire</Link></li>
                <li><Link href="/equipe" className="text-base text-muted-foreground hover:text-primary">Équipe Pro</Link></li>
                <li><Link href="/actus" className="text-base text-muted-foreground hover:text-primary">Actualités</Link></li>
                <li><Link href="/contact" className="text-base text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Matchs</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/matchs" className="text-base text-muted-foreground hover:text-primary">Calendrier</Link></li>
                <li><Link href="/matchs" className="text-base text-muted-foreground hover:text-primary">Résultats</Link></li>
                <li><Link href="/matchs" className="text-base text-muted-foreground hover:text-primary">Classement</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Plus</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/boutique" className="text-base text-muted-foreground hover:text-primary">Boutique</Link></li>
                <li><Link href="/partenaires" className="text-base text-muted-foreground hover:text-primary">Partenaires</Link></li>
                <li><Link href="/webtv" className="text-base text-muted-foreground hover:text-primary">Web TV</Link></li>
                 <li><Link href="/galerie" className="text-base text-muted-foreground hover:text-primary">Galerie</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} ASC Khombole. Tous droits réservés.
          </p>
          <div className="flex space-x-2">
              <SocialIcon href="#"><FacebookIcon className="h-5 w-5" /></SocialIcon>
              <SocialIcon href="#"><TwitterIcon className="h-5 w-5" /></SocialIcon>
              <SocialIcon href="#"><InstagramIcon className="h-5 w-5" /></SocialIcon>
              <SocialIcon href="#"><YoutubeIcon className="h-5 w-5" /></SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
