
'use client';

import { useState, useEffect } from 'react';
import { hackathonTeams } from '@/lib/data';
import { TeamCard } from '@/components/shared/team-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function HackathonTeamsPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Hackathon Team Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Assemble your dream team or find the perfect one to join.
        </p>
      </div>
      
      {hasMounted ? (
        <>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by team name, required role, or skill..." className="pl-9" />
            </div>
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
            </Button>
             <Button asChild>
                <Link href="#">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Team
                </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathonTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8">
            <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                     <div className="p-4 pt-0">
                        <Skeleton className="h-9 w-full" />
                     </div>
                </Card>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
