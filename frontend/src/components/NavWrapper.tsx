'use client';

import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/NavBar';

export function NavWrapper() {
  const pathname = usePathname();
  const hideNav = pathname === '/' || pathname === '/login' || pathname === '/register';

  
  if (hideNav) return null;
  return <NavBar />;
}