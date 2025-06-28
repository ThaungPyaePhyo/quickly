'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function NavBar() {
  return (
    <nav className="w-full bg-white shadow-sm py-3 px-4 flex items-center justify-between mb-6">
      <div className="font-bold text-blue-600 text-xl">Quickly</div>
      <div className="flex gap-2">
        <Button asChild variant="ghost">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/jobs">Jobs</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/profile">Profile</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/logout">Logout</Link>
        </Button>
      </div>
    </nav>
  );
}