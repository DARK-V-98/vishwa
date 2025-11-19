
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Search,
  Maximize,
  Crop,
  FileLock,
  QrCode,
  Barcode,
  KeyRound,
  ScanLine,
  Zap,
  Shield,
  Globe,
  FileKey2,
  Code,
  Regex,
  FileJson,
  Fingerprint as JwtIcon,
  Palette,
  Server,
  FileCode2,
  ListTree
} from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    icon: JwtIcon,
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

const categories = ["All", "Converter", "Image", "Security", "Utility", "Design", "SEO"];

const generalFeatures = [
    { icon: Zap, title: "Blazing Fast", description: "All tools run instantly in your browser, with no waiting for uploads or server processing." },
    { icon: Shield, title: "100% Private", description: "Your files and data are never sent to a server. Everything stays on your device." },
    { icon: Globe, title: "Works Offline", description: "After the initial page load, our tools work even without an internet connection." },
    { icon: JwtIcon, title: "Free & Anonymous", description: "No sign-ups, no tracking, and no watermarks. Just free, powerful tools for everyone." },
];

const faqItems = [
    { q: "Are these tools really free?", a: "Yes, every tool in our collection is 100% free to use, with no hidden fees, watermarks, or usage limits." },
    { q: "Is it safe to use my sensitive files?", a: "Absolutely. The core security feature of our suite is that all processing happens locally in your browser. Your files are never uploaded to any server, making it as secure as an offline desktop application." },
    { q: "Do I need to install any software?", a: "No, there's nothing to install. All tools run directly in your web browser. As long as you have a modern browser like Chrome, Firefox, or Safari, you're good to go." },
    { q: "Do the tools work on mobile devices?", a: "Yes, our entire tool suite is designed to be fully responsive and functional on desktops, tablets, and smartphones." },
];


export default function ToolsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredTools = allTools.filter(tool => {
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    }).sort((a, b) => a.title.localeCompare(b.title));

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
            },
        }),
    };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                Productivity Suite
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Developer Tools Suite
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A suite of fast, free, and secure tools that run 100% inside your browser. No uploads, no waiting.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for a tool..."
                        className="pl-10 h-12 text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 h-auto md:h-12 flex-wrap">
                        {categories.map(cat => (
                             <TabsTrigger key={cat} value={cat} className="h-full">{cat}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool, i) => (
                    <motion.div
                        key={tool.href}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                    >
                        <Link href={tool.href} className="h-full block">
                            <Card className="hover:shadow-strong transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-full group hover:-translate-y-1">
                                <CardHeader className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium mb-4">
                                            <tool.icon className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                        <span className="text-xs font-semibold text-primary">{tool.category}</span>
                                    </div>
                                    <CardTitle className="text-xl">
                                        {tool.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {tool.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full mt-auto" variant={tool.variant}>
                                        Open Tool <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>
             {filteredTools.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-muted-foreground">No tools found matching your criteria.</p>
                </div>
            )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
            <section>
                <h2 className="text-3xl font-bold text-center mb-10">Why Use Our Tools?</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {generalFeatures.map(feature => (
                         <div key={feature.title} className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-medium">
                                <feature.icon className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
             <section>
                <h2 className="text-3xl font-bold text-center mb-10">Privacy-First By Design</h2>
                 <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">Unlike other online tools that upload your files to their servers, our suite operates entirely within your browser. This client-side approach means your sensitive data—whether it's a personal photo, a confidential document, or a business plan—never leaves your computer. This eliminates privacy risks, data leaks, and wait times for uploads, offering you peace of mind and unparalleled speed. It's the modern, secure way to get things done online.</p>
                    </CardContent>
                </Card>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map(item => (
                        <AccordionItem value={item.q} key={item.q}>
                            <AccordionTrigger>{item.q}</AccordionTrigger>
                            <AccordionContent>{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
        </div>
    </div>
  );
}
