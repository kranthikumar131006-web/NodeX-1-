'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase,
  Calendar,
  Check,
  Code,
  Download,
  Edit,
  ExternalLink,
  FileText,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Award,
  X,
} from 'lucide-react';
import { freelancers } from '@/lib/data';
import { Switch } from '@/components/ui/switch';

export default function ProfilePage() {
  const [user, setUser] = useState(freelancers[0]);
  const [education, setEducation] = useState({
    university: 'University of California, Berkeley',
    degree: 'Bachelor of Science in Computer Science',
    years: '2021 - 2025 (Expected)',
    current: true,
  });
  const [certifications, setCertifications] = useState([
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services (AWS)',
      date: 'Issued Jan 2024',
      credentialUrl: '#',
      logo: '/aws-logo.svg',
    },
    {
      name: 'Google UX Design Professional Certificate',
      issuer: 'Google Career Certificates',
      date: 'Issued Aug 2023',
      credentialUrl: '#',
      logo: '/google-logo.svg',
    },
  ]);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // State for the edit form
  const [formData, setFormData] = useState({
    name: user.name,
    tagline: user.tagline,
    location: user.location,
    skills: user.skills,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSkillsChange = (newSkills: string[]) => {
    setFormData(prev => ({...prev, skills: newSkills}));
  }

  const handleSave = () => {
     setUser(prevUser => ({
        ...prevUser,
        name: formData.name,
        tagline: formData.tagline,
        location: formData.location,
        skills: formData.skills,
     }));
     // Here you would typically also save education, certifications, and social links
  }

  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Avatar className="h-full w-full border-4 border-primary/20">
                    <AvatarImage src={avatarPreview ?? user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-1 right-1 h-8 w-8 rounded-full border-2 border-background"
                    onClick={handleEditClick}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {user.tagline}
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4 w-full">
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      {/* Personal Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Personal Information</h3>
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleFormChange} />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="tagline">Tagline</Label>
                           <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleFormChange} />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="location">Location</Label>
                           <Input id="location" name="location" value={formData.location} onChange={handleFormChange} />
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Skills</h3>
                        <div className="grid gap-2">
                           <Label>Your skills</Label>
                           <div className="flex flex-wrap gap-2">
                            {formData.skills.map(skill => (
                               <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                {skill}
                                <button onClick={() => handleSkillsChange(formData.skills.filter(s => s !== skill))}>
                                  <X className="h-3 w-3"/>
                                </button>
                               </Badge>
                            ))}
                           </div>
                           <Input placeholder="Add a new skill and press Enter" onKeyDown={(e) => {
                             if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                               e.preventDefault();
                               if (!formData.skills.includes(e.currentTarget.value.trim())) {
                                handleSkillsChange([...formData.skills, e.currentTarget.value.trim()]);
                               }
                               e.currentTarget.value = '';
                             }
                           }}/>
                        </div>
                      </div>

                       {/* Education */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Education</h3>
                         <div className="grid gap-2">
                            <Label htmlFor="university">University</Label>
                            <Input id="university" defaultValue={education.university} />
                         </div>
                         <div className="grid gap-2">
                            <Label htmlFor="degree">Degree</Label>
                            <Input id="degree" defaultValue={education.degree} />
                         </div>
                         <div className="grid gap-2">
                            <Label htmlFor="years">Years</Label>
                            <Input id="years" defaultValue={education.years} />
                         </div>
                      </div>

                       {/* Certifications */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Certifications</h3>
                        {certifications.map((cert, index) => (
                           <div key={index} className="p-4 border rounded-md space-y-2">
                             <div className="grid gap-2">
                               <Label>Certification Name</Label>
                               <Input defaultValue={cert.name} />
                             </div>
                              <div className="grid gap-2">
                               <Label>Issuer</Label>
                               <Input defaultValue={cert.issuer} />
                             </div>
                           </div>
                        ))}
                        <Button variant="outline" className="w-full">Add Certification</Button>
                      </div>

                       {/* Contact & Socials */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Contact & Socials</h3>
                         <div className="grid gap-2">
                            <Label>Resume URL</Label>
                            <Input defaultValue="#" />
                         </div>
                          <div className="grid gap-2">
                            <Label>Portfolio URL</Label>
                            <Input defaultValue="portfolio.alexj.dev" />
                         </div>
                          <div className="grid gap-2">
                            <Label>GitHub Profile</Label>
                            <Input defaultValue="github.com/alexj" />
                         </div>
                          <div className="grid gap-2">
                            <Label>LinkedIn Profile</Label>
                            <Input defaultValue="linkedin.com/in/alexj" />
                         </div>
                          <div className="grid gap-2">
                            <Label>Instagram Handle</Label>
                            <Input defaultValue="@alex_codes" />
                         </div>
                      </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" onClick={handleSave}>Save Changes</Button>
                        </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                      <p>{user.location}</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Resume</p>
                      <Link href="#" className="flex items-center hover:text-primary">
                        View Resume <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Past Projects
                      </p>
                      <Link href="#" className="flex items-center hover:text-primary">
                        portfolio.alexj.dev{' '}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    <div>
                      <p className="text-xs text-muted-foreground">GitHub</p>
                      <Link href="#" className="flex items-center hover:text-primary">
                        github.com/alexj{' '}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Linkedin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">LinkedIn</p>
                      <Link href="#" className="flex items-center hover:text-primary">
                        linkedin.com/in/alexj
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Instagram</p>
                      <Link href="#" className="flex items-center hover:text-primary">
                        @alex_codes
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </li>
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
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Image src="/uc-berkeley-logo.svg" alt="UC Berkeley Logo" width={32} height={32} />
                  </div>
                  <div>
                    <p className="font-semibold">{education.university}</p>
                    <p className="text-sm text-muted-foreground">
                      {education.degree}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{education.years}</p>
                  </div>
                  <Badge
                    variant={education.current ? 'default' : 'secondary'}
                    className="ml-auto shrink-0"
                  >
                    Current
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1 text-sm font-normal">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </div>
                <Button variant="link" className="text-primary">Add New</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                         <Image src={cert.logo} alt={`${cert.issuer} Logo`} width={32} height={32} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <Link
                        href={cert.credentialUrl}
                        className="mt-1 flex items-center text-sm text-primary hover:underline"
                      >
                        Show Credential <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">{cert.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                 <Label htmlFor="freelancing" className="flex items-center gap-3 cursor-pointer">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="font-medium">Interested in freelancing</span>
                </Label>
                <Switch id="freelancing" defaultChecked />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
