'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { hackathons, hackathonTeams, freelancers } from '@/lib/data';
import {
  Badge,
  Briefcase,
  Calendar,
  ChevronRight,
  Code,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Star,
  Users,
  Target,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id;
  const team = hackathonTeams.find(t => t.id === teamId);
  const hackathon = team ? hackathons.find(h => h.id === team.hackathonId) : undefined;
  const teamLead = team ? freelancers.find(f => f.name === team.members.find(m => m.role.includes('Lead'))?.name) : undefined;
  const isFull = team ? team.members.length >= 4 : false;


  if (!team) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Team not found</h1>
        <p className="text-muted-foreground">
          The team you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/hackathons/teams">Back to Teams</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2 flex items-center">
            <Link href="/hackathons" className="hover:text-primary">
              Hackathons
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="/hackathons/teams" className="hover:text-primary">
              Teams
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-foreground">{team.name}</span>
          </div>
        </div>

        {/* Header Section */}
        <header className="relative mb-8 rounded-xl bg-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
               <div className="flex -space-x-4 overflow-hidden ring-4 ring-primary/20 rounded-full">
                {team.members.map(member => (
                    <Avatar key={member.id} className="inline-block h-20 w-20 rounded-full border-2 border-background">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
                </div>
            </div>
            <div className="flex-1 text-center md:text-left">
                <div className='flex items-center gap-4 justify-center md:justify-start'>
                    <h1 className="font-headline text-4xl font-bold">{team.name}</h1>
                    <Badge variant={isFull ? 'destructive' : 'secondary'} className='text-base'>{team.members.length} / 4 members</Badge>
                </div>
                {hackathon && (
                    <p className="mt-1 text-lg text-muted-foreground">
                        Participating in <Link href={`/hackathons/${hackathon.id}`} className="text-primary hover:underline font-semibold">{hackathon.title}</Link>
                    </p>
                )}
                <p className="mt-2 text-muted-foreground max-w-xl">{team.description}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl"><Users className="h-6 w-6 text-primary" />Team Members</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {team.members.map(member => {
                         const freelancerProfile = freelancers.find(f => f.name === member.name);
                         const memberCard = (
                             <div className="flex items-center gap-4 p-4 border rounded-lg bg-background/50">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-sm text-primary font-medium">{member.role}</p>
                                </div>
                             </div>
                         );

                         if (freelancerProfile) {
                           return (
                            <Link key={member.id} href={`/freelancers/${freelancerProfile.id}`} className="transition-transform hover:-translate-y-1 block">
                                {memberCard}
                            </Link>
                           );
                         }
                         
                         return <div key={member.id}>{memberCard}</div>;
                       })}
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl"><Target className="h-5 w-5 text-primary"/>We're Looking For</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isFull ? (
                             <div className="p-3 bg-secondary/50 rounded-lg text-center text-muted-foreground">
                                <UserX className="h-6 w-6 mx-auto mb-2" />
                                This team is currently full.
                            </div>
                        ) : team.lookingFor.map((role, index) => (
                            <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                                <p className="font-semibold">{role.role}</p>

                                {role.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {role.skills.map(skill => (
                                        <Badge key={skill} variant="outline" className="font-normal text-xs">{skill}</Badge>
                                    ))}
                                </div>
                                )}
                            </div>
                        ))}
                         {hackathon && !isFull && (
                            <div className='mt-4'>
                                <p className="text-xs text-muted-foreground mb-2">Team is aligned with hackathon tech stack:</p>
                                <div className="flex flex-wrap gap-1">
                                    {hackathon.techStack.map(tech => (
                                        <Badge key={tech} variant="secondary">{tech}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                 {teamLead && (
                    <Button asChild className="w-full" size="lg" disabled={isFull}>
                        <a href={isFull ? '#' : `https://mail.google.com/mail/?view=cm&fs=1&to=${teamLead.email}`} target="_blank" rel="noopener noreferrer">
                            <Mail className="mr-2 h-4 w-4" /> {isFull ? 'Team Full' : 'Contact Team Lead'}
                        </a>
                    </Button>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
