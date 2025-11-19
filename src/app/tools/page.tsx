
'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Hammer, Lock, Zap, ServerOff, FileType, FileQuestion } from "lucide-react";
import ImagePdfConverter from "@/components/tools/ImagePdfConverter";

export default function ToolsPage() {
    const faqs = [
        { q: "Is this tool free to use?", a: "Yes, our Image-PDF Converter is completely free for everyone to use." },
        { q: "Do you store my files?", a: "No. All conversions happen locally in your browser. Your files are never uploaded to our servers, ensuring your privacy." },
        { q: "What file formats are supported?", a: "For image-to-PDF, you can upload JPG, and PNG files. For PDF-to-image, you can upload any standard PDF document." },
        { q: "Is there a limit on file size or number of files?", a: "There are no hard limits imposed by us, but performance may vary depending on your device's memory and the size/number of files you are converting." },
        { q: "Do I need to install any software?", a: "No software installation is required. The tool runs entirely in your web browser." },
        { q: "How secure is this converter?", a: "Since your files are not uploaded to any server, it is one of the most secure ways to convert documents. Your data remains on your computer." },
    ];

    const benefits = [
        { icon: Lock, title: "100% Secure & Private", description: "Your files never leave your device. All processing is done in your browser." },
        { icon: Zap, title: "Lightning Fast", description: "Conversions are almost instant, with no upload/download delays." },
        { icon: ServerOff, title: "Works Offline", description: "Once the page is loaded, the tool can work even without an internet connection." },
        { icon: FileType, title: "Versatile Formats", description: "Easily switch between converting images to PDF and PDF pages to images." },
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            {/* Hero Section */}
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
                                Online Tools
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Fast. Secure. Browser-Based. Your files are never uploaded.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8">
                        <ImagePdfConverter />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-12 md:py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-8 space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2"><Hammer className="text-primary" /> About The Tool</h2>
                            <p className="text-muted-foreground">
                                Our Image-PDF Converter is a powerful, free online utility designed with your privacy and efficiency in mind. Unlike other online converters, this tool leverages the power of your own browser to perform all conversions. This means your files are never sent over the internet to a server. Whether you need to combine multiple photos into a single PDF document for a report, or extract pages from a PDF as individual images, our tool handles it instantly and securely.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
            
            {/* Benefits Section */}
             <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Why Use Our Converter?</h2>
                        <p className="text-muted-foreground">Experience the benefits of client-side processing.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map(benefit => (
                            <Card key={benefit.title} className="text-center border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-medium transition-shadow">
                                <CardContent className="p-6 space-y-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto shadow-medium">
                                        <benefit.icon className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                    <h3 className="font-semibold">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* FAQs Section */}
            <section className="py-12 md:py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                            <FileQuestion className="text-primary"/> Frequently Asked Questions
                        </h2>
                    </div>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, i) => (
                                <AccordionItem value={`item-${i}`} key={i}>
                                    <AccordionTrigger>{faq.q}</AccordionTrigger>
                                    <AccordionContent>{faq.a}</AccordionContent>
                                </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
