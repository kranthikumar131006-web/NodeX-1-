import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Trophy } from 'lucide-react';
import type { Hackathon } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <Link href={`/hackathons/${hackathon.id}`}>
                <h3 className="font-headline text-lg font-semibold hover:text-primary transition-colors">{hackathon.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">by {hackathon.organizer}</p>
            </div>
            <Badge variant="secondary">{hackathon.mode}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{hackathon.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{hackathon.location}</span>
        </div>
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-primary" />
          <span>{hackathon.prize} Prize</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {hackathon.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="font-normal">{tech}</Badge>
          ))}
        </div>
        <Button asChild size="sm" className="font-medium">
          <Link href={`/hackathons/${hackathon.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
