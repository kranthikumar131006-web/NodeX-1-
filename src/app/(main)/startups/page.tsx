
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StartupCard } from '@/components/shared/startup-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Rocket } from 'lucide-react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function StartupsPage() {
  const firestore = useFirestore();
  const startupsQuery = useMemoFirebase(() => collection(firestore, 'startups'), [firestore]);
  const { data: startups, isLoading: isLoadingStartups } = useCollection<Startup>(startupsQuery);
  
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [industryFilter, setIndustryFilter] = useState('All');
  const [yearsFilter, setYearsFilter] = useState(10);
  
  const [tempIndustryFilter, setTempIndustryFilter] = useState('All');
  const [tempYearsFilter, setTempYearsFilter] = useState(10);

  const [allIndustries, setAllIndustries] = useState<string[]>([]);

  useEffect(() => {
    if (startups) {
      setAllIndustries(['All', ...Array.from(new Set(startups.map(s => s.industry)))]);
    }
  }, [startups]);


  useEffect(() => {
    let result = startups || [];

    if (industryFilter !== 'All') {
      result = result.filter(s => s.industry === industryFilter);
    }
    
    result = result.filter(s => s.yearsInIndustry <= yearsFilter);
    
    setFilteredStartups(result);
  }, [industryFilter, yearsFilter, startups]);

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
            <Input placeholder="Search by name, industry, or founder..." className="pl-9" />
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
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="years">Years in Industry (Max)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="years"
                      min={0}
                      max={10}
                      step={1}
                      value={[tempYearsFilter]}
                      onValueChange={(value) => setTempYearsFilter(value[0])}
                    />
                    <span className="text-sm font-medium w-12 text-center">{tempYearsFilter} yrs</span>
                  </div>
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

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>

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
    </div>
  );
}

    