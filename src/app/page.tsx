
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Palette,
  ShoppingBag,
  Building2,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Users,
  Gamepad2,
} from "lucide-react";

const Home = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Modern, responsive websites built with latest technologies",
      link: "/esystemlk",
    },
    {
      icon: Palette,
      title: "Logo & Post Design",
      description: "Professional branding and social media design services",
      link: "/design-services",
    },
    {
      icon: Gamepad2,
      title: "Game Top-up",
      description: "Instantly top up your favorite games like Free Fire",
      link: "/freefire-topup",
    },
    {
      icon: Building2,
      title: "ESystemLK Solutions",
      description: "Complete business systems from Sri Lanka's top developers",
      link: "/esystemlk",
    },
  ];

  const features = [
    { icon: Zap, text: "Fast Delivery" },
    { icon: Shield, text: "Trusted by Many" },
    { icon: Users, text: "6+ Years Experience" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="Hero background"
            fill
            className="object-cover"
            data-ai-hint="abstract background"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                Welcome to Vishwa Vidarshana
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Web Developer
              </span>
              <br />
              <span className="text-foreground">Designer & Entrepreneur</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Bringing your digital vision to life with 6+ years of professional experience
              in web development, creative design, and innovative business solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/about">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  View My Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/esystemlk">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Visit ESystemLK
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Book Appointment
                </Button>
              </Link>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What I <span className="bg-gradient-hero bg-clip-text text-transparent">Offer</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Link key={idx} href={service.link}>
                <Card className="h-full hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
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
                    <div className="flex items-center text-primary text-sm font-medium pt-2">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="bg-gradient-hero bg-clip-text text-transparent">Many Businesses</span>
            </h2>
            <p className="text-muted-foreground">
              Delivering excellence in every project
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((idx) => (
              <Card key={idx} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <CheckCircle key={star} className="h-5 w-5 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    "Outstanding work! Professional, timely, and exceeded all expectations.
                    Highly recommended for any business project."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full"></div>
                    <div>
                      <p className="font-semibold">Happy Client</p>
                      <p className="text-sm text-muted-foreground">Business Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero border-0 shadow-strong">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Start Your Project?
              </h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                Let's discuss how I can help bring your vision to life with professional
                development and design services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Get in Touch
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Learn More About Me
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
