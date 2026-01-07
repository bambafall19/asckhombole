
"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "../icons/social-icons";
import { useDocument, useFirestore, useUser } from "@/firebase";
import { useEffect, useMemo, useState } from "react";
import { doc } from "firebase/firestore";
import { ClubInfo } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const SocialIcon = ({ children, href }: { children: React.ReactNode, href?: string }) => {
  if (!href) return null;
  return (
    <Button variant="ghost" size="icon" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
        {children}
      </a>
    </Button>
  );
};

const baseNavSections = [
    {
        title: "Le Club",
        links: [
            { href: "/club", label: "Histoire" },
            { href: "/equipe", label: "Équipe Pro" },
            { href: "/actus", label: "Actualités" },
            { href: "/contact", label: "Contact" },
        ]
    },
    {
        title: "Compétition",
        links: [
            { href: "/matchs", label: "Calendrier" },
            { href: "/matchs", label: "Résultats" },
            { href: "/matchs", label: "Classement" },
        ]
    },
    {
        title: "Médias",
        links: [
            { href: "/galerie", label: "Galerie" },
            { href: "/webtv", label: "Web TV" },
        ]
    },
    {
        title: "Plus",
        links: [
            { href: "/boutique", label: "Boutique" },
            { href: "/partenaires", label: "Partenaires" },
        ]
    }
];

export function Footer() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [navSections, setNavSections] = useState(baseNavSections);

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: clubInfo } = useDocument<ClubInfo>(clubInfoRef);

  useEffect(() => {
    // Clone base sections to avoid direct mutation
    const newSections = JSON.parse(JSON.stringify(baseNavSections));
    const moreSection = newSections.find((s: any) => s.title === "Plus");

    if (user) {
      // If user is logged in and admin link doesn't exist, add it
      if (moreSection && !moreSection.links.some((l: any) => l.href === '/admin')) {
        moreSection.links.push({ href: "/admin", label: "Admin" });
      }
    }
    
    setNavSections(newSections);
    
  }, [user]);


  return (
    <footer className="bg-card border-t">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-4">
            <Logo logoUrl={clubInfo?.logoUrl} />
            <p className="text-muted-foreground text-sm max-w-xs">
              Le site officiel de l'Association Sportive et Culturelle de Khombole, toute l'actualité du club.
            </p>
            <div className="flex space-x-1">
              <SocialIcon href={clubInfo?.facebookUrl}><FacebookIcon className="h-5 w-5" /></SocialIcon>
              <SocialIcon href={clubInfo?.twitterUrl}><TwitterIcon className="h-5 w-5" /></SocialIcon>
              <SocialIcon href={clubInfo?.instagramUrl}><InstagramIcon className="h-5 w-5" /></SocialIcon>
              <SocialIcon href={clubInfo?.youtubeUrl}><YoutubeIcon className="h-5 w-5" /></SocialIcon>
          </div>
          </div>

          {/* Desktop Footer */}
          <div className="hidden lg:col-span-8 lg:grid grid-cols-2 md:grid-cols-4 gap-8">
            {navSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{section.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {section.links.map(link => (
                         <li key={`${link.href}-${link.label}`}><Link href={link.href} className="text-base text-muted-foreground hover:text-primary">{link.label}</Link></li>
                    ))}
                  </ul>
                </div>
            ))}
          </div>

          {/* Mobile Footer */}
          <div className="lg:hidden col-span-1">
            <Accordion type="multiple" className="w-full">
                {navSections.map(section => (
                    <AccordionItem value={section.title} key={section.title}>
                        <AccordionTrigger className="text-sm font-semibold text-foreground tracking-wider uppercase py-4">
                            {section.title}
                        </AccordionTrigger>
                        <AccordionContent>
                             <ul className="space-y-3 pt-2">
                                {section.links.map(link => (
                                    <li key={`${link.href}-${link.label}-mobile`}>
                                        <Link href={link.href} className="text-base text-muted-foreground hover:text-primary">{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} ASC Khombole. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
