
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  X,
  User,
  Search,
  Tv,
  Store,
  Newspaper,
  Shield,
  Trophy,
  Image as ImageIcon,
  Users,
  Handshake,
  Mail,
  Home,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ClubInfo } from "@/lib/types";
import { doc } from "firebase/firestore";
import { Input } from "../ui/input";

const navLinks = [
  { href: "/", label: "ACCUEIL", className: "mr-4" },
  { href: "/actus", label: "ACTUALITÉS", className: "mr-4" },
  { href: "/matchs", label: "MATCHS" },
  {
    label: "LE CLUB",
    children: [
      { href: "/club", label: "Histoire & Vision" },
      { href: "/equipe", label: "Équipe" },
      { href: "/partenaires", label: "Partenaires" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "MÉDIAS",
    children: [
        { href: "/galerie", label: "Galerie" },
        { href: "/webtv", label: "Web TV", disabled: true },
    ]
  },
  { href: "/boutique", label: "BOUTIQUE" },
];

const mobileMenuLinks = [
  { href: "/actus", label: "Actualités", icon: Newspaper },
  { href: "/matchs", label: "Matchs", icon: Trophy },
  { href: "/equipe", label: "Équipe", icon: Users },
  { href: "/club", label: "Club", icon: Shield },
  { href: "/galerie", label: "Galerie", icon: ImageIcon },
  { href: "/partenaires", label: "Partenaires", icon: Handshake },
];

const mobileMenuMoreLinks = [
  { href: "/boutique", label: "Boutique", icon: Store, disabled: false },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/webtv", label: "Web TV", icon: Tv, disabled: true },
];


export function Header() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, loading } = useUser();
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "clubInfo", "main");
  }, [firestore]);

  const { data: clubInfo } = useDocument<ClubInfo>(clubInfoRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const UserButton = () => {
    if (loading) {
      return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL || undefined}
                  alt={user.email || "User"}
                />
                <AvatarFallback>
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
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
      );
    }

    return null;
  };

  const NavLink = ({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary" : "text-muted-foreground",
          className
        )}
      >
        {children}
      </Link>
    );
  };
  
  const NavMenu = ({
    label,
    children,
  }: {
    label: string;
    children: { href: string; label: string; disabled?: boolean }[];
  }) => {
    const isParentActive = children.some(child => pathname.startsWith(child.href));
    return (
       <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-3",
                isParentActive ? "text-primary" : "text-muted-foreground"
            )}>
              {label} <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
             {children.map((child, index) => (
                <DropdownMenuItem key={index} asChild disabled={child.disabled}>
                  <Link href={child.href}>{child.label}</Link>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 p-2.5",
        "md:block"
      )}
    >
      <div className="container flex h-16 items-center justify-between bg-card/90 backdrop-blur-sm border rounded-xl shadow-sm relative">
        <div className="flex items-center gap-6">
            <Link href="/" className="items-center space-x-2 md:flex">
              <Logo logoUrl={clubInfo?.logoUrl} />
            </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <h1 className="font-dynapuff text-2xl font-bold text-primary">Asc_K</h1>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-2">
            {navLinks.map((link, index) =>
              link.href ? (
                <NavLink key={index} href={link.href} className={cn((link as any).className)}>
                  {link.label}
                </NavLink>
              ) : (
                <NavMenu key={index} label={link.label}>
                  {link.children!}
                </NavMenu>
              )
            )}
        </nav>

        <div className="hidden md:flex items-center justify-end gap-2">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Recherche..." className="pl-9 h-9" />
          </div>
          <div className="w-px h-6 bg-border mx-2"></div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export function MobileMenuSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "clubInfo", "main");
  }, [firestore]);
  const { data: clubInfo } = useDocument<ClubInfo>(clubInfoRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      onOpenChange(false);
    }
  };

  const MobileNavLink = ({
    href,
    label,
    Icon,
    disabled,
  }: {
    href: string;
    label: string;
    Icon: React.ElementType;
    disabled?: boolean;
  }) => {
    const pathname = usePathname();
    const isActive =
      pathname === href || (href !== "/" && pathname.startsWith(href));
    const linkClasses = cn(
      "flex items-center p-3 rounded-lg transition-colors",
      isActive
        ? "bg-accent text-accent-foreground"
        : "hover:bg-accent/50",
      disabled && "text-muted-foreground cursor-not-allowed hover:bg-transparent"
    );

    if (disabled) {
      return (
        <div className={linkClasses}>
          <Icon className="w-5 h-5 mr-3" />
          <span className="text-base font-medium">{label}</span>
        </div>
      );
    }

    return (
      <Link
        href={href}
        className={linkClasses}
        onClick={() => onOpenChange(false)}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="text-base font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[320px] bg-card p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b flex-row items-center justify-between">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <Link href="/" onClick={() => onOpenChange(false)}>
                <Logo logoUrl={clubInfo?.logoUrl} />
              </Link>
            </SheetTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="shrink-0"
          >
            <X className="h-6 w-6" />
          </Button>
        </SheetHeader>

        {user && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.photoURL || undefined}
                  alt={user.email || "User"}
                />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigation
            </p>
            {mobileMenuLinks.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.icon}
              />
            ))}
          </div>
          <DropdownMenuSeparator />
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Plus
            </p>
            {mobileMenuMoreLinks.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                Icon={link.icon}
                disabled={link.disabled}
              />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t mt-auto">
          {user ? (
            <Button className="w-full" size="lg" asChild>
              <Link href="/admin" onClick={() => onOpenChange(false)}>
                <Shield className="w-5 h-5 mr-2" /> Admin
              </Link>
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
