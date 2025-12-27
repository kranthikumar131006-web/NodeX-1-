import { startups } from '@/lib/data';
import { StartupCard } from '@/components/shared/startup-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';

export default function StartupsPage() {
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
        <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
    </div>
  );
}
