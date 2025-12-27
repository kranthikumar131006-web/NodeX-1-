'use client';

import { useState, useEffect } from 'react';
import { startups as staticStartups } from '@/lib/data';
import { StartupCard } from '@/components/shared/startup-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
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
import type { Startup } from '@/lib/types';

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>(staticStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(staticStartups);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [industryFilter, setIndustryFilter] = useState('All');
  
  const [tempIndustryFilter, setTempIndustryFilter] = useState('All');

  const industries = ['All', ...Array.from(new Set(staticStartups.map(s => s.industry)))];

  useEffect(() => {
    let result = startups;

    if (industryFilter !== 'All') {
      result = result.filter(s => s.industry === industryFilter);
    }
    
    setFilteredStartups(result);
  }, [industryFilter, startups]);

  const handleApplyFilters = () => {
    setIndustryFilter(tempIndustryFilter);
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setTempIndustryFilter('All');
    setIndustryFilter('All');
    setIsFilterOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    if (open) {
      setTempIndustryFilter(industryFilter);
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
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="industry">Industry</Label>
                   <Select onValueChange={setTempIndustryFilter} value={tempIndustryFilter}>
                    <SelectTrigger id="industry" className="col-span-2 h-8">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
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
    </div>
  );
}
