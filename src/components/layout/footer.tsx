import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Github, Mail, ArrowUpRight, Code2 } from "lucide-react";

const footerNav: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: "Services",
    links: [
      { name: "Web Development", href: "/esystemlk" },
      { name: "Design Services", href: "/design-services" },
      { name: "Game Top-up", href: "/freefire-topup" },
      { name: "Get a Quote", href: "/quotation" },
      { name: "Marketplace", href: "/marketplace" },
    ],
  },
  {
    title: "Tools & Games",
    links: [
      { name: "Developer Tools", href: "/tools" },
      { name: "PDF Suite", href: "/tools/pdf-suite" },
      { name: "QR Generator", href: "/tools/qr-generator" },
      { name: "Point Calculator", href: "/games/point-calculator" },
      { name: "Tournaments", href: "/tournaments" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Me", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Track Order", href: "/track-order" },
      { name: "Notes", href: "/notes/bridal-beauty-nvq-level-4" },
      { name: "ESystemLK", href: "/esystemlk" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund-policy" },
    ],
  },
];

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/share/1Ber5EBeNW/", icon: Facebook },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/vishwa-vidarshana-6b2608394", icon: Linkedin },
  { name: "GitHub", href: "#", icon: Github },
  { name: "Email", href: "/contact", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-gradient-subtle overflow-hidden">
      {/* techy grid glow */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

      <div className="container relative mx-auto px-4 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2">
              <Image
                src="/lg.png"
                alt="Vishwa Vidarshana Logo"
                width={40}
                height={40}
                className="rounded-lg transition-all group-hover:shadow-glow"
              />
              <span className="text-lg font-bold text-gradient">Vishwa Vidarshana</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Web developer, designer & e-sports innovator. Building fast, secure digital
              products — plus a suite of free, client-side developer tools.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Available for new projects
            </div>

            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-glow"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Vishwa Vidarshana. Built by ESystemLK.
          </p>
          <a
            href="https://www.esystemlk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Code2 className="h-4 w-4 text-primary" />
            Powered by <span className="font-semibold text-foreground">ESystemLK</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
