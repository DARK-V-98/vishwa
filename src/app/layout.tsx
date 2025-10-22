import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "R.M.T Vishwa Vidarshana | Web Developer & Designer",
  description: "Professional web development, logo design, and business solutions by Vishwa Vidarshana. 6+ years experience delivering top-tier digital services in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
