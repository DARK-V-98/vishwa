"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/design-studio", label: "Design Studio" },
  { href: "/appointments", label: "Appointments" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/quotation", label: "Get a Quote" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-xl">
              Vishwa Vidarshana
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Sprout className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline text-xl">
                        Vishwa Vidarshana
                        </span>
                    </Link>
                    <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "px-2 py-1 rounded-md transition-colors hover:bg-accent",
                          pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">
              Vishwa Vidarshana
            </span>
          </Link>

          <nav className="flex items-center">
            <Button asChild>
              <Link href="/quotation">Contact Us</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
