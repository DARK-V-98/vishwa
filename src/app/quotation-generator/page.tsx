

'use client';

import { useState, useEffect, useMemo, useActionState } from 'react';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Download, FileText, Sparkles } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generateQuotation } from '@/ai/flows/automated-quotation-generation';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { FirebasePricingProvider, usePricingDb } from '@/firebase/pricing-provider';


// Type definitions based on the guide
interface Tier {
  name: string;
  price: string;
}

interface Addon extends Tier {}

interface Service {
  name: string;
  enabled: boolean;
  tiers: Tier[];
  addons?: Addon[];
}

interface PricingCategory {
  id: string;
  category: string;
  icon: string;
  enabled: boolean;
  order: number;
  services: Service[];
}

interface CommonAddons {
  id: string;
  category: string;
  icon: string;
  enabled: boolean;
  items: Addon[];
}

const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    // Remove "Rs. ", commas, and then parse.
    const numberString = priceString.replace(/Rs\.\s*|,/g, '');
    return parseFloat(numberString) || 0;
};


interface FormState {
    message: string;
    quotation?: string;
    isError: boolean;
}
  
const initialState: FormState = {
    message: "",
    isError: false,
};

function SubmitButton({ disabled }: { disabled: boolean }) {
    const [pending, setPending] = useState(false);

    const handleClick = () => {
        if (!disabled) {
            setPending(true);
        }
    }
  
    return (
      <Button type="submit" className="w-full" disabled={disabled || pending} onClick={handleClick}>
        <Sparkles className="mr-2 h-4 w-4" />
        {pending ? 'Generating...' : 'Generate & Save Quotation'}
      </Button>
    );
}

