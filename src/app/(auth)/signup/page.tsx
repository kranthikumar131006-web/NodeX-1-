'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, ArrowRight, Briefcase, User as UserIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSuccess = async (userCredential: UserCredential) => {
    const user = userCredential.user;
    
    // Create the main user document
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(
      userRef,
      {
        id: user.uid,
        username: user.email?.split('@')[0],
        email: user.email,
        role: role,
        authProvider: user.providerData[0]?.providerId || 'password',
      },
      { merge: true }
    );

    // Create the role-specific profile document
    if (role === 'client') {
        const clientProfileRef = doc(firestore, `users/${user.uid}/clientProfiles/${user.uid}`);
        await setDoc(clientProfileRef, {
            id: user.uid,
            userId: user.uid,
            companyName: companyName,
            contactName: name || user.email?.split('@')[0],
            email: user.email,
        });
        toast({
            title: 'Account Created',
            description: 'Redirecting to the freelancers page...',
        });
        router.push('/freelancers');

    } else { // 'student'
        const studentProfileRef = doc(firestore, `users/${user.uid}/studentProfiles/${user.uid}`);
        await setDoc(studentProfileRef, {
            id: user.uid,
            userId: user.uid,
            firstName: '',
            lastName: '',
            email: user.email,
            bio: '',
            location: '',
            portfolioLinks: [],
            skills: [],
            availability: 'Available',
            socialMediaLinks: [],
        });
        toast({
            title: 'Account Created',
            description: 'Redirecting to your profile...',
        });
        router.push('/profile');
    }
  };

  const handleError = (error: any) => {
    console.error('Authentication Error:', error);
    let description = 'An unknown error occurred. Please try again.';
    if (error && (error.code || error.message)) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          description = 'This email is already in use. Please try logging in.';
          break;
        case 'auth/weak-password':
          description = 'The password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
            description = 'The email address is not valid. Please enter a valid email.';
            break;
        default:
          description = error.message || 'An unexpected error occurred.';
      }
    } else if (error && typeof error === 'object' && error.message) {
      description = error.message;
    }
    toast({
      variant: 'destructive',
      title: 'Sign-up Failed',
      description,
    });
  };

  const handleSignup = () => {
    if (!email || !password) {
      handleError({ message: 'Email and password are required.' });
      return;
    }
    if (role === 'client' && !name) {
        handleError({ message: 'Name is a required field.' });
        return;
    }
    createUserWithEmailAndPassword(auth, email, password).then(handleSuccess).catch(handleError);
  };
  
  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
          JOIN NEXUS HUB
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Create Your {role === 'student' ? 'Student' : 'Client'} Account
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Start your journey by creating an account to connect with a world of opportunities.
        </p>
      </div>

      <Card className="mt-10 w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              CREATE A {role.toUpperCase()} ACCOUNT
            </p>
          </div>

          <div className="space-y-4">
            {role === 'client' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Your Company Inc."
                      className="pl-10"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-cyan-500 hover:bg-cyan-600"
              size="lg"
              onClick={handleSignup}
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/" className="font-medium text-cyan-600 hover:text-cyan-500">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
