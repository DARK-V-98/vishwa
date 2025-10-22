import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingBag,
  Search,
  Star,
  Shield,
  Truck,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "sonner";

const Marketplace = () => {
  const [email, setEmail] = useState("");

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! We'll notify you when the marketplace launches.");
    setEmail("");
  };

  const features = [
    {
      icon: Search,
      title: "Easy Search & Filter",
      description: "Find exactly what you're looking for with advanced filters",
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Safe payment processing and buyer protection",
    },
    {
      icon: MessageCircle,
      title: "Direct Chat",
      description: "Communicate directly with buyers and sellers",
    },
    {
      icon: Truck,
      title: "Multiple Delivery Options",
      description: "Cash on delivery or secure online payment",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold border border-secondary/30">
                Coming Soon
              </span>
            </div>
            
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-strong">
                <ShoppingBag className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Online Marketplace
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A new platform for buying and selling products, similar to Ikman.lk.
              Register your interest to be notified when we launch!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What to <span className="bg-gradient-hero bg-clip-text text-transparent">Expect</span>
            </h2>
            <p className="text-muted-foreground">
              Powerful features for a seamless buying and selling experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-medium transition-all"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto shadow-medium">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="bg-gradient-hero bg-clip-text text-transparent">Works</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Register & Browse",
                description: "Create your account and explore thousands of products",
              },
              {
                step: "02",
                title: "List or Buy",
                description: "Post items for sale or find what you need",
              },
              {
                step: "03",
                title: "Connect & Trade",
                description: "Chat with buyers/sellers and complete transactions",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-border/50 bg-card/50 backdrop-blur-sm text-center"
              >
                <CardContent className="p-8 space-y-4">
                  <div className="text-5xl font-bold text-primary/20">{item.step}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Notify Me Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-hero border-0 shadow-strong">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <Star className="h-12 w-12 text-primary-foreground mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Be the First to Know
              </h2>
              <p className="text-primary-foreground/90">
                Sign up to receive updates and get early access when we launch
              </p>
              
              <form onSubmit={handleNotify} className="max-w-md mx-auto space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-primary-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Notify Me at Launch
                </Button>
              </form>
              
              <p className="text-sm text-primary-foreground/70">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alternative CTA */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">
              Need Help with Your Business Now?
            </h3>
            <p className="text-muted-foreground">
              While the marketplace is in development, explore our other services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/esystemlk">
                <Button variant="hero" size="lg">
                  ESystemLK Solutions
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
