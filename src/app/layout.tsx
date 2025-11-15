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
  description: "Official Free Fire top-up center for Singapore (SG) & Sri Lanka. Dark Diamond Store offers instant diamond top-ups, hosts an e-sports tournament point calculator, and lists tournament organizers in Sri Lanka.",
  keywords: "Free Fire top up, dark diamond store, dark topup, free fire topup center, singapore region free fire, tournament calculator, tournament organizer sri lanka, diamond store",
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
