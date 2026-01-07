
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

function NavItem({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType, isActive: boolean }) {
  return (
    <Link href={href} className="relative flex flex-col items-center justify-center gap-1 w-full text-center h-full">
      <Icon className={cn('w-6 h-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')} />
      <span className={cn('text-xs font-medium transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')}>
        {label}
      </span>
       {isActive && (
        <div className="absolute bottom-0 h-1 w-8 rounded-t-full bg-primary" />
      )}
    </Link>
  );
};
  
function MenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 w-full text-center h-full group">
             <Menu className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
             <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">Menu</span>
        </button>
    )
}

export function BottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => (
            <NavItem 
              key={item.href} 
              {...item} 
              isActive={(pathname === item.href) || (item.href !== '/' && pathname.startsWith(item.href))}
            />
          ))}
          <MenuButton onClick={() => setIsMenuOpen(true)} />
        </div>
      </nav>
      <MobileMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  );
}

