
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import {
  ArrowRight,
  BadgeCheck,
  Globe,
  HeartHandshake,
  Lightbulb,
  Linkedin,
  Rocket,
  Star,
  Users,
} from 'lucide-react';
import type { Startup } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';

export default function RegisterStartupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    yearsInIndustry: '',
    tagline: '',
    marketSize: '',
    offerings: '',
    description: '',
    vision: '',
    founderName: '',
    cofounderName: '',
    founderEmail: '',
    contactPhone: '',
    website: '',
    linkedin: '',
    twitter: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value }));
  };

  const validateForm = () => {
    const requiredFields: (keyof typeof formData)[] = [
      'name',
      'email',
      'industry',
      'yearsInIndustry',
      'tagline',
      'marketSize',
      'offerings',
      'description',
      'vision',
      'founderName',
      'founderEmail',
      'website',
      'linkedin',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: `Please fill out the "${field.replace(/([A-Z])/g, ' $1')}" field.`,
        });
        return false;
      }
    }
    return true;
  };


  const handleRegister = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to register a startup.',
      });
      return;
    }
    if (!validateForm()) {
        return;
    }

    const newStartup = {
      // id will be auto-generated
      userId: user.uid,
      name: formData.name,
      logoUrl: 'https://picsum.photos/seed/new-startup/64/64',
      imageHint: 'abstract logo',
      tagline: formData.tagline,
      industry: formData.industry,
      location: 'Not specified',
      foundingYear: new Date().getFullYear(),
      yearsInIndustry: parseInt(formData.yearsInIndustry) || 0,
      problem: formData.description,
      solution: formData.offerings,
      vision: formData.vision,
      marketSize: formData.marketSize,
      contactEmail: formData.email,
      offerings: [], // simplified for db
      milestones: [], // simplified for db
      fundingStage: 'Pre-Seed', // Default value
      status: 'Accepting Partnerships' as 'Hiring' | 'Funding Open' | 'Accepting Partnerships', // Default value
      founders: [{
        id: `f${Date.now()}`,
        name: formData.founderName,
        role: 'Founder',
        avatarUrl: 'https://picsum.photos/seed/new-founder/64/64',
        imageHint: 'person portrait'
      }],
    };

    try {
        const startupsCollection = collection(firestore, 'startups');
        addDocumentNonBlocking(startupsCollection, newStartup);

        toast({
            title: (
                <div className="flex items-center">
                    <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Startup successfully registered</span>
                </div>
            ),
            description: `${newStartup.name} is now listed on the platform.`,
        });

        router.push('/startups');
    } catch (error) {
        console.error("Failed to save startup to firestore", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not register the startup. Please try again.",
        });
    }
  };


  return (
    <div className="bg-secondary/30">
      <div className="container mx-auto py-8 md:py-12">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">
            <Link href="/startups" className="hover:text-primary">
              Startups
            </Link>{' '}
            / <span className="font-medium text-foreground">Register</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Register Your Startup
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Connect with investors, find talent, and accelerate your growth.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Essentials Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Rocket className="h-6 w-6 text-primary" />
                  Essentials
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Startup Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Acme Innovations"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Startup's Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@startup.com"
                     value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={handleSelectChange} value={formData.industry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">Artificial Intelligence</SelectItem>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsInIndustry">Years of Experience *</Label>
                   <Input
                    id="yearsInIndustry"
                    type="number"
                    placeholder="e.g. 5"
                    value={formData.yearsInIndustry}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Input
                    id="tagline"
                    placeholder="A catchy one-liner describing your venture"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="marketSize">Target Market Size *</Label>
                  <Input
                    id="marketSize"
                    placeholder="e.g. $10B Global Market"
                    value={formData.marketSize}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* The Core Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  The Core
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="offerings">
                    What do you provide? (Offerings/Services) *
                  </Label>
                  <Textarea
                    id="offerings"
                    placeholder="List your key products, services, or solutions..."
                    rows={3}
                     value={formData.offerings}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description (Detailed Pitch) *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the problem you are solving and your solution in detail..."
                    rows={5}
                     value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Vision Statement *</Label>
                  <Textarea
                    id="vision"
                    placeholder="Where do you see the company in 5 years?"
                    rows={3}
                     value={formData.vision}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team & Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Team & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="founderName">Founder Name *</Label>
                  <Input id="founderName" placeholder="Full Name" value={formData.founderName} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cofounderName">Co-founder Name</Label>
                  <Input
                    id="cofounderName"
                    placeholder="Full Name (Optional)"
                     value={formData.cofounderName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founderEmail">Founder Contact Email *</Label>
                  <Input
                    id="founderEmail"
                    type="email"
                    placeholder="founder@example.com"
                     value={formData.founderEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone Number</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                     value={formData.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Online Presence Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  Online Presence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <div className="relative">
                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="website" placeholder="https://..." className="pl-9" value={formData.website} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn *</Label>
                  <div className="relative">
                     <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="linkedin" placeholder="https://linkedin.com/company/..." className="pl-9" value={formData.linkedin} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                   <div className="relative">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>
                    <Input id="twitter" placeholder="@handle or https://x.com/..." className="pl-9" value={formData.twitter} onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Register Card */}
            <Card className="bg-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Star className="h-5 w-5" />
                  Why Register?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-primary/90">
                <p className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4" />
                  Connect with regional investors
                </p>
                <p className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" />
                  Post gigs and hackathon challenges
                </p>
              </CardContent>
            </Card>

            <div className="space-y-2">
                <Button size="lg" className="w-full" onClick={handleRegister}>
                    Register Startup <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="w-full">
                    Save Draft
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    