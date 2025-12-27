'use client';

import { useState, useEffect } from 'react';
import { freelancers as staticFreelancers } from '@/lib/data';
import { FreelancerCard } from '@/components/shared/freelancer-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import type { Freelancer } from '@/lib/types';

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>(staticFreelancers);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        
        // Prevent adding duplicates
        const profileExists = staticFreelancers.some(f => f.id === userProfile.id);

        if (userProfile.isFreelancing && !profileExists) {
          // Add the user's profile to the list if they are freelancing
          setFreelancers(prev => [userProfile, ...prev.filter(f => f.id !== userProfile.id)]);
        } else if (!userProfile.isFreelancing && profileExists) {
           // This part is tricky because the static list will always have the user.
           // A better approach is to filter the static list if the user shouldn't be on it.
           setFreelancers(staticFreelancers.filter(f => f.id !== userProfile.id));
        } else if (userProfile.isFreelancing && profileExists) {
            // If user is freelancing and already in static list, ensure the list is correct
            setFreelancers(staticFreelancers);
        } else {
            // If user is not freelancing and not in static list, also ensure list is correct
             setFreelancers(staticFreelancers.filter(f => f.id !== userProfile.id));
        }
      }
    } catch (error) {
      console.error("Failed to process user profile from localStorage", error);
       // On error, just show the static list
      setFreelancers(staticFreelancers);
    }
  }, []);

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Freelancer Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find the perfect student talent for your next project.
        </p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by skill, name, or role..." className="pl-9" />
        </div>
        <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {freelancers.map((freelancer) => (
          <FreelancerCard key={freelancer.id} freelancer={freelancer} />
        ))}
      </div>
    </div>
  );
}

    