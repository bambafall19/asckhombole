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

function NavItem({ 
  href, 
  label, 
  icon: Icon, 
  isActive,
}: { 
  href: string; 
  label: string; 
  icon: React.ElementType, 
  isActive: boolean,
}) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1 w-full text-center h-full group transition-colors duration-300">
      <Icon className={cn('w-6 h-6', isActive ? 'text-primary' : 'text-muted-foreground/80 group-hover:text-primary')} />
      <span className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground/80 group-hover:text-primary')}>
        {label}
      </span>
    </Link>
  );
};
  
function MenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 w-full text-center h-full group">
             <Menu className="w-6 h-6 text-muted-foreground/80 group-hover:text-primary transition-colors" />
             <span className="text-xs font-medium text-muted-foreground/80 group-hover:text-primary transition-colors">Menu</span>
        </button>
    )
}

export function BottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-4 left-4 right-4 h-16 z-50">
        <nav className="bg-card/95 backdrop-blur-sm shadow-lg rounded-xl h-full flex items-center justify-around border">
            {navItems.map((item) => (
                <NavItem 
                    key={item.href} 
                    {...item} 
                    isActive={(pathname === item.href) || (item.href !== '/' && pathname.startsWith(item.href))}
                />
            ))}
            <MenuButton onClick={() => setIsMenuOpen(true)} />
        </nav>
      </div>
      <MobileMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  );
}
