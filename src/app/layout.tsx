import type { Metadata } from "next";
import { Inter, PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { BottomNav } from "@/components/layout/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const ptSans = PT_Sans({ subsets: ["latin"], weight: ['400', '700'], variable: "--font-headline" });

export const metadata: Metadata = {
  title: "ASC Khombole - Site Officiel",
  description: "La plateforme web moderne pour l'ASC Khombole.",
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
          ptSans.variable
        )}
      >
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pb-24 md:pb-0">{children}</main>
            <Footer />
          </div>
          <BottomNav />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
