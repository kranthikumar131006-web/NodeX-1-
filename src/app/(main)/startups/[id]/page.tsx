
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Badge,
  Building,
  Calendar,
  CheckCircle,
  ChevronRight,
  Eye,
  FileText,
  Globe,
  Info,
  Linkedin,
  Mail,
  MapPin,
  Trash2,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { Startup, Freelancer } from '@/lib/types';
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

export default function StartupDetailPage() {
  const params = useParams();
  const startupId = params.id as string;
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const startupRef = useMemoFirebase(
    () => (firestore && startupId ? doc(firestore, 'startups', startupId) : null),
    [firestore, startupId]
  );
  const { data: startup, isLoading } = useDoc<Startup>(startupRef);

  const handleDelete = async () => {
    if (!startupRef) return;
    try {
      await deleteDoc(startupRef);
      toast({
        title: 'Startup Deleted',
        description: `"${startup?.name}" has been successfully removed.`,
      });
      router.push('/startups');
    } catch (error) {
      console.error('Error deleting startup:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not delete the startup. Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-secondary/30">
        <div className="container mx-auto py-8 md:py-12">
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-48 w-full mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
                </div>
                <div className="space-y-8">
                <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Startup not found</h1>
        <p className="text-muted-foreground">
          The startup you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/startups">Back to Startups</Link>
        </Button>
      </div>
    );
  }
  
  const allMembers = [...(startup.founders || []), ...(startup.team || [])];
  const isOwner = user && user.uid === startup.userId;

  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2 flex items-center">
            <Link href="/startups" className="hover:text-primary">
              Startups
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-foreground">{startup.name}</span>
          </div>
        </div>

        {/* Header Section */}
        <header className="relative mb-8 rounded-xl bg-card p-8 md:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-secondary/30 opacity-50 h-48"></div>
           <div className="relative flex flex-col md:flex-row gap-8 items-center">
              {startup.logoUrl && (
                <div className="p-2 bg-background rounded-full border-4 border-background shadow-md -mt-24 md:-mt-12">
                    <Image
                    src={startup.logoUrl}
                    alt={`${startup.name} logo`}
                    width={96}
                    height={96}
                    className="rounded-full"
                    data-ai-hint={startup.imageHint}
                  />
                </div>
              )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="font-headline text-4xl font-bold">{startup.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{startup.tagline}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3"><Building className="h-4 w-4" />{startup.industry}</Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3"><MapPin className="h-4 w-4" />{startup.location}</Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3"><Calendar className="h-4 w-4" />Inc. {startup.foundingYear}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><Globe className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><Linkedin className="h-5 w-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg></Link>
                </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Info className="h-6 w-6 text-primary" />The Problem We're Solving</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{startup.problem}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Eye className="h-6 w-6 text-primary" />Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{startup.vision}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><FileText className="h-6 w-6 text-primary" />What We Provide</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {(startup.offerings || []).map(offering => (
                         <div key={offering.name} className="p-4 bg-secondary/50 rounded-lg flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                           <div>
                            <p className="font-semibold">{offering.name}</p>
                            <p className="text-sm text-muted-foreground">{offering.description}</p>
                           </div>
                         </div>
                       ))}
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <Card className="bg-secondary/50 border-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Facts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">FOUNDERS</p>
                            <p>{startup.founders?.map(f => `${f.name} (${f.role})`).join(', ')}</p>
                        </div>
                         <div>
                            <p className="text-sm font-semibold text-muted-foreground">TARGET MARKET SIZE</p>
                            <p>{startup.marketSize}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">CONTACT EMAIL</p>
                            <a href={`mailto:${startup.contactEmail}`} className="flex items-center gap-2 text-primary hover:underline">
                                <Mail className="h-4 w-4" />
                                {startup.contactEmail}
                            </a>
                        </div>
                         {isOwner && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full mt-4">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Startup
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    startup and remove its data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Milestones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-6 border-l-2 border-primary/20 pl-6">
                            {(startup.milestones || []).map((milestone, index) => (
                                <li key={index} className="relative">
                                    <div className="absolute -left-[30px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background"></div>
                                    <p className="text-xs text-muted-foreground">{milestone.date}</p>
                                    <p className="font-semibold">{milestone.description}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Meet the Team Section */}
        <div className="mt-12">
            <h2 className="font-headline text-3xl font-bold flex items-center gap-3 mb-8">
                <Users className="h-8 w-8 text-primary" />
                Meet The Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allMembers.map(member => {
                    const memberCard = (
                        <Card className="text-center p-6">
                            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-sm text-primary font-medium">{member.role}</p>
                        </Card>
                    );
                    
                    return member.bio ? ( // Assuming bio implies a full freelancer profile
                        <Link key={member.id} href={`/freelancers/${member.id}`} className="transition-transform hover:-translate-y-1">
                            {memberCard}
                        </Link>
                    ) : (
                        <div key={member.id}>{memberCard}</div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}

    