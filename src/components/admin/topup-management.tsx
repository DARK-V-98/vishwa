
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useStorage } from '@/firebase';
import { collection, query, orderBy, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon, PlusCircle, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface TopupPackage {
  id: string;
  name: string;
  price: number;
  category: 'Gems' | 'Membership' | 'Other';
  imageUrl?: string;
  order: number;
}

const packageCategories = ['Gems', 'Membership', 'Other'] as const;

export default function TopupManagement() {
  const firestore = useFirestore();
  const storage = useStorage();
  const packagesCollection = useMemoFirebase(() => collection(firestore, 'topupPackages'), [firestore]);
  const packagesQuery = useMemoFirebase(() => query(packagesCollection, orderBy('order')), [packagesCollection]);
  const { data: packages, isLoading, error } = useCollection<Omit<TopupPackage, 'id'>>(packagesQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TopupPackage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Gems' as const,
    imageUrl: '',
    order: 0,
  });

  const handleOpenDialog = (pkg: TopupPackage | null = null) => {
    setEditingPackage(pkg);
    setSelectedFile(null);
    if (pkg) {
      setFormData({
        name: pkg.name,
        price: String(pkg.price),
        category: pkg.category,
        imageUrl: pkg.imageUrl || '',
        order: pkg.order,
      });
      setImagePreview(pkg.imageUrl || null);
    } else {
      // Reset for new package
      setFormData({
        name: '',
        price: '',
        category: 'Gems' as const,
        imageUrl: '',
        order: packages ? packages.length + 1 : 1,
      });
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: 'Gems' | 'Membership' | 'Other') => {
      setFormData(prev => ({ ...prev, category: value }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `topup-packages/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = formData.imageUrl;

    try {
        if (selectedFile) {
            finalImageUrl = await uploadImage(selectedFile);
        }

        const dataToSave = {
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          imageUrl: finalImageUrl,
          order: Number(formData.order),
          updatedAt: serverTimestamp(),
        };

        if (isNaN(dataToSave.price) || isNaN(dataToSave.order)) {
            toast.error("Price and Order must be valid numbers.");
            setIsSubmitting(false);
            return;
        }

      if (editingPackage) {
        // Update existing package
        const packageDoc = doc(firestore, 'topupPackages', editingPackage.id);
        await updateDoc(packageDoc, dataToSave);
        toast.success(`Package "${dataToSave.name}" updated successfully.`);
      } else {
        // Create new package
        await addDoc(packagesCollection, {
            ...dataToSave,
            createdAt: serverTimestamp(),
        });
        toast.success(`Package "${dataToSave.name}" created successfully.`);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (pkg: TopupPackage) => {
    if (!window.confirm(`Are you sure you want to delete the package "${pkg.name}"?`)) return;

    try {
        const packageDoc = doc(firestore, 'topupPackages', pkg.id);
        await deleteDoc(packageDoc);
        toast.success("Package deleted successfully.");
    } catch (err: any) {
        toast.error(`Failed to delete package: ${err.message}`);
    }
  }
  
  const isValidUrl = (url: string | undefined): url is string => {
    return typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Top-up Packages</h2>
          <p className="text-muted-foreground">Add, edit, or remove packages for the Free Fire store.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Package
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      )}

      {error && <p className="text-destructive">Error loading packages: {error.message}</p>}

      {!isLoading && packages && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map(pkg => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader className="text-center">
                 <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-lg bg-muted mb-2 relative">
                    {isValidUrl(pkg.imageUrl) ? (
                        <Image src={pkg.imageUrl} alt={pkg.name} width={64} height={64} className="object-contain" />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                 </div>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>LKR {pkg.price.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenDialog(pkg)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
                <DialogDescription>Fill in the details for the top-up package.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Package Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g., 115 Diamonds" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (LKR)</Label>
                        <Input id="price" name="price" type="number" value={formData.price} onChange={handleFormChange} placeholder="e.g., 200" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input id="order" name="order" type="number" value={formData.order} onChange={handleFormChange} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select onValueChange={handleCategoryChange} value={formData.category}>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                            {packageCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="image">Package Image</Label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted relative">
                           {isValidUrl(imagePreview) ? (
                             <Image src={imagePreview} alt="Preview" fill className="object-contain rounded-md" />
                           ) : (
                            <div className="text-center text-muted-foreground">
                                <ImageIcon className="mx-auto h-8 w-8" />
                                <p className="text-xs">Preview</p>
                            </div>
                           )}
                        </div>
                        <Input id="image" type="file" onChange={handleFileChange} accept="image/*" className="flex-1" />
                    </div>
                </div>
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Package'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
