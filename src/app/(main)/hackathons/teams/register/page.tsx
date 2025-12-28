

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X, Users, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { Hackathon } from '@/lib/types';

type NewMember = {
  name: string;
  role: string;
  skills: string[];
};

export default function RegisterTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const hackathonsQuery = useMemoFirebase(
    () => collection(firestore, 'hackathons'),
    [firestore]
  );
  const { data: hackathons } = useCollection<Hackathon>(hackathonsQuery);

  const [teamName, setTeamName] = useState('');
  const [hackathonId, setHackathonId] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [members, setMembers] = useState<NewMember[]>([]);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const leaderCount = 1;
    const numberOfMemberFields = Math.max(0, teamSize - leaderCount);

    setMembers(currentMembers => {
      const newMembers = [...currentMembers];
      while (newMembers.length < numberOfMemberFields) {
        newMembers.push({ name: '', role: '', skills: [] });
      }
      return newMembers.slice(0, numberOfMemberFields);
    });

  }, [teamSize, user]);

  const handleMemberChange = (index: number, field: keyof NewMember, value: string | string[]) => {
    const updatedMembers = members.map((member, i) => {
      if (i === index) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setMembers(updatedMembers);
  };
  
  const handleRegister = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to register a team.',
      });
      return;
    }

    if (!teamName || !hackathonId || !description) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out Team Name, Hackathon, and Description.",
        });
        return;
    }
    
    const teamLead = {
        id: user.uid,
        name: user.displayName || user.email || 'Team Lead',
        role: 'Team Lead',
        email: user.email || '',
        avatarUrl: user.photoURL || '',
        imageHint: 'person portrait',
        skills: [],
    };

    const additionalMembers = members
      .filter(m => m.name && m.role) // Only include members with a name and role
      .map((member, index) => ({
        id: `member-${Date.now()}-${index}`, // Temporary unique ID
        name: member.name,
        role: member.role,
        avatarUrl: '',
        imageHint: 'person portrait',
        skills: member.skills,
      }));

    const allMembers = [teamLead, ...additionalMembers];
    const openSpots = teamSize - allMembers.length;
    const lookingFor = openSpots > 0 ? Array(openSpots).fill({ role: 'Any Role', skills: [] }) : [];


    try {
        const teamCollectionRef = collection(firestore, `hackathons/${hackathonId}/teams`);
        await addDoc(teamCollectionRef, {
            name: teamName,
            hackathonId,
            description,
            lookingFor,
            teamSize,
            createdAt: serverTimestamp(),
            members: allMembers,
            memberIds: allMembers.map(m => m.id),
        });

      toast({
        title: "Team successfully registered",
        description: `${teamName} is now ready for the hackathon.`,
      });

      router.push('/hackathons/teams');
    } catch (error) {
      console.error("Failed to register team", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not register your team. Please try again.",
      });
    }
  };
  
  if (!hasMounted) {
    return null; 
  }

  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/hackathons/teams" className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Team Finder
            </Link>
          </Button>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Register Your Team
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Assemble your squad and get ready to innovate.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>
              Fill out the form below to create your hackathon team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="team-name">Team Name *</Label>
                <Input id="team-name" placeholder="e.g. Code Crushers" value={teamName} onChange={e => setTeamName(e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="hackathon">For Hackathon *</Label>
                 <Select onValueChange={setHackathonId} value={hackathonId}>
                  <SelectTrigger id="hackathon">
                    <SelectValue placeholder="Select a hackathon" />
                  </SelectTrigger>
                  <SelectContent>
                    {(hackathons || []).map(hackathon => (
                        <SelectItem key={hackathon.id} value={hackathon.id}>{hackathon.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Team Description *</Label>
                <Textarea id="description" placeholder="What is your team's mission?" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="email">Your Contact Email (as Team Lead)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={user?.email || ''} readOnly className="pl-9 bg-secondary" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="team-size">Total Team Size (including you)</Label>
                </div>
                <Input
                    id="team-size"
                    type="number"
                    min="1"
                    placeholder="Enter team size"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                />
            </div>
            
            {members.length > 0 && (
                 <div className="space-y-4">
                    <Label>Add Your Current Team Members</Label>
                     {members.map((member, index) => (
                        <Card key={index} className="p-4 bg-secondary/50">
                           <CardHeader className="p-0 mb-4">
                            <CardTitle className="text-md">Team Member {index + 2}</CardTitle>
                           </CardHeader>
                           <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`member-name-${index}`}>Member Name</Label>
                                    <Input id={`member-name-${index}`} placeholder="e.g., Jane Doe" value={member.name} onChange={e => handleMemberChange(index, 'name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`member-role-${index}`}>Role</Label>
                                    <Input id={`member-role-${index}`} placeholder="e.g., Frontend Developer" value={member.role} onChange={e => handleMemberChange(index, 'role', e.target.value)} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor={`member-skills-${index}`}>Skills (comma-separated)</Label>
                                    <Input id={`member-skills-${index}`} placeholder="e.g., React, TypeScript, Figma" value={member.skills.join(', ')} onChange={e => handleMemberChange(index, 'skills', e.target.value.split(',').map(s => s.trim()))} />
                                </div>
                           </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex justify-end">
              <Button size="lg" onClick={handleRegister}>
                Create Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
