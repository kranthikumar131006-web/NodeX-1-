
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackathonCard } from '@/components/shared/hackathon-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Users, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import type { Hackathon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function HackathonsPage() {
  const firestore = useFirestore();
  const hackathonsQuery = useMemoFirebase(() => collection(firestore, 'hackathons'), [firestore]);
  const { data: liveHackathons, isLoading: isLoadingHackathons } = useCollection<Hackathon>(hackathonsQuery);

  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for applied filters
  const [modeFilter, setModeFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');

  // Temporary state for filters inside popover
  const [tempModeFilter, setTempModeFilter] = useState('All');
  const [tempSortFilter, setTempSortFilter] = useState('newest');

  useEffect(() => {
    let result = liveHackathons || [];

    if (modeFilter !== 'All') {
      result = result.filter(h => h.mode === modeFilter);
    }
    
    result.sort((a, b) => {
        const dateA = new Date(a.date.split(',')[1] || 0);
        const dateB = new Date(b.date.split(',')[1] || 0);
        if (sortFilter === 'newest') {
            return dateB.getTime() - dateA.getTime();
        } else {
            return dateA.getTime() - dateB.getTime();
        }
    });

    setFilteredHackathons(result);
  }, [modeFilter, sortFilter, liveHackathons]);


  const handleApplyFilters = () => {
    setModeFilter(tempModeFilter);
    setSortFilter(tempSortFilter);
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setTempModeFilter('All');
    setTempSortFilter('newest');
    setModeFilter('All');
    setSortFilter('newest');
    setIsFilterOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    if (open) {
      // When opening popover, sync temp state with applied state
      setTempModeFilter(modeFilter);
      setTempSortFilter(sortFilter);
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

      { !isLoadingHackathons ? (
        <>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, tech stack, or location..." className="pl-9" />
            </div>
             <Popover open={isFilterOpen} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Refine your search for hackathons.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="mode">Type</Label>
                       <Select onValueChange={setTempModeFilter} value={tempModeFilter}>
                        <SelectTrigger id="mode" className="col-span-2 h-8">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Offline">Offline</SelectItem>
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
                   <Button variant="ghost" onClick={handleClearFilters}>Clear</Button>
                   <Button onClick={handleApplyFilters}>Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
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

    