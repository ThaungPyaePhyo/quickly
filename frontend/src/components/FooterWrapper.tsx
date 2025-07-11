'use client';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/api/user';
import SmartFooter from '@/components/SmartFooter';

export function FooterWrapper() {
  const pathname = usePathname();
  
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    retry: false,
  });

  const getPageType = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/jobs')) return 'jobs';
    if (pathname.startsWith('/profile')) return 'profile';
    if (pathname === '/' || pathname === '/login' || pathname === '/register') return 'public';
    return 'dashboard';
  };

  return <SmartFooter user={user} page={getPageType()} />;
}