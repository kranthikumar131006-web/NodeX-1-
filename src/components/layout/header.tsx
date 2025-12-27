'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/hackathons', label: 'Hackathons' },
  { href: '/freelancers', label: 'Freelance' },
];

export default function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* You can add a skeleton loader here if you want */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-50">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <X className="h-6 w-6" />
          <span className="font-bold text-lg">
            XYZ
          </span>
        </Link>
        
        <nav className="hidden items-center space-x-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
            <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
                <Link href="#">Sign Up</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
