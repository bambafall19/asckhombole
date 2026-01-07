'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpFromBracket, PlusSquare, X } from 'lucide-react';
import { Logo } from './logo';
import { useDocument, useFirestore } from '@/firebase';
import { ClubInfo } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { isIOS, isMobile } from 'react-device-detect';

export function AddToHomeScreenPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const firestore = useFirestore();

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);
  const { data: clubInfo } = useDocument<ClubInfo>(clubInfoRef);

  useEffect(() => {
    const promptShown = localStorage.getItem('addToHomeScreenPromptShown');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (!promptShown && isMobile && !isStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (persist: boolean) => {
    if (persist) {
      localStorage.setItem('addToHomeScreenPromptShown', 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const instructions = isIOS ? (
    <>
        <li className="flex items-center gap-3">
            <ArrowUpFromBracket className="w-5 h-5 text-primary" />
            <span>Clique sur le bouton <strong>Partager</strong></span>
        </li>
        <li className="flex items-center gap-3">
            <PlusSquare className="w-5 h-5 text-primary" />
            <span>Sélectionne "<strong>Sur l'écran d'accueil</strong>"</span>
        </li>
    </>
  ) : (
    <>
        <li className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 8V2"/><path d="M12 12v-2"/><path d="M12 22v-2"/><circle cx="12" cy="12" r="2"/><path d="m18 16-4-4"/><path d="m6 8 4 4"/><path d="m16 6-4 4"/><path d="m8 18 4-4"/></svg>
            <span>Ouvre les options du navigateur</span>
        </li>
        <li className="flex items-center gap-3">
            <PlusSquare className="w-5 h-5 text-primary" />
            <span>Sélectionne "<strong>Installer l'application</strong>" ou "<strong>Ajouter à l'écran d'accueil</strong>"</span>
        </li>
    </>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in-0">
        <Card className="m-4 w-full max-w-md animate-in slide-in-from-bottom-10">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <Logo logoUrl={clubInfo?.logoUrl} />
                </div>
                <CardTitle>Installe ASC Khombole</CardTitle>
                <CardDescription>Accède rapidement au site et profite d'une meilleure expérience.</CardDescription>
            </CardHeader>
            <CardContent className="bg-yellow-50/50 dark:bg-yellow-900/20 p-4 rounded-lg mx-6 border border-yellow-200 dark:border-yellow-900">
                <h4 className="font-bold mb-2 text-yellow-900 dark:text-yellow-300">Comment installer :</h4>
                <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                    {instructions}
                </ul>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-4 pt-6">
                <Button variant="ghost" onClick={() => handleClose(true)}>
                    <X className="mr-2 h-4 w-4" />
                    Ne plus montrer
                </Button>
                <Button onClick={() => handleClose(false)}>Compris !</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
