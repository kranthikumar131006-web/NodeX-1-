
'use client';

import { useState, useEffect } from 'react';
import { TeamCard } from '@/components/shared/team-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import type { HackathonTeam } from '@/lib/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collectionGroup } from 'firebase/firestore';

export default function HackathonTeamsPage() {
  const firestore = useFirestore();

  // Defer query creation until firestore and user are available
  const teamsQuery = useMemoFirebase(
    () => (firestore ? collectionGroup(firestore, 'teams') : null),
    [firestore]
  );
  
  const { data: liveTeams, isLoading: isLoadingTeams } = useCollection<HackathonTeam>(teamsQuery);
  
  const [filteredTeams, setFilteredTeams] = useState<HackathonTeam[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for applied filters
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');

  // Temporary state for filters inside popover
  const [tempRoleFilter, setTempRoleFilter] = useState('All');
  const [tempSortFilter, setTempSortFilter] = useState('newest');

  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (liveTeams) {
      setAllRoles([
        'All',
        ...Array.from(new Set(liveTeams.flatMap(t => t.lookingFor.map(l => l.role))))
      ]);
    }
  }, [liveTeams]);
  
  useEffect(() => {
    let result = liveTeams || [];

    if (roleFilter !== 'All') {
      result = result.filter(team => team.lookingFor.some(l => l.role === roleFilter));
    }
    
    result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        if (sortFilter === 'newest') {
            return dateB.getTime() - dateA.getTime();
        } else {
            return dateA.getTime() - dateB.getTime();
        }
    });

    setFilteredTeams(result);
  }, [roleFilter, sortFilter, liveTeams]);

  const handleApplyFilters = () => {
    setRoleFilter(tempRoleFilter);
    setSortFilter(tempSortFilter);
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setTempRoleFilter('All');
    setTempSortFilter('newest');
    setRoleFilter('All');
    setSortFilter('newest');
    setIsFilterOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    if (open) {
      setTempRoleFilter(roleFilter);
      setTempSortFilter(sortFilter);
    }
  };

  const renderSkeleton = () => (
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
  );


  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Hackathon Team Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Assemble your dream team or find the perfect one to join.
        </p>
      </div>
      
      { !hasMounted || isLoadingTeams ? renderSkeleton() : (
        <>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by team name, required role, or skill..." className="pl-9" />
            </div>
            <Popover open={isFilterOpen} onOpenChange={onOpenChange}>
              <PopoverTrigger asChild>
                  <Button variant="outline" className="font-medium">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Refine your search for teams.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="role">Requirement</Label>
                       <Select onValueChange={setTempRoleFilter} value={tempRoleFilter}>
                        <SelectTrigger id="role" className="col-span-2 h-8">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {allRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                      <Label>Sort by</Label>
                      <div className="col-span-2">
                        <RadioGroup
                          value={tempSortFilter}
                          onValueChange={(value) => setTempSortFilter(value)}
                          className="flex gap-4"
                        >
                           <div className="flex items-center space-x-2">
                              <RadioGroupItem value="newest" id="r-newest" />
                               <Label htmlFor="r-newest">Newest</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                              <RadioGroupItem value="oldest" id="r-oldest" />
                               <Label htmlFor="r-oldest">Oldest</Label>
                           </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                   <Button variant="ghost" onClick={handleClearFilters} className="font-medium">Clear</Button>
                   <Button onClick={handleApplyFilters} className="font-medium">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button asChild className="font-medium">
                <Link href="/hackathons/teams/register">
                    <Plus className="mr-2 h-4 w-4" />
                    Register your team
                </Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
