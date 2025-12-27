import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Mail, Target, ArrowRight } from 'lucide-react';
import type { HackathonTeam } from '@/lib/types';
import { Badge } from '../ui/badge';
import { hackathons } from '@/lib/data';


interface TeamCardProps {
  team: HackathonTeam;
}

export function TeamCard({ team }: TeamCardProps) {
  const teamHackathon = hackathons.find(h => h.id === team.hackathonId);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-lg">{team.name}</CardTitle>
                {teamHackathon && <CardDescription>For: <Link href={`/hackathons/${teamHackathon.id}`} className="hover:underline text-primary">{teamHackathon.title}</Link></CardDescription>}
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex -space-x-2 overflow-hidden">
                        {team.members.map(member => (
                            <Avatar key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        ))}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{team.members.map(m => m.name).join(', ')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <div className='flex items-center gap-2 text-sm text-muted-foreground mb-4'>
            <Users className="h-4 w-4" />
            <span>{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
        <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4" /> Looking For</h4>
            {team.lookingFor.map((role, index) => (
                <div key={index} className="p-2 bg-secondary/50 rounded-md">
                    <p className="font-semibold text-sm">{role.role}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {role.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs font-normal">{skill}</Badge>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/hackathons/teams/${team.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
