
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Startup } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { ArrowRight } from 'lucide-react';

interface StartupCardProps {
  startup: Startup;
}

export function StartupCard({ startup }: StartupCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex-row items-center gap-4 p-4">
        {startup.logoUrl && (
          <Image
            src={startup.logoUrl}
            alt={`${startup.name} logo`}
            width={64}
            height={64}
            className="rounded-lg object-cover"
            data-ai-hint={startup.imageHint}
          />
        )}
        <div className="flex-1">
          <Link href={`/startups/${startup.id}`}>
            <CardTitle className="font-headline text-lg hover:text-primary transition-colors">{startup.name}</CardTitle>
          </Link>
          <CardDescription className="text-xs">{startup.industry}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">{startup.tagline}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <StatusBadge status={startup.status} />
        <Button asChild variant="ghost" size="sm" className="font-medium">
          <Link href={`/startups/${startup.id}`}>
            Learn More
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
