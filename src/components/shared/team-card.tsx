import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Mail, Target, ArrowRight, UserX } from 'lucide-react';
import type { Hackathon, HackathonTeam } from '@/lib/types';
import { Badge } from '../ui/badge';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';


interface TeamCardProps {
  team: HackathonTeam;
}

export function TeamCard({ team }: TeamCardProps) {
  const firestore = useFirestore();
  const hackathonRef = useMemoFirebase(
    () => (firestore && team.hackathonId ? doc(firestore, 'hackathons', team.hackathonId) : null),
    [firestore, team.hackathonId]
  );
  const { data: teamHackathon } = useDoc<Hackathon>(hackathonRef);
  
  const memberCount = team.members?.length || 0;
  const teamSize = team.teamSize || 4;
  const isFull = memberCount >= teamSize;

  const rolesNeeded = teamSize - memberCount;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-lg">{team.name}</CardTitle>
                {teamHackathon && <CardDescription>For: {teamHackathon.title}</CardDescription>}
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
            <span>{memberCount} / {teamSize} members</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
        <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4" /> Looking For</h4>
            {isFull || rolesNeeded <= 0 ? (
                <div className="p-2 bg-secondary/50 rounded-md text-center text-sm text-muted-foreground">
                    This team is full.
                </div>
            ) : (
                <div className="p-2 bg-secondary/50 rounded-md">
                    <p className="font-semibold text-sm">{rolesNeeded} more member{rolesNeeded > 1 ? 's' : ''}</p>
                     <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs font-normal">Any Role</Badge>
                    </div>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-2">
        <Button asChild className="w-full font-medium" disabled={isFull}>
          <Link href={`/hackathons/teams/${team.id}?hackathonId=${team.hackathonId}`}>
            {isFull ? 'Team Full' : 'View Details'}
            <ArrowRight className={cn("ml-2 h-4 w-4", isFull && "hidden")} />
          </Link>
        </Button>
        {teamHackathon && (
            <Button asChild variant="secondary" className="w-full font-medium">
                <Link href={`/hackathons/${teamHackathon.id}`}>View Hackathon</Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
