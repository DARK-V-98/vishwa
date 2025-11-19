
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import WelcomeMat from "@/components/welcome-mat";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = "https://vishwavidarshana.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vishwa Vidarshana – Web Development, Design, E-Sports Tools & Free Developer Utilities",
    template: "%s | Vishwa Vidarshana",
  },
  description: "Vishwa Vidarshana provides professional web development, creative design, game top-ups, e-sports management tools, and free browser-based developer utilities. Explore our services and tools today.",
  keywords: [
    "Vishwa Vidarshana", "ESystemLK", "Dark Diamond Store", "Free Fire top up", "web development Sri Lanka",
    "esports tools", "point calculator", "developer tools", "image converter", "pdf tools",
    "jwt decoder", "API tester", "logo design", "custom software", "Next.js developer"
  ],
  openGraph: {
    title: {
        default: "Vishwa Vidarshana – Web Development, Design, E-Sports Tools & Free Developer Utilities",
        template: "%s | Vishwa Vidarshana",
    },
    description: "Expert web development, creative design, and e-sports solutions.",
    url: siteUrl,
    siteName: 'Vishwa Vidarshana',
    images: [
      {
        url: `/og-image.png`, 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: "Vishwa Vidarshana – Web Development, Design, E-Sports Tools & Free Developer Utilities",
        template: "%s | Vishwa Vidarshana",
    },
    description: "Expert web development, creative design, and e-sports solutions.",
    images: [`/og-image.png`], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Vishwa Vidarshana",
      "url": "https://vishwavidarshana.com",
      "logo": "https://vishwavidarshana.com/lg.png",
      "sameAs": [
        "https://www.facebook.com/share/1Ber5EBeNW/",
        "https://www.linkedin.com/in/vishwa-vidarshana-6b2608394"
      ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
        </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <FirebaseClientProvider>
          <WelcomeMat />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingChatWidget />
          <Toaster />
          <SonnerToaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
