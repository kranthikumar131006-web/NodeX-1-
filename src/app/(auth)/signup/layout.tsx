
'use client';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl text-center">
            <Skeleton className="h-10 w-48 mb-4 inline-block" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto mt-6" />
          </div>
          <Skeleton className="mt-10 w-full max-w-md h-[480px]" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
