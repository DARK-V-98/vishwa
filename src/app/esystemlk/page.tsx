import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Smartphone,
  ShoppingCart,
  GraduationCap,
  FileText,
  Server,
  Zap,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const ESystemLK = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites built with modern frameworks and best practices",
    },
    {
      icon: Smartphone,
      title: "App Development",
      description: "Native and cross-platform mobile applications",
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Solutions",
      description: "Complete online store systems with payment integration",
    },
    {
      icon: GraduationCap,
      title: "Learning Management Systems",
      description: "Educational platforms for schools and training centers",
    },
    {
      icon: FileText,
      title: "Content Management",
      description: "Easy-to-use CMS solutions for your business",
    },
    {
      icon: Server,
      title: "Hosting & Maintenance",
      description: "Reliable hosting and ongoing technical support",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising quality",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and reliability standards",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Sri Lanka's top developers at your service",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                Software Company
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                ESystemLK
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A premier software development business delivering world-class digital solutions, handled by a top developer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Request Quotation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="bg-gradient-hero bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive software solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, idx) => (
              <Card
                key={idx}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-strong transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all">
                    <service.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">ESystemLK</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-strong">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="bg-gradient-hero bg-clip-text text-transparent">Portfolio</span>
            </h2>
            <p className="text-muted-foreground">
              Showcasing our successful projects and satisfied clients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <Card
                key={idx}
                className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-strong transition-all group"
              >
                <div className="aspect-video bg-gradient-primary relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-primary-foreground text-4xl font-bold opacity-50">
                    Project {idx}
                  </div>
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    Client Project {idx}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Professional web application with custom features
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero border-0 shadow-strong max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Build Your Next Project?
              </h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                Let's discuss your requirements and create a custom solution that drives
                your business forward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Request Quotation
                </Button>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Contact Our Team
                  </Button>
                </Link>
              </div>
              
              {/* Company Info */}
              <div className="pt-8 border-t border-primary-foreground/20 text-primary-foreground/80 text-sm">
                <p>Email: info@esystemlk.com | Phone: +94 XX XXX XXXX</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ESystemLK;
