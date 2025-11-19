
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileImage,
  ImageIcon,
  Lock,
  UtilityPole,
  ArrowRight,
  Search,
  Maximize,
  Crop,
  FileLock,
  QrCode,
  Barcode,
  KeyRound,
  ScanLine
} from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';

const allTools = [
  {
    title: "PDF Tools Suite",
    description: "Convert PDFs to images or combine images into a single PDF, all securely in your browser.",
    href: "/tools/pdf-suite",
    icon: FileImage,
    category: "PDF",
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

const categories = ["All", "PDF", "Image", "Security", "Utility"];

export default function ToolsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredTools = allTools.filter(tool => {
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                Online Tools Collection
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A suite of free, fast, and secure tools that run 100% inside your browser. No uploads, no waiting.
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
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-12">
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
    </div>
  );
}
