import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { freelancers, startups, hackathons } from '@/lib/data';
import { FreelancerCard } from '@/components/shared/freelancer-card';
import { StartupCard } from '@/components/shared/startup-card';
import { HackathonCard } from '@/components/shared/hackathon-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Briefcase, Rocket, Trophy } from 'lucide-react';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-secondary/50">
           <div className="absolute inset-0">
                {heroImage && (
                    <Image
                    src={heroImage.imageUrl}
                    alt="Nexus Hub Hero Image"
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
           </div>
          <div className="container relative text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
              Connect. Create. Conquer.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Nexus Hub is your launchpad. Discover freelance gigs, assemble your hackathon dream team, and connect with visionary startups.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/freelancers">Find Talent</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/hackathons">Find Opportunities</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Freelancers */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3"><Briefcase className="h-8 w-8 text-primary" />Featured Freelancers</h2>
              <Button asChild variant="ghost">
                <Link href="/freelancers">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {freelancers.slice(0, 4).map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Startups */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3"><Rocket className="h-8 w-8 text-primary" />Visionary Startups</h2>
              <Button asChild variant="ghost">
                <Link href="/startups">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Hackathons */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-3xl font-bold flex items-center gap-3"><Trophy className="h-8 w-8 text-primary" />Upcoming Hackathons</h2>
              <Button asChild variant="ghost">
                <Link href="/hackathons">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map((hackathon) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
