'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function SignupPage() {
  const [loginType, setLoginType] = useState('student');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSuccess = async (userCredential: UserCredential) => {
    const user = userCredential.user;
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(
      userRef,
      {
        id: user.uid,
        username: user.email?.split('@')[0],
        email: user.email,
        role: loginType,
        authProvider: user.providerData[0]?.providerId || 'password',
      },
      { merge: true }
    );
    toast({
      title: 'Account Created',
      description: 'Redirecting to your profile...',
    });
    router.push('/profile');
  };

  const handleError = (error: any) => {
    console.error('Authentication Error:', error);
    let description = 'An unknown error occurred. Please try again.';
    if (error.code) {
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
          description = error.message;
      }
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
          Create Your Account
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Start your journey by creating a student or client account to connect with a world of opportunities.
        </p>
      </div>

      <Card className="mt-10 w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              CREATE A {loginType.toUpperCase()} ACCOUNT
            </p>
          </div>

          <div className="space-y-4">
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
