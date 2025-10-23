
'use client';

import { collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import { MoreHorizontal, PlusCircle, Edit, Save, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getPricingFirestore } from '@/firebase/pricing-service';

interface Tier {
    name: string;
    price: string;
    features: string[];
}
  
interface Service {
    name: string;
    tiers: Tier[];
}

export default function DesignPricingManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddTierDialogOpen, setIsAddTierDialogOpen] = useState(false);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editedService, setEditedService] = useState<Service | null>(null);

  const [newTier, setNewTier] = useState({name: '', price: '', features: ''});

  const pricingFirestore = getPricingFirestore();

  async function fetchDesignPricing() {
    if (!pricingFirestore) {
        setError("Pricing database not configured.");
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const designServicesDocRef = doc(pricingFirestore, 'pricing', 'design-services');
        const docSnap = await getDoc(designServicesDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setServices(data.services || []);
        } else {
            setError("'design-services' document not found in pricing database.");
        }
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDesignPricing();
  }, [pricingFirestore]);


  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setEditedService(JSON.parse(JSON.stringify(service))); // Deep copy
    setIsEditDialogOpen(true);
  };
  
  const handleFieldChange = (tierIndex: number, field: 'name' | 'price' | 'features', value: string) => {
    if (!editedService) return;
    const updatedTiers = [...editedService.tiers];
    if (field === 'features') {
        updatedTiers[tierIndex][field] = value.split('\n');
    } else {
        updatedTiers[tierIndex][field] = value;
    }
    setEditedService({ ...editedService, tiers: updatedTiers });
  };

  const handleSaveChanges = async () => {
    if (!editedService || !pricingFirestore) return;

    const updatedServices = services.map(s => s.name === editedService.name ? editedService : s);

    const categoryRef = doc(pricingFirestore, 'pricing', 'design-services');

    try {
        await updateDoc(categoryRef, { services: updatedServices });
        toast.success("Pricing updated successfully!");
        setServices(updatedServices);
        setIsEditDialogOpen(false);
        setSelectedService(null);
    } catch (err: any) {
        toast.error("Failed to update pricing:", err.message);
    }
  };

  const handleAddTier = async () => {
    if (!selectedService || !pricingFirestore || !newTier.name || !newTier.price) {
        toast.error("Tier Name and Price are required.");
        return;
    }
    const tierToAdd = {
        name: newTier.name,
        price: newTier.price,
        features: newTier.features.split('\n').filter(f => f.trim() !== ''),
    };

    const updatedService = { ...selectedService, tiers: [...selectedService.tiers, tierToAdd]};
    const updatedServices = services.map(s => s.name === selectedService.name ? updatedService : s);
    const categoryRef = doc(pricingFirestore, 'pricing', 'design-services');

    try {
        await updateDoc(categoryRef, { services: updatedServices });
        toast.success("Tier added successfully!");
        setServices(updatedServices);
        setIsAddTierDialogOpen(false);
        setNewTier({name: '', price: '', features: ''});
    } catch (e: any) {
        toast.error("Failed to add tier:", e.message);
    }
  };

  const handleDeleteTier = async (serviceName: string, tierNameToDelete: string) => {
    if (!pricingFirestore || !editedService) return;
    
    const updatedTiers = editedService.tiers.filter(t => t.name !== tierNameToDelete);
    const updatedService = { ...editedService, tiers: updatedTiers };
    
    setEditedService(updatedService);

    const allServicesUpdated = services.map(s => s.name === serviceName ? updatedService : s);

    const categoryRef = doc(pricingFirestore, 'pricing', 'design-services');
    try {
        await updateDoc(categoryRef, { services: allServicesUpdated });
        toast.success("Tier deleted successfully!");
        setServices(allServicesUpdated);
    } catch (e: any) {
        toast.error("Failed to delete tier:", e.message);
    }
  }

  const seedDummyData = async () => {
    if (!pricingFirestore) {
      toast.error("Pricing database not available.");
      return;
    }

    const dummyServices: Service[] = [
      {
        name: "Logo Design",
        tiers: [
          { name: "Basic", price: "Rs. 5,000", features: ["2 Logo Concepts", "High-Resolution Files", "2 Revisions"] },
          { name: "Standard", price: "Rs. 10,000", features: ["3 Logo Concepts", "Vector Files (AI, EPS)", "5 Revisions", "Social Media Kit"] },
          { name: "Premium", price: "Rs. 20,000", features: ["5 Logo Concepts", "Full Branding Guide", "Unlimited Revisions", "Priority Support"] }
        ]
      },
      {
        name: "Social Media Post",
        tiers: [
          { name: "Single Post", price: "Rs. 2,500", features: ["1 Custom Post Design", "Source File (PSD/AI)", "2 Revisions"] },
          { name: "5-Post Pack", price: "Rs. 10,000", features: ["5 Custom Post Designs", "Source Files", "5 Revisions"] }
        ]
      }
    ];

    try {
      const designServicesDocRef = doc(pricingFirestore, 'pricing', 'design-services');
      await updateDoc(designServicesDocRef, { services: dummyServices });
      setServices(dummyServices);
      toast.success("Dummy design pricing data has been seeded!");
    } catch (error: any) {
      toast.error("Failed to seed dummy data: " + error.message);
    }
  };

  if (isLoading) {
      return (
        <Card>
            <CardHeader><CardTitle>Design Service Pricing</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            </CardContent>
        </Card>
      );
  }

  if (error) return <p>Error loading pricing data: {error}</p>;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Design Service Packages</CardTitle>
                <CardDescription>
                    Manage packages for Logo Design and Social Media Posts.
                </CardDescription>
            </div>
            <Button onClick={seedDummyData} variant="secondary">Seed Dummy Data</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Tiers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services?.map((service) => (
                <TableRow key={service.name}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.tiers.map(t => `${t.name} (${t.price})`).join(', ')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tiers
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => { setSelectedService(service); setIsAddTierDialogOpen(true); }}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Tier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Tiers Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl">
              <DialogHeader>
                  <DialogTitle>Edit Tiers for: {editedService?.name}</DialogTitle>
                  <DialogDescription>
                      Update the details for each tier. Use a new line for each feature.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
                  {editedService?.tiers.map((tier, tierIndex) => (
                      <Card key={tierIndex} className="p-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold mb-2 text-lg">{tier.name}</h4>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTier(editedService.name, tier.name)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`name-${tierIndex}`}>Tier Name</Label>
                                <Input 
                                    id={`name-${tierIndex}`}
                                    value={tier.name}
                                    onChange={(e) => handleFieldChange(tierIndex, 'name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`price-${tierIndex}`}>Price</Label>
                                <Input 
                                    id={`price-${tierIndex}`}
                                    value={tier.price}
                                    onChange={(e) => handleFieldChange(tierIndex, 'price', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <Label htmlFor={`features-${tierIndex}`}>Features (one per line)</Label>
                            <Textarea
                                id={`features-${tierIndex}`}
                                value={tier.features.join('\n')}
                                onChange={(e) => handleFieldChange(tierIndex, 'features', e.target.value)}
                                rows={4}
                            />
                        </div>
                      </Card>
                  ))}
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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

      {/* Add Tier Dialog */}
       <Dialog open={isAddTierDialogOpen} onOpenChange={setIsAddTierDialogOpen}>
          <DialogContent className="max-w-lg">
              <DialogHeader>
                  <DialogTitle>Add New Tier to: {selectedService?.name}</DialogTitle>
                  <DialogDescription>
                      Define a new package for this design service.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-tier-name">Tier Name</Label>
                        <Input id="new-tier-name" value={newTier.name} onChange={e => setNewTier({...newTier, name: e.target.value})} placeholder="e.g., Premium Package" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-tier-price">Price</Label>
                        <Input id="new-tier-price" value={newTier.price} onChange={e => setNewTier({...newTier, price: e.target.value})} placeholder="e.g., Rs. 15,000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-tier-features">Features (one per line)</Label>
                        <Textarea id="new-tier-features" value={newTier.features} onChange={e => setNewTier({...newTier, features: e.target.value})} placeholder="Feature 1&#x0a;Feature 2" rows={4}/>
                    </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTierDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTier}>Add Tier</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
