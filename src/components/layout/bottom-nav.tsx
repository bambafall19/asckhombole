
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Trophy, Users, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { MobileMenuSheet } from './header';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/actus', label: 'Actus', icon: Newspaper },
  { href: '/matchs', label: 'Matchs', icon: Trophy },
  { href: '/equipe', label: 'Équipe', icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavItem = ({ href, label, icon: Icon }: (typeof navItems)[0]) => {
    const isActive = (pathname === href) || (href !== '/' && pathname.startsWith(href));
    return (
      <Link href={href} className="flex flex-col items-center justify-center gap-1 w-full text-center">
        <Icon className={cn('w-6 h-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
        <span className={cn('text-xs font-medium transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>
          {label}
        </span>
      </Link>
    );
  };
  
  const MenuButton = () => {
    return (
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center justify-center gap-1 w-full text-center">
             <Menu className="w-6 h-6 text-muted-foreground" />
             <span className="text-xs font-medium text-muted-foreground">Menu</span>
        </button>
    )
  }

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
          <MenuButton />
        </div>
      </nav>
      <MobileMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  );
}
