import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase } from 'lucide-react';
import type { Freelancer } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { Rating } from './rating';

interface FreelancerCardProps {
  freelancer: Freelancer;
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
          <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Link href={`/freelancers/${freelancer.id}`}>
            <h3 className="font-headline text-lg font-semibold leading-tight hover:text-primary transition-colors">{freelancer.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{freelancer.tagline}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{freelancer.location}</span>
          </div>
        </div>
        <StatusBadge status={freelancer.availability} />
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <div className="flex flex-wrap gap-2">
          {freelancer.skills.slice(0, 4).map((skill) => (
            <div key={skill} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              {skill}
            </div>
          ))}
          {freelancer.skills.length > 4 && (
            <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
              +{freelancer.skills.length - 4} more
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Rating rating={freelancer.rating} totalReviews={freelancer.reviews.length} />
        <Button asChild size="sm" className="font-medium">
          <Link href={`/freelancers/${freelancer.id}`}>
            View Profile
            <Briefcase className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
