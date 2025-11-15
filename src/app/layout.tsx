import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import WelcomeMat from "@/components/welcome-mat";
import FloatingChatWidget from "@/components/chat/FloatingChatWidget";

export const metadata: Metadata = {
  title: "Dark Diamond Store | Free Fire Top-Up Center & Tournament Organizer",
  description: "Official Free Fire top-up center for Singapore (SG) & Sri Lanka. Dark Diamond Store offers instant diamond top-ups, hosts an e-sports tournament point calculator, and lists tournament organizers in Sri Lanka. Your one-stop shop for gaming needs and professional web development by ESystemLK.",
  keywords: [
    // Free Fire Top-up & Dark Diamond Store
    "Dark Diamond Store",
    "dark diamond store",
    "dark topup",
    "Free Fire top up",
    "Free Fire topup",
    "Free Fire top-up center",
    "Free Fire diamond store",
    "Singapore region Free Fire top up",
    "SG region FF top up",
    "Sri Lanka Free Fire top up",
    "FF top up SL",
    "instant Free Fire diamonds",
    "buy Free Fire diamonds",
    "cheap Free Fire diamonds",
    "Garena shells top up",
    "Free Fire weekly membership",
    "Free Fire monthly membership",
    "FF level up pass",
    "top up player ID",
    "Free Fire credits",
    "game top-up Sri Lanka",
    "online game store",
    "diamond purchase Free Fire",
    "Vishwa Vidarshana gaming",
    "official diamond seller",
    
    // E-Sports & Tournament Keywords
    "esports tournament organizer Sri Lanka",
    "tournament organizer Colombo",
    "gaming tournaments Sri Lanka",
    "Free Fire tournament Sri Lanka",
    "PUBG tournament Sri Lanka",
    "Valorant tournament Sri Lanka",
    "submit a tournament",
    "upcoming esports events",
    "esports point calculator",
    "tournament point calculator",
    "gaming leaderboard tool",
    "Free Fire scoring system",
    "PUBG points table",
    "esports results generator",
    "manage esports tournament",
    "gaming community Sri Lanka",
    "online tournament platform",
    "create a tournament",
    
    // Web Development & ESystemLK
    "Vishwa Vidarshana",
    "ESystemLK",
    "web developer Sri Lanka",
    "freelance developer Colombo",
    "Next.js developer Sri Lanka",
    "React developer Sri Lanka",
    "custom software solutions",
    "full-stack developer",
    "UI/UX design Sri Lanka",
    "logo design services",
    "post design services",
    "app development Sri Lanka",
    "e-commerce website development",
    "learning management system",
    "hire a web developer",
    "professional website design",
    "Firebase expert",
    "Genkit AI developer",
    "automated quotation system",
    "business system development",

    // General & Long-tail Searches
    "how to top up Free Fire in Singapore",
    "best place to buy FF diamonds in Sri Lanka",
    "how to calculate tournament points",
    "list my gaming tournament online",
    "find gaming events near me",
    "online marketplace Sri Lanka",
    "buy and sell online",
    "book an appointment with a developer",
    "get a quote for a website",
    "Vishwa Vidarshana portfolio",
    "ESystemLK software company",
    "Dark Diamond store owner",
    "top game top-up sites",
    "secure diamond top-up",
    "customer chat for support",
    "admin dashboard for website",
    "online payment for games",
    "bank transfer top up",
    "how to find Free Fire player ID",
    "Vishwa LK website",
    "Free Fire membership bonus",
    "esports tools online",
    "gaming center",
    "point calculator for games",
    "tournament bracket generator",
    "Free Fire tournaments app",
    "BGMI point calculator",
    "Apex Legends scoring",
    "gaming result card maker",
    "export tournament results",
    "online tournament listing",
    "best web developers in Sri Lanka"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
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
