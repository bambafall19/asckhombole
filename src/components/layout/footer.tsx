import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
    {children}
  </Button>
);

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Logo />
            <p className="text-muted-foreground text-base">
              Le site officiel de l'Association Sportive et Culturelle de Khombole.
            </p>
            <div className="flex space-x-4">
              <SocialIcon>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </SocialIcon>
              <SocialIcon>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm6.406-1.182a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg>
              </SocialIcon>
              <SocialIcon>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.701V8.113l5.69 3.385-5.69 3.387z" /></svg>
              </SocialIcon>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Le Club</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/club" className="text-base text-muted-foreground hover:text-primary">Histoire</Link></li>
                  <li><Link href="/equipe" className="text-base text-muted-foreground hover:text-primary">Équipe Pro</Link></li>
                  <li><Link href="/actus" className="text-base text-muted-foreground hover:text-primary">Actualités</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Matchs</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/matchs" className="text-base text-muted-foreground hover:text-primary">Calendrier</Link></li>
                  <li><Link href="/matchs" className="text-base text-muted-foreground hover:text-primary">Résultats</Link></li>
                  <li><Link href="/matchs" className="text-base text-muted-foreground hover:text-primary">Classement</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Médias</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/galerie" className="text-base text-muted-foreground hover:text-primary">Photos</Link></li>
                  <li><Link href="/webtv" className="text-base text-muted-foreground hover:text-primary">Web TV</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Plus</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/boutique" className="text-base text-muted-foreground hover:text-primary">Boutique</Link></li>
                  <li><Link href="/partenaires" className="text-base text-muted-foreground hover:text-primary">Partenaires</Link></li>
                  <li><Link href="/contact" className="text-base text-muted-foreground hover:text-primary">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-base text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} ASC Khombole. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
