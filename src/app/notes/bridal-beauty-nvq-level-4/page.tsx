
'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, BookOpen, Clock, Zap, GraduationCap, Lock, Download, KeyRound, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUser } from "@/firebase";
import { redeemAccessCode } from "@/ai/flows/secure-note-download";

const units = [
    { no: 'Unit 01', name: 'Client Consultation – ගනුදෙනුකරු සමඟ සාකච්ඡා', models: '1–2', id: 'unit_01' },
    { no: 'Unit 02', name: 'Salon Management – සැලෝන් කළමනාකරණය', models: '1–2', id: 'unit_02' },
    { no: 'Unit 03', name: 'Manicure & Pedicure – නිය සත්කාර සිදු කිරීම', models: '2–3', id: 'unit_03' },
    { no: 'Unit 04', name: 'Facial – සම සදහා සත්කාර කිරීම', models: '2–3', id: 'unit_04' },
    { no: 'Unit 05', name: 'Makeup (Bridal & Special) – වේෂ නිරෑපණ කටයුතු සිදු කිරීම', models: '5–10', id: 'unit_05' },
    { no: 'Unit 06', name: 'Skin Analysis – සම විශ්ලේෂණය', models: '1–2', id: 'unit_06' },
    { no: 'Unit 07', name: 'Tools & Environment Maintenance – උපකරණ සහ පරිසර නඩත්තුව', models: '1', id: 'unit_07' },
    { no: 'Unit 08', name: 'Reception Duties – පිළිගැනීමේ රාජකාරිය', models: '1', id: 'unit_08' },
    { no: 'Unit 09', name: 'Hair Removal – අනවශ්‍ය රෝම් ඉවත් කිරීම', models: '1–2', id: 'unit_09' },
    { no: 'Unit 10', name: 'Etiquette – ආචාර ධර්ම', models: '1', id: 'unit_10' },
    { no: 'Health/Safety', name: 'සෞඛ්‍ය සුරක්ෂිතභාවය', models: '1', id: 'unit_hs' },
];

