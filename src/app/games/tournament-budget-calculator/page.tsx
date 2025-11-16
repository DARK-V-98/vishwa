
'use client';

import { useState } from 'react';
import PageOneSetup from '@/components/games/budget-calculator/page-one-setup';
import PageTwoBreakdown from '@/components/games/budget-calculator/page-two-breakdown';
import PageThreeSummary from '@/components/games/budget-calculator/page-three-summary';
import { Coins } from "lucide-react";
import type { TournamentBudget } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function TournamentBudgetCalculatorPage() {
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState<Partial<TournamentBudget>>({});

    const goToNextStep = (data: Partial<TournamentBudget>) => {
        setBudget(prev => ({ ...prev, ...data }));
        setStep(prevStep => prevStep + 1);
    };

    const goToPrevStep = (data?: Partial<TournamentBudget>) => {
        if (data) {
            setBudget(prev => ({ ...prev, ...data }));
        }
        setStep(prevStep => prevStep - 1);
    }
    
    const restart = () => {
        setBudget({});
        setStep(1);
    }

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -50 },
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5,
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <section className="pt-24 pb-12 md:pt-32 md:pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-block">
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                                Financial Planning
                            </span>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-strong">
                                <Coins className="h-12 w-12 text-primary-foreground" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold">
                            <span className="bg-gradient-hero bg-clip-text text-transparent">
                                Tournament Budget Calculator
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Plan your next e-sports event with precision. This tool helps you estimate income, manage expenses, and determine profitability.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial="initial"
                            animate="in"
                            exit="out"
                            variants={pageVariants}
                            transition={pageTransition}
                        >
                            {step === 1 && <PageOneSetup onNext={goToNextStep} initialData={budget} />}
                            {step === 2 && <PageTwoBreakdown onNext={goToNextStep} onBack={goToPrevStep} initialData={budget} />}
                            {step === 3 && <PageThreeSummary onBack={goToPrevStep} initialData={budget} onRestart={restart} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
