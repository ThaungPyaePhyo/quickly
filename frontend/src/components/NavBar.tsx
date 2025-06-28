'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/logout';
import { useQueryClient } from '@tanstack/react-query';

export function NavBar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear(); 
      router.push('/login');
    },
  });

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
        <Button
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </nav>
  );
}