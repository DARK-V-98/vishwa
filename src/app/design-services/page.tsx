
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Clock,
  CheckCircle,
  Zap,
  MessageSquare,
  CreditCard,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

interface Tier {
  name: string;
  price: string;
  features: string[];
}

interface Service {
  name: string;
  tiers: Tier[];
}

const DesignServices = () => {
  const [email, setEmail] = useState("");
  const firestore = useFirestore();

  const pricingQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Assuming 'Design Services' is the ID of the document in 'pricing' collection
    return query(collection(firestore, "pricing"));
  }, [firestore]);

  const { data: pricingData, isLoading, error } = useCollection(pricingQuery);
  
  const services = useMemo(() => {
    if (!pricingData) return [];
    const designCategory = pricingData.find(cat => cat.id === 'design-services');
    return designCategory ? designCategory.services : [];
  }, [pricingData]);


  const handleInterest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! We'll contact you soon about design services.");
    setEmail("");
  };

  const process = [
    {
      icon: MessageSquare,
      title: "Fill Design Brief",
      description: "Share your vision, color preferences, and inspirations",
    },
    {
      icon: Clock,
      title: "Schedule Meeting",
      description: "Book a call or online meeting to discuss details",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Receive your design within 2 hours to 2 days",
    },
    {
      icon: CheckCircle,
      title: "Review & Approve",
      description: "Preview with watermark, then get final files after payment",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold border border-secondary/30">
                Creative Solutions
              </span>
            </div>
            
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-strong">
                <Palette className="h-12 w-12 text-accent-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Design Services
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional logo and post design services with lightning-fast delivery.
              From concept to completion in 2 hours to 2 days.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span>Professional Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                <span>Fast Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                <span>Unlimited Revisions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pricing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Design <span className="bg-gradient-accent bg-clip-text text-transparent">Packages</span>
            </h2>
            <p className="text-muted-foreground">
              Choose the perfect package for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {isLoading && [...Array(3)].map((_, idx) => (
              <Card key={idx}><CardContent className="p-8 space-y-6"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-8 w-1/3" /><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
            {!isLoading && services.map((service, serviceIdx) => (
              service.tiers.map((tier, tierIdx) => (
                 <Card
                    key={`${serviceIdx}-${tierIdx}`}
                    className={`border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-strong transition-all ${
                      tier.name === "Social Media Posts" ? "md:scale-105 shadow-medium" : ""
                    }`}
                  >
                    <CardContent className="p-8 space-y-6">
                      {tier.name === "Social Media Posts" && (
                        <div className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-semibold border border-secondary/30">
                          Most Popular
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{service.name}: {tier.name}</h3>
                        <p className="text-3xl font-bold text-primary">{tier.price}</p>
                      </div>
                      <ul className="space-y-3">
                        {(tier.features || []).map((feature: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
              ))
            ))}
          </div>
          {error && <p className="text-center text-destructive mt-4">Error loading pricing: {error.message}</p>}
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="bg-gradient-accent bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-muted-foreground">
              Simple and streamlined design process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {process.map((step, idx) => (
              <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto shadow-strong">
                      <step.icon className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-medium">
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center shadow-medium">
                    <MessageSquare className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Client Chat Area</h3>
                  <p className="text-muted-foreground">
                    Preview your designs with watermark protection in a dedicated chat area.
                    Request changes and collaborate in real-time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center shadow-medium">
                    <CreditCard className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Secure Payment</h3>
                  <p className="text-muted-foreground">
                    Pay securely through integrated payment gateway. Download watermark-free
                    final files immediately after payment confirmation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Register Interest */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-accent border-0 shadow-strong">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <Sparkles className="h-12 w-12 text-accent-foreground mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-accent-foreground/90">
                This service is fully operational. Start an order today!
              </p>
              
              <Link href="/design-studio">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full max-w-md mx-auto"
                >
                  Go to Design Studio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">
              Need Something Else?
            </h3>
            <p className="text-muted-foreground">
              Get in touch to discuss your custom project needs.
            </p>
            <Link href="/contact">
              <Button variant="hero" size="lg">
                Contact Me
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignServices;
