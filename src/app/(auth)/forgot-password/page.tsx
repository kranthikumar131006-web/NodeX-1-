'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address.',
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitted(true);
    } catch (error: any) {
      // Firebase doesn't throw an error for non-existent emails for security reasons.
      // This catch block is for other potential errors (e.g., malformed email).
      console.error('Password Reset Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Forgot Your Password?
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          No worries. Enter your email below, and we'll help you reset it.
        </p>
      </div>

      <Card className="mt-10 w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          {isSubmitted ? (
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-cyan-500" />
              <h3 className="mt-4 text-xl font-semibold">Check Your Email</h3>
              <p className="mt-2 text-muted-foreground">
                If an account with the email <span className="font-medium text-foreground">{email}</span> exists, we have sent a password reset link.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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

                <Button
                  type="button"
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  size="lg"
                  onClick={handleResetPassword}
                >
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/" className="font-medium text-cyan-600 hover:text-cyan-500">
                  Log in
                </Link>
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                New here?{' '}
                <Link href="/signup" className="font-medium text-cyan-600 hover:text-cyan-500">
                  Create an account
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
