
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code, Palette, Building2, ArrowRight, Star, Zap, Shield, Users, Gamepad2, Briefcase,
  FileKey2, ListTree, Regex, FileJson, QrCode, Barcode, ScanLine, KeyRound, Server, Palette as PaletteIcon,
  Cpu, FileCode2, Fingerprint, Award, Tv, Bot, Settings, MessageSquare, Download, Crop, FileLock, Maximize,
  Sparkles, CheckCircle2, MapPin, Rocket, Terminal, TrendingUp, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";


const allTools = [
   {
    title: "JSON <> CSV Converter",
    description: "Convert JSON files to CSV and vice-versa. Supports nested JSON and file uploads.",
    href: "/tools/json-csv-converter",
    icon: FileJson,
    category: "Converter",
    variant: "hero" as "hero",
  },
  {
    title: "Code Minifier",
    description: "Minify your CSS, JavaScript, and HTML code to reduce file size and improve load times.",
    href: "/tools/code-minifier",
    icon: Code,
    category: "Utility",
    variant: "secondary" as "secondary",
  },
  {
    title: "Regex Tester",
    description: "Test and debug your regular expressions with live matching, groups, and replacements.",
    href: "/tools/regex-tester",
    icon: Regex,
    category: "Utility",
    variant: "secondary" as "secondary",
  },
  {
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens to view header and payload data securely.",
    href: "/tools/jwt-decoder",
    icon: Fingerprint,
    category: "Security",
    variant: "outline" as "outline",
  },
  {
    title: "Markdown to HTML",
    description: "Convert Markdown text into clean HTML with a live preview and copy-to-clipboard functionality.",
    href: "/tools/markdown-converter",
    icon: FileCode2,
    category: "Converter",
    variant: "outline" as "outline",
  },
  {
    title: "Color Palette Generator",
    description: "Generate beautiful color palettes from a base color or randomly. Get HEX, RGB, and HSL values.",
    href: "/tools/color-palette-generator",
    icon: Palette,
    category: "Design",
    variant: "outline" as "outline",
  },
  {
    title: "API Tester",
    description: "A lightweight, browser-based client to test your API endpoints (GET, POST, etc.). A mini Postman.",
    href: "/tools/api-tester",
    icon: Server,
    category: "Utility",
    variant: "outline" as "outline",
  },
   {
    title: "Image Converter",
    description: "Convert image files between different formats (e.g., JPG, PNG, WEBP).",
    href: "/tools/file-converter",
    icon: FileKey2,
    category: "Converter",
    variant: "hero" as "hero",
  },
  {
    title: "PDF Suite",
    description: "Convert images to PDF or extract pages from a PDF file into images.",
    href: "/tools/pdf-suite",
    icon: ListTree,
    category: "Converter",
    variant: "hero" as "hero",
  },
  {
    title: "Image Resizer",
    description: "Resize images to custom dimensions. Perfect for web, social media, or documents.",
    href: "/tools/image-resizer",
    icon: Maximize,
    category: "Image",
    variant: "secondary" as "secondary",
  },
  {
    title: "Image Cropper",
    description: "Crop specific areas of an image with an easy-to-use interface. Download only the selected part.",
    href: "/tools/image-cropper",
    icon: Crop,
    category: "Image",
    variant: "secondary" as "secondary",
  },
  {
    title: "File Encryption & Decryption",
    description: "Secure any file with AES-256 encryption. Lock and unlock files with a password, client-side.",
    href: "/tools/file-encryption",
    icon: FileLock,
    category: "Security",
    variant: "outline" as "outline",
  },
  {
    title: "QR Code Generator",
    description: "Generate QR codes from any text or URL. Download a high-quality PNG instantly.",
    href: "/tools/qr-generator",
    icon: QrCode,
    category: "Utility",
    variant: "outline" as "outline",
  },
   {
    title: "QR Code Scanner",
    description: "Scan QR codes using your camera or by uploading an image. Detects and reads code data securely.",
    href: "/tools/qr-scanner",
    icon: ScanLine,
    category: "Utility",
    variant: "outline" as "outline",
  },
  {
    title: "Barcode Generator",
    description: "Create standard barcodes (EAN, UPC, etc.) for products or inventory management.",
    href: "/tools/barcode-generator",
    icon: Barcode,
    category: "Utility",
    variant: "outline" as "outline",
  },
  {
    title: "Password Generator",
    description: "Create strong, secure passwords with custom length and character settings.",
    href: "/tools/password-generator",
    icon: KeyRound,
    category: "Security",
    variant: "outline" as "outline",
  },
];

