
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useUser } from "@/firebase";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "ESystemLK", path: "/esystemlk" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Design Services", path: "/design-services" },
    { name: "Get a Quote", path: "/quotation-generator" },
    { name: "Contact", path: "/contact" },
  ];

  if (user) {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
    navLinks.push({ name: "Appointments", path: "/appointments" });
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const isActive = (path: string) => pathname === path;

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push("/");
    });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/lg.png"
              alt="Vishwa Vidarshana Logo"
              width={40}
              height={40}
              className="rounded-lg group-hover:shadow-glow transition-all"
            />
            <div className="hidden md:block">
              <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
                Vishwa Vidarshana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant="ghost"
                  className={`${
                    isActive(link.path)
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {!isUserLoading &&
              (user ? (
                <Button variant="hero" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <Link href="/auth">
                  <Button variant="hero" size="sm">
                    Sign In
                  </Button>
                </Link>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border animate-in slide-in-from-top">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive(link.path)
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
            {!isUserLoading &&
              (user ? (
                <Button variant="hero" size="sm" className="w-full mt-4" onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <Link href="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full mt-4">
                    Sign In
                  </Button>
                </Link>
              ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
