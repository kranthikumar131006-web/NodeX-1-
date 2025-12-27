
import Link from 'next/link';
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
  CalendarIcon,
  Globe,
  HeartHandshake,
  Lightbulb,
  Linkedin,
  Rocket,
  Star,
  Users,
} from 'lucide-react';

export default function RegisterStartupPage() {
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
                  <Label htmlFor="startup-name">Startup Name *</Label>
                  <Input
                    id="startup-name"
                    placeholder="e.g. Acme Innovations"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startup-email">Startup's Email *</Label>
                  <Input
                    id="startup-email"
                    type="email"
                    placeholder="contact@startup.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select>
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
                  <Label htmlFor="incorporation-date">Incorporation Date</Label>
                  <div className="relative">
                    <Input
                      id="incorporation-date"
                      type="text"
                      placeholder="mm/dd/yyyy"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    placeholder="A catchy one-liner describing your venture"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="market-size">Target Market Size</Label>
                  <Input
                    id="market-size"
                    placeholder="e.g. $10B Global Market"
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
                    What do you provide? (Offerings/Services)
                  </Label>
                  <Textarea
                    id="offerings"
                    placeholder="List your key products, services, or solutions..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description (Detailed Pitch)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the problem you are solving and your solution in detail..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    placeholder="Where do you see the company in 5 years?"
                    rows={3}
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
                  <Label htmlFor="founder-name">Founder Name *</Label>
                  <Input id="founder-name" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cofounder-name">Co-founder Name</Label>
                  <Input
                    id="cofounder-name"
                    placeholder="Full Name (Optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founder-email">Founder Contact Email *</Label>
                  <Input
                    id="founder-email"
                    type="email"
                    placeholder="founder@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone Number</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
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
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="website" placeholder="https://..." className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                     <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="linkedin" placeholder="https://linkedin.com/company/..." className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                   <div className="relative">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>
                    <Input id="twitter" placeholder="@handle or https://x.com/..." className="pl-9" />
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
                <Button size="lg" className="w-full">
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
