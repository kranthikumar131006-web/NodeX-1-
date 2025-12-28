'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  User,
  GraduationCap,
  Sparkles,
  Award,
  ExternalLink,
  Instagram,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { Rating } from '@/components/shared/rating';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Freelancer } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const ensureProtocol = (url: string) => {
  if (!url || url === '#') return '#';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

export default function FreelancerDetailPage() {
  const params = useParams();
  const freelancerId = params.id as string;
  const firestore = useFirestore();

  const freelancerRef = useMemoFirebase(
    () => (firestore && freelancerId ? doc(firestore, 'studentProfiles', freelancerId) : null),
    [firestore, freelancerId]
  );
  const { data: freelancer, isLoading } = useDoc<Freelancer>(freelancerRef);

  if (isLoading) {
    return (
      <div className="bg-secondary/30">
        <div className="container mx-auto py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-8 lg:col-span-1">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="flex flex-col gap-8 lg:col-span-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Freelancer not found</h1>
        <p className="text-muted-foreground">
          The freelancer you are looking for does not exist.
        </p>
        <Button asChild className="mt-4 font-medium">
          <Link href="/freelancers">Back to Freelancers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6 text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary/20">
                  <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
                  <AvatarFallback>{freelancer.name ? freelancer.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold font-headline">{freelancer.name || 'Student Name'}</h2>
                <p className="text-sm text-muted-foreground">{freelancer.tagline || 'Student tagline'}</p>
                 <Button asChild className="mt-4 w-full font-medium" size="lg">
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${freelancer.email}`} target="_blank" rel="noopener noreferrer">
                        <Mail className="mr-2 h-4 w-4" /> Contact
                    </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact & Socials</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p>{freelancer.location || 'Not specified'}</p>
                    </div>
                  </li>
                  {freelancer.socials?.resumeUrl && (
                    <li className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Resume</p>
                        <a href={ensureProtocol(freelancer.socials.resumeUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          View Resume <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </li>
                  )}
                  {freelancer.socials?.portfolioUrl && (
                     <li className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Past Projects</p>
                        <a href={ensureProtocol(freelancer.socials.portfolioUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {freelancer.socials.portfolioUrl.replace(/^https?:\/\//, '')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </li>
                  )}
                   {freelancer.socials?.githubUrl && (
                     <li className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">GitHub</p>
                        <a href={ensureProtocol(freelancer.socials.githubUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {freelancer.socials.githubUrl.replace(/^https?:\/\//, '')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </li>
                  )}
                  {freelancer.socials?.linkedinUrl && (
                    <li className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">LinkedIn</p>
                        <a href={ensureProtocol(freelancer.socials.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {freelancer.socials.linkedinUrl.replace(/^https?:\/\//, '')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </li>
                  )}
                  {freelancer.socials?.instagramUrl && (
                    <li className="flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Instagram</p>
                        <a href={`https://instagram.com/${freelancer.socials.instagramUrl.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {freelancer.socials.instagramUrl}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent>
                {freelancer.education?.university ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                       <Image src="/uc-berkeley-logo.svg" alt="University Logo" width={32} height={32} />
                    </div>
                    <div>
                      <p className="font-semibold">{freelancer.education.university}</p>
                      <p className="text-sm text-muted-foreground">{freelancer.education.degree}</p>
                      <p className="text-xs text-muted-foreground mt-1">{freelancer.education.years}</p>
                    </div>
                    {freelancer.education.current && (
                      <Badge variant="default" className="ml-auto shrink-0">Current</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No education information provided.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {freelancer.skills.length > 0 ? freelancer.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1 text-sm font-normal">
                    {skill}
                  </Badge>
                )) : <p className="text-sm text-muted-foreground">No skills added yet.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(freelancer.certifications || []).length > 0 ? freelancer.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Image src={cert.logo || '/generic-logo.svg'} alt={`${cert.issuer} Logo`} width={32} height={32} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <a
                        href={ensureProtocol(cert.credentialUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center text-sm text-primary hover:underline"
                      >
                        Show Credential <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">{cert.date}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No certifications added yet.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}