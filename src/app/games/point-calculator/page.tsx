import PointCalculator from "@/components/games/point-calculator";
import { Gamepad2 } from "lucide-react";

export default function PointCalculatorPage() {
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
                E-Sports Point Calculator
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A fully-featured point calculator for your e-sports tournaments. Customize scoring, manage teams, and export results as professional-looking images.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
            <PointCalculator />
        </div>
      </section>
    </div>
  );
}
