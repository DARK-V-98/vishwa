
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';

interface Project {
  id: string;
  serviceName: string;
  clientName: string;
  status: string;
  progress: number;
  createdAt: { toDate: () => Date };
}

export default function ProjectManagement() {
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newProgress, setNewProgress] = useState<number | string>('');

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading, error } = useCollection<Project>(projectsQuery);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'In Progress': return 'default';
      case 'In Review': return 'secondary';
      case 'Completed': return 'outline';
      default: return 'destructive';
    }
  };

  const openUpdateDialog = (project: Project) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setNewProgress(project.progress);
    setUpdateMessage('');
    setIsDialogOpen(true);
  };
  
  const handleUpdateProject = async () => {
    if (!selectedProject || !firestore) return;

    const projectRef = doc(firestore, 'projects', selectedProject.id);
    const updates: any = {
        status: newStatus,
        progress: Number(newProgress),
        updatedAt: serverTimestamp()
    };

    if(updateMessage.trim()){
        updates.updates = arrayUnion({
            message: updateMessage,
            timestamp: serverTimestamp()
        })
    }

    try {
        await updateDoc(projectRef, updates);
        toast.success("Project updated successfully!");
        setIsDialogOpen(false);
    } catch (err: any) {
        toast.error("Failed to update project:", err.message);
    }
  };


  if (isLoading) {
      return (
        <Card>
            <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            </CardContent>
        </Card>
      );
  }

  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Client Projects</CardTitle>
          <CardDescription>
            Track and update the progress of all client projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.serviceName}</TableCell>
                  <TableCell>{project.clientName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell>{project.progress}%</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => openUpdateDialog(project)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Update Project: {selectedProject?.serviceName}</DialogTitle>
                  <DialogDescription>
                      Post a new update, change the status, or adjust the progress percentage.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="update-message">New Update Message (Optional)</Label>
                      <Textarea id="update-message" value={updateMessage} onChange={e => setUpdateMessage(e.target.value)} placeholder="e.g., 'Initial designs completed and sent for review.'" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="status">Project Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="progress">Progress (%)</Label>
                      <Input id="progress" type="number" min="0" max="100" value={newProgress} onChange={e => setNewProgress(e.target.value)} />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProject}>Save Update</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
