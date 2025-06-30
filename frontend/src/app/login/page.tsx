'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/login';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => router.push('/dashboard'),
    onError: (err: unknown) => {
      if (err instanceof Error) setError(err.message || 'Login failed');
      else setError('Login failed');
    },
  });

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600 text-center">
            Sign In to Quickly
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              setError(null);
              mutation.mutate();
            }}
            className="flex flex-col gap-4"
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
          <div className="text-center mt-4">
            <p>
              Don&apos;t have an account?
              <span
                className="text-blue-600 underline cursor-pointer ml-1"
                onClick={() => router.push('/register')}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter') router.push('/register'); }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}