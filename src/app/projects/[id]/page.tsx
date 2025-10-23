
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, ServerCrash, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface ProjectUpdate {
  message: string;
  timestamp: { toDate: () => Date };
}

interface Project {
  id: string;
  serviceName: string;
  status: string;
  progress: number;
  total: number;
  quotationMarkdown: string;
  createdAt: { toDate: () => Date };
  updates: ProjectUpdate[];
}

const ProjectDetailSkeleton = () => (
    <div className="container py-12 pt-24">
        <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        </div>
    </div>
)

export default function ProjectDetailPage() {
  const { id } = useParams();
  const firestore = useFirestore();

  const projectRef = useMemoFirebase(() => {
    if (!id || !firestore) return null;
    return doc(firestore, 'projects', id as string);
  }, [id, firestore]);
  
  const { data: project, isLoading, error } = useDoc<Project>(projectRef);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'In Progress': return 'default';
      case 'In Review': return 'secondary';
      case 'Completed': return 'outline';
      default: return 'destructive';
    }
  };

  if (isLoading) return <ProjectDetailSkeleton />;

  if (error) {
    return (
      <div className="container py-12 pt-24 text-center">
        <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Failed to load project</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!project) {
     return (
      <div className="container py-12 pt-24 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Project Not Found</h2>
        <p className="text-muted-foreground">The project you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container py-12 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-4xl font-bold flex items-center justify-between">
                {project.serviceName}
                <Badge variant={getStatusVariant(project.status)} className="text-lg">{project.status}</Badge>
            </h1>
            <p className="text-muted-foreground mt-2">
                Project created on {format(project.createdAt.toDate(), 'PPP')}
            </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <p className="font-semibold">Overall Progress</p>
                        <Progress value={project.progress} className="mt-2" />
                        <p className="text-sm text-muted-foreground mt-1 text-right">{project.progress}%</p>
                    </div>
                    <div>
                        <p className="font-semibold">Quoted Amount</p>
                        <p className="text-2xl font-bold text-primary">Rs. {project.total.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Project Updates</CardTitle>
                </CardHeader>
                <CardContent>
                    {project.updates && project.updates.length > 0 ? (
                        <div className="space-y-6">
                            {project.updates.slice().reverse().map((update, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-primary"/>
                                    </div>
                                    <div>
                                        <p className="text-sm">{update.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(update.timestamp.toDate(), "PPpp")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No updates have been posted for this project yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Original Quotation</CardTitle>
                </CardHeader>
                <CardContent>
                     <Alert>
                        <AlertDescription>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{project.quotationMarkdown}</ReactMarkdown>
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
