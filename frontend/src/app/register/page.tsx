'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api('/user/register', {
        method: 'POST',
        body: { email, password, name, role },
      });
      router.push('/login'); 
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600 text-center">
            Register for Quickly
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button type="submit" className="w-full">
              Register
            </Button>
            {error && <div className="text-red-600 text-center">{error}</div>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}