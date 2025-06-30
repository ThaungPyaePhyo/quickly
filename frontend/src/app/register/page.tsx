'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/register';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => register(email, password, name, role),
    onSuccess: () => router.push('/login'),
    onError: (err: unknown) => {
      if (err instanceof Error) setError(err.message || 'Registration failed');
      else setError('Registration failed');
    },
  });

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600 text-center">
            Sign Up for Quickly
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
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
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
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="CUSTOMER"
                  checked={role === 'CUSTOMER'}
                  onChange={() => setRole('CUSTOMER')}
                  className="accent-blue-600"
                />
                Customer
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="PROVIDER"
                  checked={role === 'PROVIDER'}
                  onChange={() => setRole('PROVIDER')}
                  className="accent-blue-600"
                />
                Provider
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registering...' : 'Sign Up'}
            </Button>
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
           <div className="text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}