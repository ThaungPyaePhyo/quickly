'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/logout';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export function NavBar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="w-full bg-white shadow-sm py-3 px-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
            src="/favicon.svg"
            alt="Quickly logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <div className="font-bold text-blue-600 text-xl">Quickly</div>
        </Link>

        <div className="hidden md:flex gap-2">
          <Button asChild variant="ghost">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/jobs">Jobs</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t pt-4">
          <div className="flex flex-col space-y-2">
            <Button asChild variant="ghost" className="justify-start" onClick={() => setIsMenuOpen(false)}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start" onClick={() => setIsMenuOpen(false)}>
              <Link href="/jobs">Jobs</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start" onClick={() => setIsMenuOpen(false)}>
              <Link href="/profile">Profile</Link>
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                logoutMutation.mutate();
                setIsMenuOpen(false);
              }}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}