const UnlockPdfDialog = ({ unitName, noteId }: { unitName: string, noteId: string }) => {
    const { user } = useUser();
    const [accessCode, setAccessCode] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleUnlock = async () => {
        if (!user) {
            toast.error("You must be logged in to unlock a file.");
            return;
        }
        if (!accessCode) {
            toast.error("Please enter an access code.");
            return;
        }
        setIsUnlocking(true);
        try {
            const result = await redeemAccessCode({ 
                code: accessCode, 
                noteId: noteId, 
                userId: user.uid,
                userEmail: user.email || 'unknown',
            });
            
            if (result.success && result.downloadUrl) {
                toast.success("Code accepted! Your download will begin shortly.");
                // Trigger download
                window.open(result.downloadUrl, '_blank');
                setIsOpen(false);
            } else {
                toast.error(result.message || "Failed to validate code. Please try again.");
            }
        } catch (error: any) {
            toast.error("An error occurred while trying to unlock the file.");
            console.error(error);
        } finally {
            setIsUnlocking(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><KeyRound className="mr-2 h-4 w-4" /> View / Unlock PDF</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unlock PDF for {unitName}</DialogTitle>
                    <DialogDescription>Enter your one-time access code to download the PDF.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="access-code">Access Code</Label>
                        <Input id="access-code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Enter your code" disabled={isUnlocking}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline" disabled={isUnlocking}>Cancel</Button></DialogClose>
                    <Button onClick={handleUnlock} disabled={isUnlocking}>
                        {isUnlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                         Unlock & Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function BridalNotesPage() {

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

  return (
    <div className="min-h-screen bg-gradient-subtle" style={{'--primary': '262 83% 58%', '--secondary': '340 82% 52%'} as React.CSSProperties}>
      {/* Hero Section */}
      <section id="overview" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-pink-50">
        <div className="absolute inset-0 z-0">
           <Image src="https://picsum.photos/seed/bridal-theme/1920/1080" alt="Bridal theme background" layout="fill" objectFit="cover" quality={80} data-ai-hint="bridal salon theme"/>
        </div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="container mx-auto px-4 relative z-20 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              📘 Bridal & Beauty NVQ Level 4 – Complete Notes Collection
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md">
              Unlock all NVQ Level 4 theory, practical, assignments & sample answers in one place!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="secondary" size="lg" onClick={() => scrollTo('buy-notes')}>Buy Notes</Button>
              <Button variant="outline" size="lg" onClick={() => scrollTo('unlock-pdf')}>Unlock PDF</Button>
              <Button variant="ghost" size="lg" className="hover:bg-white/20" asChild><Link href="/contact">Contact Us</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* On-page nav */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center gap-2 sm:gap-6 text-sm font-medium overflow-x-auto py-2">
                    <Button variant="link" onClick={() => scrollTo('overview')}>Overview</Button>
                    <Button variant="link" onClick={() => scrollTo('what-you-get')}>What You Get</Button>
                    <Button variant="link" onClick={() => scrollTo('unit-list')}>Unit List</Button>
                    <Button variant="link" onClick={() => scrollTo('buy-notes')}>Buy Notes</Button>
                    <Button variant="link" onClick={() => scrollTo('unlock-pdf')}>Unlock PDF</Button>
                    <Button variant="link" asChild><Link href="/contact">Contact Support</Link></Button>
                </div>
            </div>
        </div>


      {/* Instructor Intro */}
       <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                     <div className="relative aspect-square rounded-full shadow-strong overflow-hidden w-40 h-40 flex-shrink-0">
                        <Image
                            src="https://picsum.photos/seed/instructor/400/400"
                            alt="M.K.D Oshadi Vidarshana Perera"
                            fill
                            className="object-cover"
                            data-ai-hint="professional female portrait"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2">Content Developer</h2>
                        <h3 className="text-xl font-semibold text-primary mb-4">M.K.D Oshadi Vidarshana Perera</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome! I’m a qualified Bridal Dresser (NVQ Level 4). If you are studying NVQ Level 4 in Bridal & Beauty, මේ notes collection එක specially create කරපු එකක්.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>
      
      {/* What you get & Why */}
      <section id="what-you-get" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
               <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-center">What You Get</h2>
                        <ul className="space-y-4">
                            {[
                                { text: "Complete NVQ Level 4 theory notes" },
                                { text: "Bridal & Beauty practical guidelines" },
                                { text: "Assignments & sample answers" },
                                { text: "Beginner-friendly study layouts" },
                                { text: "Clear, well-organised, easy-to-understand lessons" }
                            ].map(item => (
                                <li key={item.text} className="flex items-start gap-3">
                                    <div className="w-6 h-6 flex-shrink-0 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mt-1 shadow-md">
                                        <CheckCircle className="h-4 w-4"/>
                                    </div>
                                    <span className="text-lg">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose These Notes</h2>
                        <ul className="space-y-4">
                            {[
                                { icon: Clock, text: "Save valuable study time" },
                                { icon: Zap, text: "Learn faster & more efficiently" },
                                { icon: GraduationCap, text: "Prepare for both practical + theory exams with confidence" }
                            ].map(item => (
                                <li key={item.text} className="flex items-start gap-3">
                                     <div className="w-6 h-6 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center mt-1 shadow-md">
                                        <item.icon className="h-4 w-4"/>
                                    </div>
                                    <span className="text-lg">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
               </div>
          </div>
      </section>

      {/* Unit List */}
      <section id="unit-list" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Unit List & Model Count</h2>
            <p className="text-muted-foreground">A complete overview of the NVQ Level 4 syllabus covered in these notes.</p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Unit No</TableHead>
                            <TableHead>Unit Name (EN/SIN)</TableHead>
                            <TableHead>Model Count (මොඩල් ගණන)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {units.map((unit) => (
                            <TableRow key={unit.no}>
                            <TableCell className="font-medium">{unit.no}</TableCell>
                            <TableCell>{unit.name}</TableCell>
                            <TableCell>{unit.models}</TableCell>
                            <TableCell className="text-right">
                                <UnlockPdfDialog unitName={unit.name.split('–')[0].trim()} noteId={unit.id} />
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Secure PDF Access */}
      <section id="unlock-pdf" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Secure PDF Access</h2>
                 <p className="text-muted-foreground">Your learning materials are protected. Use the one-time code provided after purchase to securely download your notes.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                <div className="space-y-3">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-strong"><span className="text-2xl font-bold">1</span></div>
                    <h3 className="font-semibold text-lg">Select a Unit PDF</h3>
                    <p className="text-sm text-muted-foreground">Choose the unit you want to download from the table above.</p>
                </div>
                 <div className="space-y-3">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-strong"><span className="text-2xl font-bold">2</span></div>
                    <h3 className="font-semibold text-lg">Enter Access Code</h3>
                    <p className="text-sm text-muted-foreground">Input the unique one-time code you received after purchase.</p>
                </div>
                 <div className="space-y-3">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto shadow-strong"><span className="text-2xl font-bold">3</span></div>
                    <h3 className="font-semibold text-lg">Download Instantly</h3>
                    <p className="text-sm text-muted-foreground">Your PDF will be downloaded directly to your device. The code will expire after use.</p>
                </div>
            </div>
        </div>
      </section>
      
      {/* CTA */}
      <section id="buy-notes" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
            <Card className="bg-gradient-primary border-0 shadow-strong max-w-3xl mx-auto text-primary-foreground">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Get Your Notes Today! ✨</h2>
                    <p className="opacity-90 max-w-2xl mx-auto">
                        For inquiries, ordering or unlocking, contact us anytime — we are here to support your learning journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="secondary" size="lg">Buy Now</Button>
                        <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">WhatsApp</Button>
                        <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild><Link href="/contact">Contact Us</Link></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>

    </div>
  );
}

    