import { hackathonTeams } from '@/lib/data';
import { TeamCard } from '@/components/shared/team-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, Plus } from 'lucide-react';

export default function HackathonTeamsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Hackathon Team Finder</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Assemble your dream team or find the perfect one to join.
        </p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by team name, required role, or skill..." className="pl-9" />
        </div>
        <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
        </Button>
         <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Team
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathonTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
