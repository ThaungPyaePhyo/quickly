'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/api/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  if (isLoading) return <div className="flex justify-center mt-10">Loading...</div>;
  if (error || !user) return <div className="flex justify-center mt-10 text-red-500">Could not load profile.</div>;

  return (
    <main className="flex flex-col items-center min-h-screen">
      <Card className="w-full max-w-md mt-16 shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarFallback>
              {user.name
                ? user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                : 'U'}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <div className="text-zinc-500">{user.email}</div>
        </CardHeader>
        <CardContent className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-700">Role</span>
            <span className="rounded bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold uppercase">
              {user.role}
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );