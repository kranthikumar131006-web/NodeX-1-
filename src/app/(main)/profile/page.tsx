
'use client';
import { useState, useRef, useEffect } from 'react';
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
  Plus,
  Rocket,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';

// Define initial data structures more robustly
const initialStudentData = {
    id: '',
    userId: '',
    name: '',
    email: '',
    avatarUrl: '',
    imageHint: 'person portrait',
    tagline: '',
    location: '',
    skills: [] as string[],
    availability: 'Available' as 'Available' | 'Busy' | 'On a project',
    rating: 0,
    reviews: [] as any[],
    portfolio: [] as any[],
    bio: '',
    isFreelancing: false, // Default to off
    education: {
      university: '',
      degree: '',
      years: '',
      current: false,
    },
    certifications: [] as { name: string; url: string; date: string; }[],
    socials: {
      resumeUrl: '',
      portfolioUrl: '',
      githubUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
    },
};

const initialClientData = {
    id: '',
    userId: '',
    companyName: '',
    contactName: '',
    email: '',
};

const ensureProtocol = (url: string) => {
    if (!url || url === '#') return '#';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
};

// Helper function to ensure all nested properties have default values
const sanitizeProfileData = (data: any) => {
  const sanitized = { ...initialStudentData, ...data };
  sanitized.education = { ...initialStudentData.education, ...(data.education || {}) };
  sanitized.socials = { ...initialStudentData.socials, ...(data.socials || {}) };
  sanitized.certifications = (data.certifications || []).map((cert: any) => ({
    name: cert.name || '',
    url: cert.url || '',
    date: cert.date || 'Not specified',
  }));
  sanitized.skills = data.skills || [];
  return sanitized;
};


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [pageState, setPageState] = useState<'loading' | 'student' | 'client' | 'error'>('loading');
  const [studentProfile, setStudentProfile] = useState(initialStudentData);
  const [clientProfile, setClientProfile] = useState(initialClientData);
  const [formData, setFormData] = useState(initialStudentData);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user auth state is determined
    }
    if (!user) {
      router.push('/');
      return;
    }

    const fetchProfileData = async () => {
      const userRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          setPageState('error');
          return;
        }
        
        const role = userDoc.data()?.role;

        if (role === 'student') {
          const profileRef = doc(firestore, 'studentProfiles', user.uid);
          const docSnap = await getDoc(profileRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const sanitizedData = sanitizeProfileData(data);
            setStudentProfile(sanitizedData);
            setFormData(sanitizedData);
          } else {
             const newProfile = {
              id: user.uid,
              userId: user.uid,
              name: user.displayName || user.email?.split('@')[0] || '',
              email: user.email || '',
              avatarUrl: user.photoURL || initialStudentData.avatarUrl,
            };
            const sanitizedData = sanitizeProfileData(newProfile);
            setStudentProfile(sanitizedData);
            setFormData(sanitizedData);
          }
          setPageState('student');
        } else if (role === 'client') {
          const profileRef = doc(firestore, 'clientProfiles', user.uid);
          const docSnap = await getDoc(profileRef);
          if (docSnap.exists()) {
            setClientProfile(docSnap.data() as typeof initialClientData);
          } else {
             setClientProfile(prev => ({
                ...initialClientData,
                id: user.uid,
                userId: user.uid,
                contactName: user.displayName || user.email?.split('@')[0] || '',
                email: user.email || '',
              }));
          }
          setPageState('client');
        } else {
          setPageState('error');
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setPageState('error');
      }
    };
    
    fetchProfileData();

  }, [user, isUserLoading, firestore, router]);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setStudentProfile(prev => ({...prev, avatarUrl: newAvatarUrl}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setFormData(sanitizeProfileData(studentProfile));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };
  
  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, education: {...prev.education, [name]: value}}));
  };

  const handleCertificationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newCerts = [...formData.certifications];
    newCerts[index] = { ...newCerts[index], [name]: value };
    setFormData(prev => ({ ...prev, certifications: newCerts }));
  }

  const handleAddCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: '', url: '', date: '' }
      ]
    }));
  };

  const handleRemoveCertification = (index: number) => {
    const newCerts = formData.certifications.filter((_, i) => i !== index);
    setFormData(prev => ({...prev, certifications: newCerts}));
  }

  const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, socials: {...prev.socials, [name]: value}}));
  }
  
  const handleSkillsChange = (newSkills: string[]) => {
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };
  
  const handleFreelancingToggle = (checked: boolean) => {
    const updatedProfile = {...studentProfile, isFreelancing: checked};
    setStudentProfile(updatedProfile); // Optimistically update UI
    if (!user) return;
    const userProfileRef = doc(firestore, 'studentProfiles', user.uid);
    setDocumentNonBlocking(userProfileRef, { isFreelancing: checked }, { merge: true });
    toast({
        title: `Freelancing mode ${checked ? 'enabled' : 'disabled'}.`,
        description: `Your profile is now ${checked ? 'public' : 'private'}.`,
    });
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    window.dispatchEvent(new CustomEvent('profileUpdated'));
  };
  
  const handleSave = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to save your profile.',
      });
      return;
    }

    if (!formData.name) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Full Name is a required field.",
        });
        return;
    }
    
    const userProfileRef = doc(firestore, 'studentProfiles', user.uid);
    const dataToSave = {
      ...formData,
      userId: user.uid,
      id: user.uid
    };

    try {
      setStudentProfile(dataToSave);
      localStorage.setItem('userProfile', JSON.stringify(dataToSave));
      window.dispatchEvent(new CustomEvent('profileUpdated'));

      setDocumentNonBlocking(userProfileRef, dataToSave, { merge: true });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
      });
    } catch (error) {
      console.error('Error initiating profile save:', error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Profile',
        description:
          (error as Error).message ||
          'There was a problem saving your profile. Please try again.',
      });
    }
  }
  
  if (pageState === 'loading') {
    return (
      <div className="container flex items-center justify-center py-12">
          <p>Loading profile...</p>
      </div>
    );
  }
  
  if (pageState === 'client') {
    return (
       <div className="bg-secondary/50">
        <div className="container mx-auto py-8 md:py-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Client Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Company Name</Label>
                  <p className="text-muted-foreground">{clientProfile.companyName || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <Label>Contact Name</Label>
                  <p className="text-muted-foreground">{clientProfile.contactName || 'Not specified'}</p>
                </div>
                 <div className="space-y-1">
                  <Label>Contact Email</Label>
                  <p className="text-muted-foreground">{clientProfile.email}</p>
                </div>
                <Button onClick={() => router.push('/freelancers')} className="mt-4 font-medium">Browse Freelancers</Button>
              </CardContent>
            </Card>
        </div>
       </div>
    );
  }

  if (pageState === 'student') {
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
                      <AvatarImage src={studentProfile.avatarUrl} alt={studentProfile.name} data-ai-hint={studentProfile.imageHint} />
                      <AvatarFallback>{studentProfile.name ? studentProfile.name.charAt(0) : 'U'}</AvatarFallback>
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
                      className="absolute bottom-1 right-1 h-8 w-8 rounded-full border-2 border-background font-medium"
                      onClick={handleEditClick}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold font-headline">{studentProfile.name || 'Your Name'}</h2>
                  <p className="text-sm text-muted-foreground">
                    {studentProfile.tagline || 'Your Tagline'}
                  </p>

                  <Dialog onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 w-full font-medium">
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
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleFormChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={formData.email} disabled />
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
                              <Input id="university" name="university" value={formData.education.university} onChange={handleEducationChange} />
                           </div>
                           <div className="grid gap-2">
                              <Label htmlFor="degree">Degree</Label>
                              <Input id="degree" name="degree" value={formData.education.degree} onChange={handleEducationChange} />
                           </div>
                           <div className="grid gap-2">
                              <Label htmlFor="years">Years</Label>
                              <Input id="years" name="years" value={formData.education.years} onChange={handleEducationChange} />
                           </div>
                        </div>

                         {/* Certifications */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">Certifications</h3>
                          {formData.certifications.map((cert, index) => (
                             <div key={index} className="p-4 border rounded-md space-y-2 relative">
                               <div className="grid gap-2">
                                 <Label>Certification Name</Label>
                                 <Input name="name" value={cert.name} onChange={(e) => handleCertificationChange(index, e)} />
                               </div>
                                <div className="grid gap-2">
                                 <Label>Link</Label>
                                 <Input name="url" value={cert.url} onChange={(e) => handleCertificationChange(index, e)} />
                               </div>
                               <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6 font-medium" onClick={() => handleRemoveCertification(index)}>
                                  <X className="h-4 w-4" />
                               </Button>
                             </div>
                          ))}
                          <Button variant="outline" className="w-full font-medium" onClick={handleAddCertification}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Certification
                          </Button>
                        </div>

                         {/* Contact & Socials */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">Contact & Socials</h3>
                           <div className="grid gap-2">
                              <Label htmlFor="resumeUrl">Resume URL</Label>
                              <Input id="resumeUrl" name="resumeUrl" value={formData.socials.resumeUrl} onChange={handleSocialsChange} />
                           </div>
                            <div className="grid gap-2">
                              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                              <Input id="portfolioUrl" name="portfolioUrl" value={formData.socials.portfolioUrl} onChange={handleSocialsChange} />
                           </div>
                            <div className="grid gap-2">
                              <Label htmlFor="githubUrl">GitHub Profile</Label>
                              <Input id="githubUrl" name="githubUrl" value={formData.socials.githubUrl} onChange={handleSocialsChange} />
                           </div>
                            <div className="grid gap-2">
                              <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                              <Input id="linkedinUrl" name="linkedinUrl" value={formData.socials.linkedinUrl} onChange={handleSocialsChange} />
                           </div>
                            <div className="grid gap-2">
                              <Label htmlFor="instagramUrl">Instagram Handle</Label>
                              <Input id="instagramUrl" name="instagramUrl" value={formData.socials.instagramUrl} onChange={handleSocialsChange} />
                           </div>
                        </div>
                      </div>
                      <DialogFooter>
                          <DialogClose asChild>
                              <Button type="button" variant="secondary" className="font-medium">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                              <Button type="submit" onClick={handleSave} className="font-medium">Save Changes</Button>
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
                        <p>{studentProfile.location || 'Not specified'}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Resume</p>
                        {studentProfile.socials.resumeUrl ? (
                        <a href={ensureProtocol(studentProfile.socials.resumeUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          View Resume <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        ) : <p>Not specified</p>}
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Past Projects
                        </p>
                        {studentProfile.socials.portfolioUrl ? (
                        <a href={ensureProtocol(studentProfile.socials.portfolioUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {studentProfile.socials.portfolioUrl.replace(/^https?:\/\//, '')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        ) : <p>Not specified</p>}
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
                         {studentProfile.socials.githubUrl ? (
                        <a href={ensureProtocol(studentProfile.socials.githubUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {studentProfile.socials.githubUrl.replace(/^https?:\/\//, '')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                         ) : <p>Not specified</p>}
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">LinkedIn</p>
                        {studentProfile.socials.linkedinUrl ? (
                        <a href={ensureProtocol(studentProfile.socials.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {studentProfile.socials.linkedinUrl.replace(/^https?:\/\//, '')}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        ): <p>Not specified</p>}
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <Instagram className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Instagram</p>
                         {studentProfile.socials.instagramUrl ? (
                        <a href={`https://instagram.com/${studentProfile.socials.instagramUrl.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary">
                          {studentProfile.socials.instagramUrl}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                         ) : <p>Not specified</p>}
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
                  {studentProfile.education.university ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Image src="/uc-berkeley-logo.svg" alt="University Logo" width={32} height={32} />
                    </div>
                    <div>
                      <p className="font-semibold">{studentProfile.education.university}</p>
                      <p className="text-sm text-muted-foreground">
                        {studentProfile.education.degree}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{studentProfile.education.years}</p>
                    </div>
                    {studentProfile.education.current && <Badge
                      variant={studentProfile.education.current ? 'default' : 'secondary'}
                      className="ml-auto shrink-0"
                    >
                      Current
                    </Badge>}
                  </div>
                  ) : (<p className="text-sm text-muted-foreground">No education information provided.</p>)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {studentProfile.skills.length > 0 ? studentProfile.skills.map((skill) => (
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
                  {studentProfile.certifications.length > 0 ? studentProfile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                           <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <a
                            href={ensureProtocol(cert.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary hover:underline"
                        >
                            {cert.name}
                        </a>
                        <p className="text-sm text-muted-foreground">{cert.date}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No certifications added yet.</p>}
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Freelancing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                      <Label htmlFor="freelancing-toggle">
                          Make my profile public
                      </Label>
                      <p className="text-xs text-muted-foreground">
                          Allow clients to find and contact you for freelance work.
                      </p>
                      </div>
                      <Switch
                          id="freelancing-toggle"
                          checked={studentProfile.isFreelancing}
                          onCheckedChange={handleFreelancingToggle}
                      />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for error state or undefined role
  return (
      <div className="container flex items-center justify-center py-12">
          <Card className="p-8 text-center">
            <CardTitle>Something Went Wrong</CardTitle>
            <CardContent>
              <p className="text-muted-foreground mt-2">We couldn't load your profile. Please try logging out and logging back in.</p>
              <Button asChild className="mt-4 font-medium">
                <Link href="/">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
      </div>
  );
}
