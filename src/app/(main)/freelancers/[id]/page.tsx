'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { freelancers } from '@/lib/data';
import {
  Badge,
  Briefcase,
  Calendar,
  ChevronRight,
  Code,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Star,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { Rating } from '@/components/shared/rating';

export default function FreelancerDetailPage() {
  const params = useParams();
  const freelancerId = params.id;
  const freelancer = freelancers.find(f => f.id === freelancerId);

  if (!freelancer) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Freelancer not found</h1>
        <p className="text-muted-foreground">
          The freelancer you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/freelancers">Back to Freelancers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2 flex items-center">
            <Link href="/freelancers" className="hover:text-primary">
              Freelancers
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-foreground">{freelancer.name}</span>
          </div>
        </div>

        {/* Header Section */}
        <header className="relative mb-8 rounded-xl bg-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8">
            <Avatar className="h-32 w-32 border-4 border-primary/20">
              <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
              <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className='flex justify-between items-start'>
                <div>
                  <h1 className="font-headline text-4xl font-bold">{freelancer.name}</h1>
                  <p className="mt-1 text-lg text-muted-foreground">{freelancer.tagline}</p>
                </div>
                <StatusBadge status={freelancer.availability} />
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{freelancer.location}</span>
                </div>
                <Rating rating={freelancer.rating} totalReviews={freelancer.reviews.length} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><User className="h-6 w-6 text-primary" />About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{freelancer.bio}</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Code className="h-6 w-6 text-primary" />Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {freelancer.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="px-3 py-1 text-sm font-normal">
                            {skill}
                        </Badge>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Briefcase className="h-6 w-6 text-primary" />Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {(freelancer.portfolio || []).map(project => (
                         <div key={project.id} className="border rounded-lg overflow-hidden group">
                           <div className="relative h-48 w-full">
                            <Image src={project.imageUrl} alt={project.title} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={project.imageHint}/>
                            {project.githubUrl && (
                                <Button asChild size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8">
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
                                </Button>
                            )}
                           </div>
                           <div className='p-4'>
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                           </div>
                         </div>
                       ))}
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Reviews ({freelancer.reviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {(freelancer.reviews || []).map(review => (
                            <div key={review.id} className="flex items-start gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={review.avatarUrl} alt={review.name} />
                                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.name}</p>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <span className="text-sm">{review.rating.toFixed(1)}</span>
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                                </div>
                            </div>
                        ))}
                        {freelancer.reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
                    </CardContent>
                </Card>

                 <Button asChild className="w-full" size="lg">
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${freelancer.email}`} target="_blank" rel="noopener noreferrer">
                        <Mail className="mr-2 h-4 w-4" /> Contact {freelancer.name.split(' ')[0]}
                    </a>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
