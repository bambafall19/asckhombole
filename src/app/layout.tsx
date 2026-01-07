import type { Metadata, Viewport } from "next";
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

const APP_NAME = "ASC Khombole";
const APP_DESCRIPTION = "La plateforme web moderne pour l'ASC Khombole.";
const APP_URL = "https://asckhombole.web.app";
const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/asc-khombole.appspot.com/o/logo.png?alt=media&token=223b5b30-3c23-4942-81ca-636c5b96a480";


export const metadata: Metadata = {
  title: "ASC Khombole - Site Officiel",
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: LOGO_URL,
        width: 512,
        height: 512,
        alt: "ASC Khombole Logo",
      },
    ],
  },
  twitter: {
    creator: "@asckhombole",
    card: "summary_large_image",
  },
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
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
