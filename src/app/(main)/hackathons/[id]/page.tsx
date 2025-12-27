'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { hackathons } from '@/lib/data';
import {
  Badge,
  CalendarDays,
  ChevronRight,
  Code,
  Globe,
  Info,
  MapPin,
  Trophy,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HackathonDetailPage() {
  const params = useParams();
  const hackathonId = params.id;
  const hackathon = hackathons.find(h => h.id === hackathonId);

  if (!hackathon) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Hackathon not found</h1>
        <p className="text-muted-foreground">
          The hackathon you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/hackathons">Back to Hackathons</Link>
        </Button>
      </div>
    );
  }

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

                <Button asChild className="w-full" size="lg">
                    <a href={hackathon.officialUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" /> Visit Official Website
                    </a>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
