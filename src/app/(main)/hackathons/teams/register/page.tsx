
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
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import type { Hackathon } from '@/lib/types';

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
  const [lookingFor, setLookingFor] = useState<{ role: string; skills: string[] }[]>([]);
  const [currentRole, setCurrentRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAddRequirement = () => {
    if (currentRole.trim() !== '') {
      setLookingFor([
        ...lookingFor,
        {
          role: currentRole.trim(),
          skills: currentSkills.split(',').map(s => s.trim()).filter(Boolean),
        },
      ]);
      setCurrentRole('');
      setCurrentSkills('');
    }
  };
  
  const handleRemoveRequirement = (index: number) => {
    setLookingFor(lookingFor.filter((_, i) => i !== index));
  }

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
    
    try {
        const teamCollectionRef = collection(firestore, `hackathons/${hackathonId}/teams`);
        await addDoc(teamCollectionRef, {
            name: teamName,
            hackathonId,
            description,
            lookingFor,
            createdAt: new Date().toISOString(),
            members: [
                {
                    id: user.uid,
                    name: user.displayName || user.email,
                    role: 'Team Lead',
                    avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/64/64`,
                    imageHint: 'person portrait',
                }
            ],
            memberIds: [user.uid],
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
    return null; // Or a loading skeleton
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

            <div className="space-y-4">
                <Label>Role Requirements (What are you looking for?)</Label>
                <div className="space-y-2">
                    {lookingFor.map((req, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                           <div>
                             <p className="font-semibold">{req.role}</p>
                             <div className="flex flex-wrap gap-1 mt-1">
                                {req.skills.map(skill => (
                                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                ))}
                             </div>
                           </div>
                           <Button size="icon" variant="ghost" onClick={() => handleRemoveRequirement(index)}>
                             <X className="h-4 w-4"/>
                           </Button>
                        </div>
                    ))}
                </div>
                <Card className="p-4 bg-secondary/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role-needed">Role</Label>
                            <Input id="role-needed" placeholder="e.g., Frontend Developer" value={currentRole} onChange={e => setCurrentRole(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="skills-needed">Skills (comma-separated)</Label>
                            <Input id="skills-needed" placeholder="e.g., React, TypeScript" value={currentSkills} onChange={e => setCurrentSkills(e.target.value)} />
                        </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={handleAddRequirement}><Plus className="mr-2 h-4 w-4" /> Add Requirement</Button>
                </Card>
            </div>
            
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
