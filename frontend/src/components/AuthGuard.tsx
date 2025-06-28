'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/api/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, error, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      router.replace('/login');
    }
  }, [error, router]);

  if (isLoading) return null; 

  return <>{children}</>;
}