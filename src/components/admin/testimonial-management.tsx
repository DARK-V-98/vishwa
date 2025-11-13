
'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon, PlusCircle, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  message: string;
  imageUrl: string;
  rating: number;
  createdAt: { seconds: number };
}

export default function TestimonialManagement() {
  const firestore = useFirestore();
  const storage = useStorage();
  const testimonialsCollection = useMemoFirebase(() => collection(firestore, 'testimonials'), [firestore]);
  const testimonialsQuery = useMemoFirebase(() => query(testimonialsCollection, orderBy('createdAt', 'desc')), [testimonialsCollection]);
  const { data: testimonials, isLoading, error } = useCollection<Omit<Testimonial, 'id'>>(testimonialsQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    message: '',
    rating: '5',
    imageUrl: '',
  });

  const handleOpenDialog = (testimonial: Testimonial | null = null) => {
    setEditingTestimonial(testimonial);
    setSelectedFile(null);
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        position: testimonial.position,
        message: testimonial.message,
        rating: String(testimonial.rating),
        imageUrl: testimonial.imageUrl || '',
      });
      setImagePreview(testimonial.imageUrl || null);
    } else {
      setFormData({ name: '', position: '', message: '', rating: '5', imageUrl: '' });
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `testimonials/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = formData.imageUrl;

    try {
      if (selectedFile) {
        finalImageUrl = await uploadImage(selectedFile);
      }
      
      if (!finalImageUrl) {
        toast.error("An image is required for the testimonial.");
        setIsSubmitting(false);
        return;
      }

      const dataToSave = {
        name: formData.name,
        position: formData.position,
        message: formData.message,
        rating: parseInt(formData.rating, 10),
        imageUrl: finalImageUrl,
      };

      if (isNaN(dataToSave.rating) || dataToSave.rating < 1 || dataToSave.rating > 5) {
        toast.error("Rating must be a number between 1 and 5.");
        setIsSubmitting(false);
        return;
      }

      if (editingTestimonial) {
        const testimonialDoc = doc(firestore, 'testimonials', editingTestimonial.id);
        await updateDoc(testimonialDoc, { ...dataToSave, updatedAt: serverTimestamp() });
        toast.success(`Testimonial from "${dataToSave.name}" updated successfully.`);
      } else {
        await addDoc(testimonialsCollection, { ...dataToSave, createdAt: serverTimestamp() });
        toast.success(`Testimonial from "${dataToSave.name}" created successfully.`);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial from "${testimonial.name}"?`)) return;
    try {
      await deleteDoc(doc(firestore, 'testimonials', testimonial.id));
      toast.success("Testimonial deleted successfully.");
    } catch (err: any) {
      toast.error(`Failed to delete testimonial: ${err.message}`);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Testimonials</h2>
          <p className="text-muted-foreground">Add, edit, or remove customer testimonials.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      )}

      {error && <p className="text-destructive">Error loading testimonials: {error.message}</p>}

      {!isLoading && testimonials && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(item => (
            <Card key={item.id} className="flex flex-col">
              <CardContent className="p-6 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={item.imageUrl} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.position}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < item.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground'}`}/>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{item.message}"</p>
              </CardContent>
              <CardFooter className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenDialog(item)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            <DialogDescription>Fill in the client's details and feedback.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position / Company</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleFormChange} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" name="rating" type="number" min="1" max="5" value={formData.rating} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Testimonial Message</Label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleFormChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Client Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={imagePreview || undefined} />
                  <AvatarFallback><ImageIcon/></AvatarFallback>
                </Avatar>
                <Input id="image" type="file" onChange={handleFileChange} accept="image/*" className="flex-1" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Testimonial'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
