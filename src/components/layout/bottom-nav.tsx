
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Trophy, Users, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
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
  isAnimating,
}: { 
  href: string; 
  label: string; 
  icon: React.ElementType, 
  isActive: boolean,
  isAnimating: boolean,
}) {
  return (
    <Link href={href} className="relative z-10 flex flex-col items-center justify-center gap-1 w-full text-center h-full group transition-colors duration-300">
      <Icon className={cn('w-6 h-6 transition-transform duration-300', isActive ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-primary')} />
      <span className={cn('text-xs font-medium transition-colors duration-300', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary')}>
        {label}
      </span>
    </Link>
  );
};
  
function MenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="relative z-10 flex flex-col items-center justify-center gap-1 w-full text-center h-full group">
             <Menu className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
             <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">Menu</span>
        </button>
    )
}

export function BottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const navNode = navRef.current;
    if (!navNode) return;

    const activeIndex = navItems.findIndex(item => (pathname === item.href) || (item.href !== '/' && pathname.startsWith(item.href)));
    const activeButton = navNode.children[activeIndex] as HTMLElement;

    if (activeButton) {
        setIsAnimating(true);
        setIndicatorStyle({
            left: `${activeButton.offsetLeft}px`,
            width: `${activeButton.offsetWidth}px`,
        });
        const timer = setTimeout(() => setIsAnimating(false), 300);
        return () => clearTimeout(timer);
    } else {
        setIndicatorStyle({ width: '0px' });
    }

  }, [pathname]);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t shadow-[0_-2px_10px_-3px_rgba(0,0,0,0.05)] z-50">
        <div ref={navRef} className="flex items-center justify-around h-full relative">
            {navItems.map((item) => (
                <NavItem 
                key={item.href} 
                {...item} 
                isActive={(pathname === item.href) || (item.href !== '/' && pathname.startsWith(item.href))}
                isAnimating={isAnimating}
                />
            ))}
            <MenuButton onClick={() => setIsMenuOpen(true)} />
            
            <div 
                className="absolute bottom-0 h-1 bg-primary rounded-full transition-all duration-300 ease-in-out"
                style={indicatorStyle}
            />
        </div>
      </nav>
      <MobileMenuSheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  );
}
