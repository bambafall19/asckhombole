import type { Metadata } from "next";
import { Inter, PT_Sans, DynaPuff } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AddToHomeScreenPrompt } from "@/components/add-to-home-screen";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-headline",
});
const dynaPuff = DynaPuff({ subsets: ["latin"], variable: "--font-dynapuff" });

export const metadata: Metadata = {
  title: "ASC Khombole - Site Officiel",
  description: "La plateforme web moderne pour l'ASC Khombole.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          ptSans.variable,
          dynaPuff.variable
        )}
      >
        <FirebaseClientProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pt-16 md:pt-24">{children}</main>
              <Footer />
            </div>
          <BottomNav />
          <Toaster />
          <AddToHomeScreenPrompt />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
