
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { StartupCard } from '@/components/shared/startup-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Rocket, X } from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import type { Startup } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function StartupsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const startupsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'startups') : null),
    [firestore]
  );
  const { data: startups, isLoading: isLoadingStartups } = useCollection<Startup>(startupsQuery);
  
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [industryFilter, setIndustryFilter] = useState('All');
  const [yearsFilter, setYearsFilter] = useState(10);
  
  const [tempIndustryFilter, setTempIndustryFilter] = useState('All');
  const [tempYearsFilter, setTempYearsFilter] = useState(10);

  const [allIndustries, setAllIndustries] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return (startups || []).filter(s =>
      s.name.toLowerCase().includes(lowercasedQuery) ||
      s.tagline.toLowerCase().includes(lowercasedQuery) ||
      s.industry.toLowerCase().includes(lowercasedQuery) ||
      s.founders.some(f => f.name.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, startups]);

  useEffect(() => {
    if (startups) {
      setAllIndustries(['All', ...Array.from(new Set(startups.map(s => s.industry)))]);
    }
  }, [startups]);


  useEffect(() => {
    let result = startups || [];
    const lowercasedQuery = searchQuery.toLowerCase();

    if (searchQuery) {
        result = result.filter(s =>
            s.name.toLowerCase().includes(lowercasedQuery) ||
            s.tagline.toLowerCase().includes(lowercasedQuery) ||
            s.industry.toLowerCase().includes(lowercasedQuery) ||
            s.founders.some(f => f.name.toLowerCase().includes(lowercasedQuery))
        );
    }

    if (industryFilter !== 'All') {
      result = result.filter(s => s.industry === industryFilter);
    }
    
    setFilteredStartups(result);
  }, [industryFilter, yearsFilter, startups, searchQuery]);

  const handleApplyFilters = () => {
    setIndustryFilter(tempIndustryFilter);
    setYearsFilter(tempYearsFilter);
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setTempIndustryFilter('All');
    setTempYearsFilter(10);
    setIndustryFilter('All');
    setYearsFilter(10);
    setIsFilterOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    if (open) {
      setTempIndustryFilter(industryFilter);
      setTempYearsFilter(yearsFilter);
    }
  };

  const renderSkeleton = () => (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="p-4 flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <div className="p-4 pt-0 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="p-4 pt-0 flex justify-between items-center">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Startup Investment Platform</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Discover and connect with the next generation of innovative startups.
        </p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, industry, or founder..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
            />
             {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
             {showSearchResults && searchResults.length > 0 && (
              <Card className="absolute top-full mt-2 w-full z-10 shadow-lg">
                <CardContent className="p-2 max-h-80 overflow-y-auto">
                  <p className="p-2 text-xs font-semibold text-muted-foreground">
                    {searchResults.length} startup{searchResults.length === 1 ? '' : 's'} found
                  </p>
                  {searchResults.map(startup => (
                    <Link href={`/startups/${startup.id}`} key={startup.id}>
                       <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                         <Avatar className="h-10 w-10 border">
                           <AvatarImage src={startup.logoUrl} />
                           <AvatarFallback>{startup.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div>
                           <p className="font-semibold">{startup.name}</p>
                           <p className="text-sm text-muted-foreground">{startup.tagline}</p>
                         </div>
                       </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
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
                  Refine your search for startups.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="industry">Industry</Label>
                   <Select onValueChange={setTempIndustryFilter} value={tempIndustryFilter}>
                    <SelectTrigger id="industry" className="col-span-2 h-8">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {allIndustries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between mt-2">
               <Button variant="ghost" onClick={handleClearFilters}>Clear Filters</Button>
               <Button onClick={handleApplyFilters}>Apply</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isLoadingStartups || !hasMounted ? renderSkeleton() : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
            ))}
             {filteredStartups.length === 0 && (
                <div className="text-center py-16 col-span-full">
                <h2 className="text-xl font-semibold">No Startups Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </div>
      )}

      {user && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg p-0">
                <Link href="/startups/register">
                  <Rocket className="h-8 w-8" />
                  <span className="sr-only">Register Startup</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Register your startup</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
