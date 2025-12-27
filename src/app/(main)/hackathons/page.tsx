import Link from 'next/link';
import { hackathons } from '@/lib/data';
import { HackathonCard } from '@/components/shared/hackathon-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Users, Plus } from 'lucide-react';

export default function HackathonsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Hackathon Hub</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore upcoming hackathons and join the innovation wave.
        </p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, tech stack, or location..." className="pl-9" />
        </div>
        <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
        </Button>
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
        {hackathons.map((hackathon) => (
          <HackathonCard key={hackathon.id} hackathon={hackathon} />
        ))}
      </div>
    </div>
  );
}
