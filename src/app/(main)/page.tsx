'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Briefcase, Mail, Lock, Check, ArrowRight, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.81C34.966 9.333 29.865 7 24 7C12.955 7 4 15.955 4 27s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691c-1.645 3.123-2.623 6.643-2.623 10.309s.978 7.186 2.623 10.309l7.344-5.688C12.599 27.601 12 25.891 12 24s.599-3.601 1.65-5.312l-7.344-5.688z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-7.344 5.688C8.164 40.063 15.426 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.826 44 31.134 44 26c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState('student');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSuccess = async (userCredential: UserCredential) => {
    const user = userCredential.user;
    // Check if it's a new user from a social login
    const isNewUser =
      userCredential.providerId !== 'password' &&
      user.metadata.creationTime === user.metadata.lastSignInTime;

    if (isNewUser) {
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userRef,
        {
          id: user.uid,
          username: user.displayName || user.email?.split('@')[0],
          email: user.email,
          role: loginType,
          authProvider: user.providerData[0]?.providerId,
        },
        { merge: true }
      );
    }
    toast({
      title: 'Login Successful',
      description: 'Redirecting to your dashboard...',
    });
    router.push('/home');
  };

  const handleError = (error: any) => {
    console.error('Authentication Error:', error);
    let description = 'An unknown error occurred. Please try again.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          description = 'Invalid email or password. Please try again.';
          break;
        case 'auth/too-many-requests':
          description = 'Too many login attempts. Please try again later.';
          break;
        case 'auth/popup-closed-by-user':
          description = 'Login process was cancelled.';
          break;
        case 'auth/operation-not-allowed':
            description = 'Sign-in method is not enabled. Please enable it in the Firebase console.';
            break;
        default:
          description = error.message;
      }
    }
    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description,
    });
  };

  const handleLogin = () => {
    if (!email || !password) {
      handleError({ message: 'Email and password are required.' });
      return;
    }
    signInWithEmailAndPassword(auth, email, password).then(handleSuccess).catch(handleError);
  };

  const handleSocialLogin = (provider: GoogleAuthProvider | GithubAuthProvider) => {
    signInWithPopup(auth, provider).then(handleSuccess).catch(handleError);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
          WELCOME TO NEXUS HUB
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Connecting Talent with <span className="text-cyan-500">Opportunity</span>
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
          <Card className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1 mb-6">
            <Button
              variant="ghost"
              onClick={() => setLoginType('student')}
              className={cn(
                'transition-colors',
                loginType === 'student'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Student</span>
              {loginType === 'student' && <Check className="h-4 w-4 text-cyan-500" />}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLoginType('client')}
              className={cn(
                'transition-colors',
                loginType === 'client'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              <Briefcase className="h-5 w-5" />
              <span>Client</span>
              {loginType === 'client' && <Check className="h-4 w-4 text-cyan-500" />}
            </Button>
          </Card>

          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 uppercase font-semibold">
              LOGIN AS {loginType.toUpperCase()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {loginType === 'student' ? 'Student Email' : 'Client Email'}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-cyan-600 hover:text-cyan-500">
                  Forgot Password?
                </Link>
              </div>
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
              onClick={handleLogin}
            >
              Log in as {loginType === 'student' ? 'Student' : 'Client'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin(new GoogleAuthProvider())}
            >
              <GoogleIcon />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin(new GithubAuthProvider())}
            >
              <Github />
              GitHub
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            New here?{' '}
            <Link href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
              Create {loginType === 'student' ? 'Student' : 'Client'} Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
