'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function SmartMatchPage() {
  return (
    <div className="container flex items-center justify-center py-8 md:py-12" style={{minHeight: 'calc(100vh - 16rem)'}}>
        <Card className="max-w-2xl w-full">
            <CardContent className="p-10 text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="font-headline text-2xl font-bold tracking-tight">Feature Coming Soon!</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    The "Smart Match" functionality will be implemented during the offline hackathon.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
