'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api('/login', {
        method: 'POST',
        body: { email, password },
      });
      router.push('/'); 
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600 text-center">
            Login to Quickly
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}