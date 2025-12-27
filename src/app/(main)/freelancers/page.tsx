import { freelancers } from '@/lib/data';
import { FreelancerCard } from '@/components/shared/freelancer-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';

export default function FreelancersPage() {
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
