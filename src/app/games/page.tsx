import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
             <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                    Gaming Tools
                </span>
            </div>

            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-strong">
                <Gamepad2 className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Game Center
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A collection of tools and utilities to enhance your gaming and tournament experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
            <Card className="hover:shadow-strong transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Gamepad2 className="text-primary"/>
                        E-Sports Point Calculator
                    </CardTitle>
                    <CardDescription>
                        A fully-featured point calculator for your e-sports tournaments. Customize scoring, manage teams, and export results as professional-looking images.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/games/point-calculator">
                        <Button className="w-full" variant="hero">
                            Open Calculator <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
