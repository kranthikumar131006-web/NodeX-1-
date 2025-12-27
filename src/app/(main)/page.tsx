'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Briefcase, Mail, Lock, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loginType, setLoginType] = useState('student');
  const router = useRouter();

  const handleLogin = () => {
    // This is a mock login. In a real app, you'd have authentication logic.
    // After successful login, redirect to a dashboard.
    // For now, we'll just redirect to the old homepage content.
    router.push('/home');
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
          WELCOME TO XYZ
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Connecting Talent with{' '}
          <span className="text-cyan-500">Opportunity</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          A versatile website connecting students and clients. Students can freelance,
          register startups, or join hackathon teams via skill-matching. Clients post gigs
          or invest in ventures. The site centralizes regional hackathon visibility and team
          recruitment through direct contact info and skill verification.
        </p>
      </div>

      <Card className="mt-10 w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1 mb-6">
            <button
              onClick={() => setLoginType('student')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                loginType === 'student'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Student</span>
              {loginType === 'student' && <Check className="h-4 w-4 text-cyan-500" />}
            </button>
            <button
              onClick={() => setLoginType('customer')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                loginType === 'customer'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <Briefcase className="h-5 w-5" />
              <span>Customer</span>
               {loginType === 'customer' && <Check className="h-4 w-4 text-cyan-500" />}
            </button>
          </div>

          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 uppercase font-semibold">LOGIN DETAILS</p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {loginType === 'student' ? 'Student Access' : 'Customer Access'}
            </h2>
            <p className="text-sm text-gray-500">
              {loginType === 'student'
                ? 'Login to manage projects & teams'
                : 'Login to post gigs & find talent'}
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">
                {loginType === 'student' ? 'Student Email' : 'Customer Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="email" type="email" placeholder="student@university.edu" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>

            <Button type="button" className="w-full bg-cyan-500 hover:bg-cyan-600" size="lg" onClick={handleLogin}>
              Log in as {loginType === 'student' ? 'Student' : 'Customer'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            New here?{' '}
            <Link href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
              Create {loginType === 'student' ? 'Student' : 'Customer'} Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
