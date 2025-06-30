'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMe, updateMe } from '@/api/user';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  const [toggleError, setToggleError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (isAvailable: boolean) => updateMe({ isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setToggleError(null);
    },
    onError: () => setToggleError('Failed to update availability'),
  });

  if (isLoading) return <div className="flex justify-center mt-10">Loading...</div>;
  if (error || !user) return <div className="flex justify-center mt-10 text-red-500">Could not load profile.</div>;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
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
          {user.role === 'PROVIDER' && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-700">Available</span>
              <Switch
                checked={user.isAvailable}
                onCheckedChange={val => mutation.mutate(val)}
                disabled={mutation.isPending}
              />
            </div>
          )}
          {toggleError && <div className="text-red-600 text-sm">{toggleError}</div>}
        </CardContent>
      </Card>
    </main>
  );
}