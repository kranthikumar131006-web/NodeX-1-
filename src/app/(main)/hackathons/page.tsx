
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hackathons as staticHackathons } from '@/lib/data';
import { HackathonCard } from '@/components/shared/hackathon-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Users, Plus, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import type { Hackathon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const { toast } = useToast();

  const updateUserHackathons = () => {
      try {
          const savedHackathons = localStorage.getItem('userHackathons');
          if (savedHackathons) {
              const userHackathons = JSON.parse(savedHackathons);
              // Avoid duplicates by checking IDs
              const combined = [...staticHackathons];
              const staticIds = new Set(staticHackathons.map(h => h.id));
              userHackathons.forEach((hackathon: Hackathon) => {
                  if (!staticIds.has(hackathon.id)) {
                      combined.push(hackathon);
                  }
              });
              setHackathons(combined);
          } else {
              setHackathons(staticHackathons);
          }
      } catch (error) {
          console.error("Failed to load user hackathons from localStorage", error);
          setHackathons(staticHackathons);
      }
  };

  useEffect(() => {
    updateUserHackathons();
    setHasMounted(true);
    
    window.addEventListener('storage', updateUserHackathons);
    
    return () => {
      window.removeEventListener('storage', updateUserHackathons);
    }
  }, []);

  const handleClearEvents = () => {
    try {
      localStorage.removeItem('userHackathons');
      updateUserHackathons();
      toast({
        title: "Registered Events Cleared",
        description: "Your locally saved events have been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not clear registered events.",
      });
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Hackathon Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore upcoming hackathons and join the innovation wave.
        </p>
      </div>

      {hasMounted ? (
        <>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, tech stack, or location..." className="pl-9" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button asChild>
              <Link href="/hackathons/teams">
                <Users className="mr-2 h-4 w-4" />
                Find a Team
              </Link>
            </Button>
            <Button asChild>
              <Link href="/hackathons/register">
                <Plus className="mr-2 h-4 w-4" />
                Register Event
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleClearEvents}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear My Events
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                     <div className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-12" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-9 w-20" />
                     </div>
                </Card>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
