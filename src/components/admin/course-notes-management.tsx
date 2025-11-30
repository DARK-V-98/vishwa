
'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useStorage, useUser } from '@/firebase';
import { collection, query, orderBy, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, where, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, PlusCircle, Edit, Trash2, KeyRound, Copy, Loader2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { format } from 'date-fns';

interface CourseNote {
  id: string;
  unitNumber: string;
  unitName: string;
  modelCount: string;
  storagePath: string;
  createdAt: { seconds: number };
}

interface AccessCode {
    id: string;
    noteId: string;
    isUsed: boolean;
    usedBy?: string;
    usedAt?: { seconds: number };
    createdAt: { seconds: number };
}

const generateRandomCode = () => {
    return 'NVQ' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

const initialUnits = [
    { no: 'Unit 01', name: 'Client Consultation – ගනුදෙනුකරු සමඟ සාකච්ඡා', models: '1–2' },
    { no: 'Unit 02', name: 'Salon Management – සැලෝන් කළමනාකරණය', models: '1–2' },
    { no: 'Unit 03', name: 'Manicure & Pedicure – නිය සත්කාර සිදු කිරීම', models: '2–3' },
    { no: 'Unit 04', name: 'Facial – සම සදහා සත්කාර කිරීම', models: '2–3' },
    { no: 'Unit 05', name: 'Makeup (Bridal & Special) – වේෂ නිරෑපණ කටයුතු සිදු කිරීම', models: '5–10' },
    { no: 'Unit 06', name: 'Skin Analysis – සම විශ්ලේෂණය', models: '1–2' },
    { no: 'Unit 07', name: 'Tools & Environment Maintenance – උපකරණ සහ පරිසර නඩත්තුව', models: '1' },
    { no: 'Unit 08', name: 'Reception Duties – පිළිගැනීමේ රාජකාරිය', models: '1' },
    { no: 'Unit 09', name: 'Hair Removal – අනවශ්‍ය රෝම් ඉවත් කිරීම', models: '1–2' },
    { no: 'Unit 10', name: 'Etiquette – ආචାର ධර්ම', models: '1' },
    { no: 'Health/Safety', name: 'සෞඛ්‍ය සුරක්ෂිතභාවය', models: '1' },
];


function ManageCodesDialog({ note, open, onOpenChange }: { note: CourseNote | null, open: boolean, onOpenChange: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { roles } = useUser();
    const isAdmin = roles.includes('admin') || roles.includes('developer');
    const [numCodes, setNumCodes] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const codesQuery = useMemoFirebase(() => {
        if (!firestore || !note || !isAdmin) return null;
        return query(collection(firestore, 'accessCodes'), where('noteId', '==', note.id), orderBy('createdAt', 'desc'));
    }, [firestore, note, open, isAdmin]);
    
    const { data: codes, isLoading, forceRefresh } = useCollection<AccessCode>(codesQuery);

    const handleGenerate = async () => {
        if (!note || !firestore || numCodes < 1) return;
        setIsGenerating(true);
        try {
            const batch = writeBatch(firestore);
            for (let i = 0; i < numCodes; i++) {
                const code = generateRandomCode();
                const codeRef = doc(firestore, 'accessCodes', code);
                batch.set(codeRef, {
                    noteId: note.id,
                    isUsed: false,
                    createdAt: serverTimestamp(),
                });
            }
            await batch.commit();
            toast.success(`${numCodes} new access code(s) generated.`);
            forceRefresh();
        } catch (e: any) {
            toast.error(`Failed to generate codes: ${e.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Code copied to clipboard!");
    };
    
    if (!note) return null;
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Manage Access Codes for: {note.unitName}</DialogTitle>
                    <DialogDescription>Generate and view one-time access codes for this course note.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <Input type="number" min="1" value={numCodes} onChange={e => setNumCodes(parseInt(e.target.value))} className="w-24"/>
                        <Button onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4"/>}
                            Generate
                        </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                        <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>Code</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead>Used By</TableHead>
                                   <TableHead>Date Used</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                                {isLoading && <TableRow><TableCell colSpan={4}><Skeleton className="h-8"/></TableCell></TableRow>}
                                {codes?.map(code => (
                                    <TableRow key={code.id}>
                                        <TableCell className="font-mono">
                                            {code.id}
                                            <Button size="icon" variant="ghost" className="h-6 w-6 ml-2" onClick={() => copyToClipboard(code.id)}><Copy className="h-3 w-3"/></Button>
                                        </TableCell>
                                        <TableCell>{code.isUsed ? 'Used' : 'Unused'}</TableCell>
                                        <TableCell>{code.usedBy || 'N/A'}</TableCell>
                                        <TableCell>{code.usedAt ? format(new Date(code.usedAt.seconds * 1000), 'Pp') : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                                {codes?.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No codes generated yet.</TableCell></TableRow>}
                           </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function CourseNotesManagement() {
  const firestore = useFirestore();
  const storage = useStorage();
  const notesCollection = useMemoFirebase(() => collection(firestore, 'courseNotes'), [firestore]);
  const notesQuery = useMemoFirebase(() => query(notesCollection, orderBy('unitNumber', 'asc')), [notesCollection]);
  const { data: notes, isLoading, error } = useCollection<CourseNote>(notesQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCodesDialogOpen, setIsCodesDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingNote, setEditingNote] = useState<CourseNote | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    unitNumber: '',
    unitName: '',
    modelCount: '',
  });

  const handleOpenDialog = (note: CourseNote | null = null) => {
    setEditingNote(note);
    setSelectedFile(null);
    if (note) {
      setFormData({
        unitNumber: note.unitNumber,
        unitName: note.unitName,
        modelCount: note.modelCount,
      });
    } else {
      setFormData({ unitNumber: '', unitName: '', modelCount: '' });
    }
    setIsDialogOpen(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const storagePath = `course-notes/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    return storagePath;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setIsSubmitting(true);

    try {
      let storagePath = editingNote?.storagePath;
      if (selectedFile) {
        if (editingNote?.storagePath) {
            // Delete old file if it exists
            const oldFileRef = ref(storage, editingNote.storagePath);
            await deleteObject(oldFileRef).catch(e => console.warn("Old file not found, may have been deleted already."));
        }
        storagePath = await uploadFile(selectedFile);
      }
      
      if (!storagePath && !editingNote) {
        toast.error("A PDF file is required when adding a new note.");
        setIsSubmitting(false);
        return;
      }

      const dataToSave = { 
        ...formData, 
        ...(storagePath && { storagePath }) // only include storagePath if it's defined
      };

      if (editingNote) {
        await updateDoc(doc(firestore, 'courseNotes', editingNote.id), { ...dataToSave, updatedAt: serverTimestamp() });
        toast.success(`Unit "${dataToSave.unitName}" updated.`);
      } else {
        await addDoc(notesCollection, { ...dataToSave, createdAt: serverTimestamp() });
        toast.success(`Unit "${dataToSave.unitName}" added.`);
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (note: CourseNote) => {
    if (!firestore || !storage) return;
    
    try {
        if (note.storagePath) {
            // Delete file from storage
            const fileRef = ref(storage, note.storagePath);
            await deleteObject(fileRef).catch(e => console.warn("Could not delete file, it might already be gone:", e));
        }
        
        // Delete all access codes for this note
        const codesRef = collection(firestore, 'accessCodes');
        const q = query(codesRef, where('noteId', '==', note.id));
        const codesSnapshot = await getDocs(q);
        const batch = writeBatch(firestore);
        codesSnapshot.forEach(codeDoc => {
            batch.delete(codeDoc.ref);
        });
        await batch.commit();

        // Delete the note document
        await deleteDoc(doc(firestore, 'courseNotes', note.id));
      
        toast.success("Note and associated data deleted.");
    } catch (err: any) {
        toast.error(`Failed to delete note: ${err.message}`);
    }
  }

  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
        const batch = writeBatch(firestore);
        const existingNotesSnapshot = await getDocs(notesCollection);
        const existingNoteNames = new Set(existingNotesSnapshot.docs.map(doc => doc.data().unitName));
        let seededCount = 0;

        initialUnits.forEach(unit => {
            if (!existingNoteNames.has(unit.name)) {
                const newNoteRef = doc(notesCollection);
                batch.set(newNoteRef, {
                    unitNumber: unit.no,
                    unitName: unit.name,
                    modelCount: unit.models,
                    storagePath: '', // Placeholder, to be updated by admin
                    createdAt: serverTimestamp(),
                });
                seededCount++;
            }
        });

        if (seededCount > 0) {
            await batch.commit();
            toast.success(`${seededCount} new units have been seeded successfully.`);
        } else {
            toast.info("All initial units already exist in the database.");
        }
    } catch (e: any) {
        toast.error(`Failed to seed data: ${e.message}`);
    } finally {
        setIsSeeding(false);
    }
  };


  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Course Notes</h2>
          <p className="text-muted-foreground">Add, edit, or remove course note PDFs and manage access codes.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleSeedData} disabled={isSeeding}>
                <Database className="mr-2 h-4 w-4" />
                {isSeeding ? "Seeding..." : "Seed Initial Data"}
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course Note
            </Button>
        </div>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Unit List & Model Count</CardTitle>
            <CardDescription>A complete overview of the NVQ Level 4 syllabus covered in these notes.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit #</TableHead>
                            <TableHead>Unit Name (EN/SIN)</TableHead>
                            <TableHead>Model Count</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && [...Array(3)].map((_,i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8"/></TableCell></TableRow>)}
                        {error && <TableRow><TableCell colSpan={4} className="text-center text-destructive">Error: {error.message}</TableCell></TableRow>}
                        {!isLoading && notes?.map(note => (
                            <TableRow key={note.id}>
                                <TableCell className="font-medium">{note.unitNumber}</TableCell>
                                <TableCell>{note.unitName}</TableCell>
                                <TableCell>{note.modelCount}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => { setEditingNote(note); setIsCodesDialogOpen(true); }}>
                                        <KeyRound className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(note)}>
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4"/></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete the note for "{note.unitName}", its PDF file from storage, and all associated access codes. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(note)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                         {!isLoading && notes?.length === 0 && <TableRow><TableCell colSpan={4} className="text-center h-24">No notes found. Click "Add Course Note" or "Seed Initial Data" to begin.</TableCell></TableRow>}
                    </TableBody>
                </Table>
             </div>
          </CardContent>
      </Card>
      
      <ManageCodesDialog note={editingNote} open={isCodesDialogOpen} onOpenChange={setIsCodesDialogOpen} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit Number</Label>
              <Input id="unitNumber" name="unitNumber" value={formData.unitNumber} onChange={handleFormChange} required placeholder="e.g., Unit 01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitName">Unit Name (EN/SIN)</Label>
              <Input id="unitName" name="unitName" value={formData.unitName} onChange={handleFormChange} required placeholder="e.g., Client Consultation – ගනුදෙනුකරු සමඟ සාකච්ඡා" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="modelCount">Model Count (මොඩල් ගණන)</Label>
              <Input id="modelCount" name="modelCount" value={formData.modelCount} onChange={handleFormChange} required placeholder="e.g., 1-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">PDF File</Label>
              <Input id="file" type="file" onChange={handleFileChange} accept=".pdf" required={!editingNote} />
              {editingNote && <p className="text-xs text-muted-foreground">Leave blank to keep existing file.</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Note'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
