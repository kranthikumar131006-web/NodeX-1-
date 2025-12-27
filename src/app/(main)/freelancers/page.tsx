'use client';

import { useState, useEffect } from 'react';
import { freelancers as staticFreelancers } from '@/lib/data';
import { FreelancerCard } from '@/components/shared/freelancer-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Star } from 'lucide-react';
import type { Freelancer } from '@/lib/types';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // State for applied filters
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);

  // Temporary state for filters inside popover
  const [tempAvailabilityFilter, setTempAvailabilityFilter] = useState('All');
  const [tempRatingFilter, setTempRatingFilter] = useState(0);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const updateFreelancersList = () => {
      let currentFreelancers = [...staticFreelancers];
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const userProfile = JSON.parse(savedProfile);
          const profileExists = currentFreelancers.some(f => f.id === userProfile.id);

          if (userProfile.isFreelancing && !profileExists) {
            currentFreelancers = [userProfile, ...currentFreelancers];
          } else if (!userProfile.isFreelancing && profileExists) {
            currentFreelancers = currentFreelancers.filter(f => f.id !== userProfile.id);
          }
        }
      } catch (error) {
        console.error("Failed to process user profile from localStorage", error);
      }
      setFreelancers(currentFreelancers);
    }

    if (hasMounted) {
      updateFreelancersList();

      // Listen for custom event from the profile page
      window.addEventListener('profileUpdated', updateFreelancersList);

      // Listen for changes from other tabs
      window.addEventListener('storage', (e) => {
          if (e.key === 'userProfile') {
              updateFreelancersList();
          }
      });

      return () => {
          window.removeEventListener('profileUpdated', updateFreelancersList);
          window.removeEventListener('storage', (e) => {
              if (e.key === 'userProfile') {
                  updateFreelancersList();
              }
          });
      };
    }
  }, [hasMounted]);

  useEffect(() => {
    let result = freelancers;

    if (availabilityFilter !== 'All') {
      result = result.filter(f => f.availability === availabilityFilter);
    }

    if (ratingFilter > 0) {
      result = result.filter(f => f.rating >= ratingFilter);
    }

    setFilteredFreelancers(result);
  }, [availabilityFilter, ratingFilter, freelancers]);

  const handleApplyFilters = () => {
    setAvailabilityFilter(tempAvailabilityFilter);
    setRatingFilter(tempRatingFilter);
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    setTempAvailabilityFilter('All');
    setTempRatingFilter(0);
    setAvailabilityFilter('All');
    setRatingFilter(0);
    setIsFilterOpen(false);
  };

  const onOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
    if (open) {
      // When opening popover, sync temp state with applied state
      setTempAvailabilityFilter(availabilityFilter);
      setTempRatingFilter(ratingFilter);
    }
  };


  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Freelancer Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find the perfect student talent for your next project.
        </p>
      </div>
    
      {hasMounted ? (
        <>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by skill, name, or role..." className="pl-9" />
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
                      Refine your search for the perfect freelancer.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="availability">Availability</Label>
                       <Select onValueChange={setTempAvailabilityFilter} value={tempAvailabilityFilter}>
                        <SelectTrigger id="availability" className="col-span-2 h-8">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Busy">Busy</SelectItem>
                          <SelectItem value="On a project">On a project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                      <Label>Rating</Label>
                      <div className="col-span-2">
                        <RadioGroup
                          value={String(tempRatingFilter)}
                          onValueChange={(value) => setTempRatingFilter(Number(value))}
                          className="flex gap-4"
                        >
                           <div className="flex items-center space-x-2">
                              <RadioGroupItem value="0" id="r0" />
                               <Label htmlFor="r0" className="flex items-center">All</Label>
                           </div>
                          {[4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center space-x-2">
                              <RadioGroupItem value={String(rating)} id={`r${rating}`} />
                              <Label htmlFor={`r${rating}`} className="flex items-center">
                                {rating} <Star className="ml-1 h-4 w-4 text-yellow-400 fill-yellow-400" />+
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
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

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="flex flex-col h-full overflow-hidden">
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