const TestimonialCarousel = dynamic(() => import('@/components/sections/testimonial-carousel'), { 
    ssr: false,
    loading: () => (
        <div className="flex gap-4">
            <Skeleton className="w-full h-56 md:w-1/2 lg:w-1/3" />
            <Skeleton className="w-full h-56 hidden md:block md:w-1/2 lg:w-1/3" />
            <Skeleton className="w-full h-56 hidden lg:block lg:w-1/3" />
        </div>
    )
});

function AnimatedCounter({ value, suffix = "", duration = 1600 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const Home = () => {
  const stats = [
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 25, suffix: "+", label: "Free Dev Tools" },
    { value: 100, suffix: "%", label: "Client-Side & Secure" },
    { value: 24, suffix: "/7", label: "Support" },
  ];

  const techStack = [
    "Next.js", "React", "TypeScript", "Node.js", "Firebase", "Tailwind CSS",
    "PostgreSQL", "Framer Motion", "Genkit AI", "Vercel",
  ];

  const services = [
    { icon: Code, title: "Web Development & Software", description: "Custom web apps, mobile apps, with a focus on security and fast delivery.", link: "/esystemlk" },
    { icon: Palette, title: "Design Services", description: "Professional logo and post designs with clear packages and a simple process.", link: "/design-services" },
    { icon: Gamepad2, title: "E-Sports & Game Top-ups", description: "Top-up store, Point Calculator, and Budget Planner for gamers.", link: "/freefire-topup" },
    { icon: Briefcase, title: "Developer Tools Suite", description: "A full suite of free, secure, client-side tools for all developers.", link: "/tools" },
  ];
  
  const features = [
    { icon: Shield, title: "Secure Client-Side Tools", description: "Your data is never uploaded. All tools run safely in your browser." },
    { icon: Bot, title: "Automated Quotation Generator", description: "Get instant, detailed project quotes based on your requirements." },
    { icon: Tv, title: "Live Leaderboard Calculator", description: "Manage e-sports points in real-time with our powerful calculator." },
    { icon: Settings, title: "Custom Business Solutions", description: "Fast, reliable, and tailored software from ESystemLK." },
    { icon: MessageSquare, title: "Real-Time Admin Chat", description: "Direct communication for support and project management." },
    { icon: Download, title: "Marketplace (Coming Soon)", description: "A new platform for buying and selling goods with advanced features." },
  ];
  
  const topTools = [
    { icon: ListTree, title: "PDF Suite", description: "Convert images to PDF and extract pages from PDFs.", href: "/tools/pdf-suite" },
    { icon: FileKey2, title: "Image Converter", description: "Batch convert images between JPG, PNG, WEBP, and BMP.", href: "/tools/file-converter" },
    { icon: QrCode, title: "QR/Barcode Utilities", description: "Generate and scan QR codes and standard barcodes.", href: "/tools/qr-generator" },
    { icon: FileJson, title: "JSON <> CSV Converter", description: "Easily switch between JSON and CSV data formats.", href: "/tools/json-csv-converter" },
    { icon: Gamepad2, title: "Point Calculator", description: "The ultimate tool for managing e-sports tournament scores.", href: "/games/point-calculator" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* techy layered background */}
        <div className="absolute inset-0 z-0 bg-grid bg-grid-fade opacity-70" aria-hidden="true" />
        <div className="glow-blob left-[8%] top-24 h-72 w-72 animate-glow-pulse bg-primary/30" aria-hidden="true" />
        <div className="glow-blob right-[6%] top-40 h-80 w-80 animate-glow-pulse bg-secondary/25 [animation-delay:1.5s]" aria-hidden="true" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-background/90" aria-hidden="true" />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl space-y-8 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur">
              <MapPin className="h-4 w-4" />
              Based in Sri Lanka
              <span className="mx-1 h-1 w-1 rounded-full bg-primary/50" />
              <Sparkles className="h-4 w-4" />
              Web · Design · E-Sports
            </div>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              <span className="text-gradient">Vishwa Vidarshana</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
              Web Developer, Designer &amp; E-Sports Innovator. Delivering high-quality web solutions, design services, Free Fire top-ups, and a suite of free developer tools.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/contact"><Button variant="hero" size="lg" className="gap-2"><Rocket className="h-4 w-4" />Start a Project</Button></Link>
              <Link href="/tools"><Button variant="outline" size="lg" className="gap-2"><Terminal className="h-4 w-4" />Explore Tools</Button></Link>
            </div>

            {/* trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
              {["100% Client-Side Tools", "Fast Delivery", "Secure by Design"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {b}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/60 bg-card/60 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="text-3xl font-bold text-gradient md:text-4xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech stack marquee */}
      <section className="border-y border-border/50 bg-muted/20 py-6">
        <div className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Built With Modern Technology
        </div>
        <div className="marquee-pause relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <div className="marquee gap-4 pr-4">
            {[...techStack, ...techStack].map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-card/70 px-5 py-2 text-sm font-medium text-foreground/80"
              >
                <Layers className="h-4 w-4 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem of digital services and products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{delay: i * 0.1}}>
                <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group flex flex-col">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all">
                      <service.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                     <Button asChild variant="outline" className="w-full">
                        <Link href={service.link}>Learn More <ArrowRight className="ml-2"/></Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{delay: i * 0.1}}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-medium transition-shadow">
                  <CardContent className="p-6 flex items-start gap-4">
                     <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-medium">
                        <feature.icon className="h-5 w-5 text-accent-foreground" />
                     </div>
                     <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Free Developer Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of our most popular free, secure, and client-side utilities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTools.map((tool, i) => (
              <motion.div key={i} initial={{opacity: 0, scale: 0.95}} whileInView={{opacity: 1, scale: 1}} viewport={{once: true}} transition={{delay: i * 0.1}}>
                 <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-strong transition-all duration-300 group flex flex-col">
                    <CardHeader>
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium mb-4">
                            <tool.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm">{tool.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button asChild className="w-full" variant="secondary">
                            <Link href={tool.href}>Use This Tool</Link>
                        </Button>
                    </div>
                </Card>
              </motion.div>
            ))}
            <motion.div initial={{opacity: 0, scale: 0.95}} whileInView={{opacity: 1, scale: 1}} viewport={{once: true}} transition={{delay: 0.5}} className="md:col-span-2 lg:col-span-3">
              <Link href="/tools">
                <Card className="border-2 border-dashed border-border/50 bg-card/30 hover:border-primary hover:bg-primary/5 transition-all text-center">
                  <CardContent className="p-12">
                      <h3 className="text-xl font-semibold">Explore All {allTools.length} Tools</h3>
                      <p className="text-muted-foreground mt-2">View the complete suite of developer utilities</p>
                      <ArrowRight className="mx-auto mt-4 h-6 w-6 text-primary"/>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero border-0 shadow-strong max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Elevate Your Digital Presence?</h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                Whether you need a new website, a powerful tool, or a custom software solution, I'm here to help. Let's build something great together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"><Button variant="secondary" size="lg">Contact Me</Button></Link>
                <Link href="/tools"><Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">Explore Free Tools</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
