'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  } from '@/components/ui/sidebar';
  import { Logo } from '@/components/logo';
  import {
    Home,
    Newspaper,
    Trophy,
    Users,
    Shield,
    ImageIcon,
    Handshake,
    Store,
    Mail,
    Tv,
  } from 'lucide-react';
  import Link from 'next/link';
  import { usePathname } from 'next/navigation';
  
  const links = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/actus', label: 'Actualités', icon: Newspaper },
    { href: '/matchs', label: 'Matchs', icon: Trophy },
    { href: '/equipe', label: 'Équipe', icon: Users },
    { href: '/club', label: 'Club', icon: Shield },
    { href: '/galerie', label: 'Galerie', icon: ImageIcon },
    { href: '/partenaires', label: 'Partenaires', icon: Handshake },
    { href: '/boutique', label: 'Boutique', icon: Store, disabled: true },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/webtv', label: 'Web TV', icon: Tv, disabled: true },
  ];
  
  export function MainSidebar() {
    const pathname = usePathname();
    return (
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
                    disabled={link.disabled}
                    as="a"
                  >
                    <link.icon />
                    {link.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    );
  }
  