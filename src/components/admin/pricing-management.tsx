
'use client';

import { collection, query, orderBy, doc, updateDoc, getDocs } from 'firebase/firestore';
import { MoreHorizontal, PlusCircle, Edit, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useFirestore } from '@/firebase';

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

export default function PricingManagement() {
  const [pricingData, setPricingData] = useState<PricingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PricingCategory | null>(null);
  const [editedServices, setEditedServices] = useState<Service[]>([]);
  const firestore = useFirestore();


  useEffect(() => {
    async function fetchPricing() {
        if (!firestore) {
            setError("Pricing database not configured.");
            setIsLoading(false);
            return;
        }
        try {
            const pricingCollection = collection(firestore, 'pricing');
            const q = query(pricingCollection, orderBy('order'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PricingCategory[];
            setPricingData(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }
    if (firestore) {
      fetchPricing();
    }
  }, [firestore]);


  const openEditDialog = (category: PricingCategory) => {
    setSelectedCategory(category);
    setEditedServices(JSON.parse(JSON.stringify(category.services))); // Deep copy
    setIsDialogOpen(true);
  };
  
  const handlePriceChange = (serviceIndex: number, tierIndex: number, newPrice: string) => {
    const updatedServices = [...editedServices];
    updatedServices[serviceIndex].tiers[tierIndex].price = newPrice;
    setEditedServices(updatedServices);
  };

  const handleSaveChanges = async () => {
    if (!selectedCategory || !firestore) return;

    const categoryRef = doc(firestore, 'pricing', selectedCategory.id);

    try {
        await updateDoc(categoryRef, {
            services: editedServices
        });
        toast.success("Pricing updated successfully!");
        // Manually update local state to reflect changes instantly
        setPricingData(currentData => currentData.map(cat => 
            cat.id === selectedCategory.id ? { ...cat, services: editedServices } : cat
        ));
        setIsDialogOpen(false);
        setSelectedCategory(null);
    } catch (err: any) {
        toast.error("Failed to update pricing:", err.message);
    }
  };

  if (isLoading) {
      return (
        <Card>
            <CardHeader><CardTitle>Pricing Management</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            </CardContent>
        </Card>
      );
  }

  if (error) return <p>Error loading pricing data: {error}</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Service Pricing</CardTitle>
          <CardDescription>
            Manage prices for all services offered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingData?.filter(cat => cat.id !== 'common-addons').map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.category}</TableCell>
                  <TableCell>{category.services.map(s => s.name).join(', ')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Prices
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
              <DialogHeader>
                  <DialogTitle>Edit Prices for: {selectedCategory?.category}</DialogTitle>
                  <DialogDescription>
                      Update the pricing for each tier. Changes will be reflected live.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
                  {editedServices.map((service, serviceIndex) => (
                      <div key={service.name}>
                          <h4 className="font-semibold mb-2">{service.name}</h4>
                          <div className="space-y-2">
                            {service.tiers.map((tier, tierIndex) => (
                                <div key={tier.name} className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor={`price-${serviceIndex}-${tierIndex}`} className="col-span-1">{tier.name}</Label>
                                    <Input 
                                        id={`price-${serviceIndex}-${tierIndex}`}
                                        value={tier.price}
                                        onChange={(e) => handlePriceChange(serviceIndex, tierIndex, e.target.value)}
                                        className="col-span-2"
                                    />
                                </div>
                            ))}
                          </div>
                      </div>
                  ))}
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
