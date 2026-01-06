"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User, Search, Tv, Store, Newspaper, Shield, Trophy, Image as ImageIcon, Users, Handshake, Mail, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const mainNavLinks = [
  { href: "/club", label: "Club", icon: Shield },
  { href: "/equipe", label: "Équipe", icon: Users },
  { href: "/matchs", label: "Matchs", icon: Trophy },
  { href: "/actus", label: "Actus", icon: Newspaper },
  { href: "/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/partenaires", label: "Partenaires", icon: Handshake },
];

const secondaryNavLinks = [
  { href: "/boutique", label: "Boutique", icon: Store },
  { href: "/webtv", label: "Web TV", icon: Tv },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ href, label, className }: { href: string; label: string; className?: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-foreground/80",
          className
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };
  
  const MobileNavLink = ({ href, label, Icon }: { href: string; label: string, Icon: React.ElementType }) => {
    const isActive = pathname === href;
    return (
        <Link
          href={href}
          className={cn(
            "flex items-center p-3 rounded-lg transition-colors",
            isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span className="text-base font-medium">{label}</span>
        </Link>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled ? "bg-card/95 backdrop-blur-sm" : "bg-card"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/" label="Accueil" />
          {mainNavLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {secondaryNavLinks.map((link) => (
             <NavLink key={link.href} {...link} className="text-foreground/60"/>
          ))}
          <div className="w-px h-6 bg-border mx-2"></div>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[320px] bg-card p-0">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo />
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    <MobileNavLink href="/" label="Accueil" Icon={Home} />
                    {[...mainNavLinks, ...secondaryNavLinks].map((link) => (
                        <MobileNavLink key={link.href} href={link.href} label={link.label} Icon={link.icon} />
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button className="w-full" size="lg">
                        <User className="w-5 h-5 mr-2" /> Espace Membre
                    </Button>
                </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}