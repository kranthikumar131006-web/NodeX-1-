'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Badge,
  CalendarDays,
  ChevronRight,
  Code,
  Globe,
  Info,
  MapPin,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { Hackathon } from '@/lib/types';
import { doc, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const hackathonId = params.id as string;
  const firestore = useFirestore();

  const hackathonRef = useMemoFirebase(
    () => (firestore && hackathonId ? doc(firestore, 'hackathons', hackathonId) : null),
    [firestore, hackathonId]
  );
  const { data: hackathon, isLoading } = useDoc<Hackathon>(hackathonRef);

  const handleDelete = async () => {
    if (!hackathonRef) return;
    try {
      await deleteDoc(hackathonRef);
      toast({
        title: 'Hackathon Deleted',
        description: `"${hackathon?.title}" has been successfully removed.`,
      });
      router.push('/hackathons');
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the hackathon. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
        <div className="bg-secondary/30">
        <div className="container mx-auto py-8 md:py-12">
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-80 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Hackathon not found</h1>
        <p className="text-muted-foreground">
          The hackathon you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/hackathons">Back to Hackathons</Link>
        </Button>
      </div>
    );
  }

  const isOwner = user && user.uid === hackathon.userId;

  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2 flex items-center">
            <Link href="/hackathons" className="hover:text-primary">
              Hackathons
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-foreground">{hackathon.title}</span>
          </div>
        </div>

        {/* Header Section */}
        <header className="relative mb-8 rounded-xl bg-card p-8 md:p-12 overflow-hidden">
           <div className="relative h-64 w-full rounded-lg overflow-hidden mb-8">
              <Image
                  src={hackathon.imageUrl}
                  alt={hackathon.title}
                  fill
                  className="object-cover"
                  data-ai-hint={hackathon.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="font-headline text-4xl font-bold">{hackathon.title}</h1>
                  <p className="mt-1 text-lg text-white/90">Organized by {hackathon.organizer}</p>
              </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Info className="h-6 w-6 text-primary" />About This Hackathon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{hackathon.description}</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Code className="h-6 w-6 text-primary" />Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {hackathon.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="px-3 py-1 text-sm font-normal">
                            {tech}
                        </Badge>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                       <div className="flex items-center gap-3">
                         <CalendarDays className="h-5 w-5 text-muted-foreground" />
                         <span>{hackathon.date}</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <MapPin className="h-5 w-5 text-muted-foreground" />
                         <span>{hackathon.location} ({hackathon.mode})</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <Trophy className="h-5 w-5 text-muted-foreground" />
                         <span>{hackathon.prize} Prize Pool</span>
                       </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                  <Button asChild className="w-full" size="lg">
                      <a href={hackathon.officialUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" /> Visit Official Website
                      </a>
                  </Button>
                  {isOwner && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="lg" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            hackathon and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
