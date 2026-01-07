
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, X, User, Search, Tv, Store, Newspaper, Shield, Trophy, Image as ImageIcon, Users, Handshake, Mail, Home, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useUser } from "@/firebase/auth/use-user";
import { signOut } from "firebase/auth";
import { useAuth, useDocument, useFirestore } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ClubInfo } from "@/lib/types";
import { doc } from "firebase/firestore";


const navLinks = [
  { href: "/club", label: "CLUB", icon: Shield },
  { href: "/equipe", label: "ÉQUIPE", icon: Users },
  { href: "/matchs", label: "MATCHS", icon: Trophy },
  { href: "/actus", label: "ACTUS", icon: Newspaper },
  { href: "/galerie", label: "GALERIE", icon: ImageIcon },
  { href: "/partenaires", label: "PARTENAIRES", icon: Handshake },
  { href: "/boutique", label: "BOUTIQUE", icon: Store, disabled: true },
  { href: "/contact", label: "CONTACT", icon: Mail },
  { href: "/webtv", label: "WEB TV", icon: Tv, disabled: true },
];


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();
  const { user, loading } = useUser();
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: clubInfo } = useDocument<ClubInfo>(clubInfoRef);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const NavLink = ({ href, label, className, disabled }: { href: string; label: string; className?: string, disabled?: boolean }) => {
    const isActive = (pathname === href) || (href !== '/' && pathname.startsWith(href));
    const linkClasses = cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary font-semibold" : "text-foreground/80",
        disabled && "text-muted-foreground cursor-not-allowed hover:text-muted-foreground",
        className
    );

    if (disabled) {
        return <span className={linkClasses}>{label.toUpperCase()}</span>
    }

    return (
      <Link
        href={href}
        className={linkClasses}
      >
        {label.toUpperCase()}
      </Link>
    );
  };
  
  const UserButton = () => {
    if (loading) {
      return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.email || 'User'} />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Mon Compte</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
               <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b",
        isScrolled ? "bg-card/95 backdrop-blur-sm" : "bg-card",
        "hidden md:block"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo logoUrl={clubInfo?.logoUrl} />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/" label="ACCUEIL" />
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-px h-6 bg-border mx-2"></div>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export function MobileMenuSheet({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);
  const { data: clubInfo } = useDocument<ClubInfo>(clubInfoRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      onOpenChange(false);
    }
  };

  const MobileNavLink = ({ href, label, Icon, disabled }: { href: string; label: string, Icon: React.ElementType, disabled?: boolean }) => {
    const pathname = usePathname();
    const isActive = (pathname === href) || (href !== '/' && pathname.startsWith(href));
    const linkClasses = cn(
        "flex items-center p-3 rounded-lg transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
        disabled && "text-muted-foreground cursor-not-allowed hover:bg-transparent"
      );

    if (disabled) {
        return (
            <div className={linkClasses}>
                <Icon className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">{label.toUpperCase()}</span>
            </div>
        )
    }

    return (
        <Link
          href={href}
          className={linkClasses}
          onClick={() => onOpenChange(false)}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span className="text-base font-medium">{label.toUpperCase()}</span>
        </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[320px] bg-card p-0">
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
           <SheetTitle>
             <Link href="/" onClick={() => onOpenChange(false)}>
                <Logo logoUrl={clubInfo?.logoUrl} />
              </Link>
           </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-6 w-6" />
            </Button>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100%-5rem)]">
          <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
            {navLinks.filter(l => !['/actus', '/matchs', '/equipe'].includes(l.href)).map((link) => (
                <MobileNavLink key={link.href} href={link.href} label={link.label} Icon={link.icon} disabled={link.disabled} />
            ))}
          </nav>
          <div className="p-4 border-t">
            {user ? (
               <div className="space-y-2">
                 <Button className="w-full" size="lg" asChild>
                    <Link href="/admin" onClick={() => onOpenChange(false)}>
                        <Shield className="w-5 h-5 mr-2" /> Admin
                    </Link>
                 </Button>
                 <Button variant="outline" className="w-full" size="lg" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-2" /> Déconnexion
                 </Button>
               </div>
            ) : (
              <Button className="w-full" size="lg" asChild>
                <Link href="/login" onClick={() => onOpenChange(false)}>
                  <LogIn className="w-5 h-5 mr-2" /> Espace Membre
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