function QuotationGeneratorContent() {
  const mainFirestore = useFirestore();
  const pricingFirestore = usePricingDb();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const [pricingData, setPricingData] = useState<PricingCategory[]>([]);
  const [commonAddons, setCommonAddons] = useState<CommonAddons | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [selectedCommonAddons, setSelectedCommonAddons] = useState<Addon[]>([]);
  
  async function handleAIQuotation(prevState: FormState, formData: FormData): Promise<FormState> {
    if (isUserLoading) {
      return { message: "Please wait while we verify your session.", isError: true };
    }
    if (!user) {
        toast.error("You must be logged in to generate a quotation.", {
            action: {
              label: "Sign In",
              onClick: () => router.push('/auth'),
            },
        });
        return { message: "Authentication required.", isError: true };
    }
    if (!selectedTier) {
      return { message: 'Please select a pricing tier before generating a quotation.', isError: true };
    }
  
    const quotationInput = {
      category: selectedCategory,
      service: selectedService,
      tier: selectedTier,
      addons: selectedAddons,
      commonAddons: selectedCommonAddons,
      total: total,
    };
  
    try {
      // 1. Generate Quotation Markdown from AI
      const result = await generateQuotation(quotationInput);
      const quotationMarkdown = result.quotation;

      // 2. Save the project to Firestore (using the main firestore instance)
      const projectsCollection = collection(mainFirestore, 'projects');
      await addDoc(projectsCollection, {
        clientId: user.uid,
        clientName: user.displayName || user.email,
        clientEmail: user.email,
        serviceCategory: selectedCategory,
        serviceName: selectedService,
        tier: selectedTier,
        addons: selectedAddons.concat(selectedCommonAddons),
        total: total,
        quotationMarkdown: quotationMarkdown,
        status: "In Review",
        progress: 0,
        updates: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Quotation generated and project saved!");
      router.push('/dashboard'); // Redirect to the dashboard

      return {
        message: 'AI quotation generated successfully!',
        quotation: quotationMarkdown,
        isError: false,
      };
    } catch (error) {
      console.error('AI Quotation or Firestore Error:', error);
      return {
        message: 'There was an error processing your request. Please try again.',
        isError: true,
      };
    }
  }

  const [state, formAction] = useActionState(handleAIQuotation, initialState);

  useEffect(() => {
    if (state.message && !state.isError && state.quotation) {
        // Success is handled via toast and redirect in the action
    } else if (state.message && state.isError) {
      toast.error(state.message);
    }
  }, [state]);

  const handleDownloadPdf = () => {
    const input = document.getElementById('quotation-content');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;

        if (height > pdfHeight) {
            console.warn("Content might be too long for a single PDF page.");
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save('quotation.pdf');
      });
    }
  };

  useEffect(() => {
    async function getPricingData() {
      if (!pricingFirestore) {
          setError("Pricing database is not configured.");
          setLoading(false);
          return;
      };
      setLoading(true);
      try {
        const pricingCollection = collection(pricingFirestore, 'pricing');
        const q = query(pricingCollection, orderBy('order'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          throw new Error("No pricing data found. Please check the 'pricing' collection in Firestore.");
        }

        const allData: any[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((category) => category.enabled);

        const commonAddonsDoc = allData.find((d) => d.id === 'common-addons') as CommonAddons | undefined;
        setCommonAddons(commonAddonsDoc || null);

        const serviceCategories = allData
          .filter((d) => d.id !== 'common-addons')
          .map((category) => {
            if (category.services) {
              category.services = category.services.filter((service: Service) => service.enabled);
            }
            return category;
          })
          .filter((category) => category.services && category.services.length > 0) as PricingCategory[];
        
        setPricingData(serviceCategories);
      } catch (e: any) {
        console.error("Failed to fetch pricing data:", e);
        setError(e.message || "An unexpected error occurred while fetching pricing data.");
      } finally {
        setLoading(false);
      }
    }

    if (pricingFirestore) {
      getPricingData();
    }
  }, [pricingFirestore]);

  const currentService = useMemo(() => {
    return pricingData
      .find((c) => c.category === selectedCategory)
      ?.services.find((s) => s.name === selectedService);
  }, [pricingData, selectedCategory, selectedService]);

  const total = useMemo(() => {
    let newTotal = 0;
    if (selectedTier) {
      newTotal += parsePrice(selectedTier.price);
    }
    selectedAddons.forEach((addon) => (newTotal += parsePrice(addon.price)));
    selectedCommonAddons.forEach((addon) => (newTotal += parsePrice(addon.price)));
    return newTotal;
  }, [selectedTier, selectedAddons, selectedCommonAddons]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedService('');
    setSelectedTier(null);
    setSelectedAddons([]);
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setSelectedTier(null);
    setSelectedAddons([]);
  };
  
  const handleTierChange = (tierName: string) => {
    const tier = currentService?.tiers.find(t => t.name === tierName);
    setSelectedTier(tier || null);
  }

  const handleAddonChange = (addon: Addon, isChecked: boolean) => {
    setSelectedAddons(prev => 
      isChecked ? [...prev, addon] : prev.filter(a => a.name !== addon.name)
    );
  }

  const handleCommonAddonChange = (addon: Addon, isChecked: boolean) => {
    setSelectedCommonAddons(prev => 
      isChecked ? [...prev, addon] : prev.filter(a => a.name !== addon.name)
    );
  }

  if (loading || isUserLoading) {
    return (
      <div className="container py-12 pt-24">
        <div className="text-center mb-12">
            <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                 <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                 </CardContent>
                 <CardFooter>
                    <Skeleton className="h-12 w-full" />
                 </CardFooter>
            </Card>
        </div>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="container py-12 pt-24">
         <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Quotation Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Build your project quote by selecting from the available services and add-ons below. A project will be created for you to track its progress.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Category */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Choose a Service Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent>
                  {pricingData.map((cat) => (
                    <SelectItem key={cat.id} value={cat.category}>{cat.category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Step 2: Service */}
          {selectedCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Select a Specific Service</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleServiceChange} value={selectedService}>
                  <SelectTrigger><SelectValue placeholder="Select a service..." /></SelectTrigger>
                  <SelectContent>
                    {pricingData.find(c => c.category === selectedCategory)?.services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>{service.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Tier */}
          {currentService && (
            <Card>
              <CardHeader><CardTitle>Step 3: Select a Package Tier</CardTitle></CardHeader>
              <CardContent>
                 <RadioGroup onValueChange={handleTierChange} value={selectedTier?.name}>
                    {currentService.tiers.map(tier => (
                        <Card key={tier.name} className="p-4 flex items-center justify-between">
                            <Label htmlFor={tier.name} className="flex flex-col gap-1 cursor-pointer">
                                <span className="font-bold">{tier.name}</span>
                                <span className="text-primary">{tier.price}</span>
                            </Label>
                             <RadioGroupItem value={tier.name} id={tier.name} />
                        </Card>
                    ))}
                 </RadioGroup>
              </CardContent>
            </Card>
          )}
          
          {/* Step 4: Add-ons */}
          <div className="grid md:grid-cols-2 gap-8">
            {currentService?.addons && currentService.addons.length > 0 && (
                 <Card>
                    <CardHeader><CardTitle>Service Add-ons</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {currentService.addons.map(addon => (
                             <div key={addon.name} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`addon-${addon.name}`} 
                                    onCheckedChange={(checked) => handleAddonChange(addon, !!checked)}
                                    checked={selectedAddons.some(a => a.name === addon.name)}
                                />
                                <Label htmlFor={`addon-${addon.name}`} className="flex justify-between w-full cursor-pointer">
                                    <span>{addon.name}</span>
                                    <span className="text-muted-foreground">{addon.price}</span>
                                </Label>
                             </div>
                        ))}
                    </CardContent>
                 </Card>
            )}
            {commonAddons && commonAddons.items.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Common Add-ons</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {commonAddons.items.map(addon => (
                            <div key={addon.name} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`common-addon-${addon.name}`}
                                    onCheckedChange={(checked) => handleCommonAddonChange(addon, !!checked)}
                                    checked={selectedCommonAddons.some(a => a.name === addon.name)}
                                />
                                <Label htmlFor={`common-addon-${addon.name}`} className="flex justify-between w-full cursor-pointer">
                                    <span>{addon.name}</span>
                                    <span className="text-muted-foreground">{addon.price}</span>
                                </Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
           </div>

        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="sticky top-24">
            <form action={formAction}>
              <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle>Quotation Summary</CardTitle>
                      <CardDescription>Your estimated project cost.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {selectedTier ? (
                          <div className="flex justify-between">
                              <span className="font-semibold">{selectedTier.name}</span>
                              <span>{selectedTier.price}</span>
                          </div>
                      ) : (
                          <p className="text-muted-foreground text-sm">Please select a service and tier.</p>
                      )}
                      {(selectedAddons.length > 0 || selectedCommonAddons.length > 0) && (
                          <div className="border-t pt-4 mt-4 space-y-2">
                              <h4 className="font-semibold">Add-ons:</h4>
                              {selectedAddons.map(addon => (
                                  <div key={addon.name} className="flex justify-between text-sm">
                                      <span>{addon.name}</span>
                                      <span>{addon.price}</span>
                                  </div>
                              ))}
                              {selectedCommonAddons.map(addon => (
                                  <div key={addon.name} className="flex justify-between text-sm">
                                      <span>{addon.name}</span>
                                      <span>{addon.price}</span>
                                  </div>
                              ))}
                          </div>
                      )}
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                      <div className="flex justify-between w-full text-2xl font-bold border-t pt-4">
                          <span>Total:</span>
                          <span>Rs. {total.toLocaleString()}</span>
                      </div>
                      <SubmitButton disabled={!selectedTier || isUserLoading} />
                  </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function QuotationGeneratorPage() {
    return (
        <FirebasePricingProvider>
            <QuotationGeneratorContent />
        </FirebasePricingProvider>
    )
}
