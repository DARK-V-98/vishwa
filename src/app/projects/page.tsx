
'use client';

import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, FileText, ServerCrash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

interface Project {
  id: string;
  serviceName: string;
  status: string;
  progress: number;
  total: number;
  createdAt: {
    toDate: () => Date;
  };
}

const ProjectCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export default function ProjectsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'projects'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);
  
  const { data: projects, isLoading, error } = useCollection<Project>(projectsQuery);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'In Progress':
        return 'default';
      case 'In Review':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="container py-12 pt-24">
        <h1 className="text-4xl font-bold text-center mb-12">My Projects</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 pt-24 text-center">
        <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-bold">Failed to load projects</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container py-12 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">My Projects</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Here you can track the status and progress of all your website and design projects.
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span>{project.serviceName}</span>
                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                </CardTitle>
                <CardDescription>
                  Total: Rs. {project.total.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div>
                  <Label className="text-sm">Progress</Label>
                  <Progress value={project.progress} className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{project.progress}% Complete</p>
                </div>
              </CardContent>
              <CardContent>
                <Button asChild className="w-full">
                    <Link href={`/projects/${project.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Projects Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by generating a new quotation.
          </p>
          <Button asChild className="mt-6">
            <Link href="/quotation-generator">Get a Quote</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
