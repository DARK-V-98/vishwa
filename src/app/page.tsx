
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Code, Palette, Building2, ArrowRight, Star, Zap, Shield, Users, Gamepad2, Briefcase,
  FileKey2, ListTree, Regex, FileJson, QrCode, Barcode, ScanLine, KeyRound, Server, Palette as PaletteIcon,
  Cpu, FileCode2, Fingerprint, Award, Tv, Bot, Settings, MessageSquare, Download, Maximize, Crop, FileLock
} from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Metadata } from 'next';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  message: string;
  imageUrl: string;
  rating: number;
}

const AnimatedProgress = ({ value, label }: { value: number; label: string }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-foreground">{label}</span>
        <span className="text-sm font-medium text-primary">{value}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div className="bg-gradient-primary h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
};

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

const Home = () => {
  const firestore = useFirestore();
  const testimonialsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const testimonialsCollection = collection(firestore, 'testimonials');
    return query(testimonialsCollection, orderBy('createdAt', 'desc'));
  }, [firestore]);
  const { data: testimonials, isLoading: testimonialsLoading } = useCollection<Omit<Testimonial, 'id'>>(testimonialsQuery);

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
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-background opacity-50 z-0">
           <Image src="/bac.png" alt="Abstract background" layout="fill" objectFit="cover" quality={80} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-hero bg-clip-text text-transparent">
              Vishwa Vidarshana
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Web Developer, Designer & E-Sports Innovator. Delivering high-quality web solutions, design services, Free Fire top-ups, and a suite of free developer tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact"><Button variant="hero" size="lg">Start a Project</Button></Link>
              <Link href="/tools"><Button variant="outline" size="lg">Explore Tools</Button></Link>
            </div>
          </motion.div>
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
          <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]} className="w-full max-w-6xl mx-auto">
            <CarouselContent className="-ml-4">
              {(testimonialsLoading ? [...Array(3)] : testimonials)?.map((testimonial, idx) => (
                <CarouselItem key={testimonial?.id || idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      {testimonial ? (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-12 h-12 border-2 border-primary/20"><AvatarImage src={testimonial.imageUrl} /><AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground italic flex-grow">"{testimonial.message}"</p>
                          <div className="flex gap-1 mt-4">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30'}`} />)}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-full"/><div className="space-y-2"><Skeleton className="h-4 w-24"/><Skeleton className="h-4 w-16"/></div></div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4" />
            <CarouselNext className="hidden sm:flex -right-4" />
          </Carousel>
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
