import type { Metadata } from "next";
import { Inter, PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FirebaseClientProvider } from "@/firebase/client-provider";

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
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
