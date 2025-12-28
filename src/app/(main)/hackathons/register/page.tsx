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
import { ArrowRight } from 'lucide-react';
import type { Hackathon } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function RegisterHackathonPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    date: '',
    location: '',
    mode: '',
    prize: '',
    techStack: '',
    description: '',
    officialUrl: '',
  });
  
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, mode: value }));
  };

  const handleRegister = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to register an event.',
      });
      return;
    }

    // Basic validation
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === '') {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: `Please fill out all fields.`,
        });
        return;
      }
    }

    const newHackathon: Omit<Hackathon, 'id'> = {
      userId: user.uid,
      title: formData.title,
      organizer: formData.organizer,
      date: formData.date,
      location: formData.location,
      mode: formData.mode as 'Online' | 'Offline',
      prize: formData.prize,
      techStack: formData.techStack.split(',').map(s => s.trim()),
      description: formData.description,
      officialUrl: formData.officialUrl,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
      imageHint: 'tech event',
    };

    try {
      const hackathonsCollection = collection(firestore, 'hackathons');
      await addDoc(hackathonsCollection, newHackathon);
      
      toast({
        title: "Event successfully registered",
        description: `${newHackathon.title} is now listed on the platform.`,
      });

      router.push('/hackathons');
    } catch (error) {
      console.error("Failed to register hackathon", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not register the event. Please try again.",
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
          <div className="text-sm text-muted-foreground mb-2">
            <Link href="/hackathons" className="hover:text-primary">
              Hackathons
            </Link>{' '}
            / <span className="font-medium text-foreground">Register</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Register Your Hackathon
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Showcase your event to a community of talented developers and innovators.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill out the form below to get your hackathon listed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input id="title" placeholder="e.g. AI for Good Hackathon" value={formData.title} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input id="organizer" placeholder="e.g. Tech University" value={formData.organizer} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" placeholder="e.g. October 26-27, 2024" value={formData.date} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="e.g. Tech University Campus" value={formData.location} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Mode *</Label>
                <Select onValueChange={handleSelectChange} value={formData.mode}>
                  <SelectTrigger id="mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize">Prize Pool *</Label>
                <Input id="prize" placeholder="e.g. $10,000" value={formData.prize} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="techStack">Tech Stack (comma-separated) *</Label>
                <Input id="techStack" placeholder="e.g. AI, Python, Web3" value={formData.techStack} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" placeholder="A brief description of your event..." rows={4} value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="officialUrl">Official Website URL *</Label>
                <Input id="officialUrl" type="url" placeholder="https://your-event.com" value={formData.officialUrl} onChange={handleInputChange} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="lg" onClick={handleRegister} className="font-medium">
                Register Event <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
