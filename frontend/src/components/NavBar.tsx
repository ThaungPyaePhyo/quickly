'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/logout';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';

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

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="bg-slate-900 p-2 rounded-lg">
                <Image
                  src="/favicon.svg"
                  alt="Quickly logo"
                  width={20}
                  height={20}
                  className="w-5 h-5 filter brightness-0 invert"
                />
              </div>
              <div className="font-bold text-slate-900 text-2xl">
                Quickly
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {logoutMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Logo Header - Simple and Clean */}
      <div className="md:hidden w-full bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="px-4">
          <div className="flex items-center justify-center h-16">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3"
            >
              <div className="bg-slate-900 p-2 rounded-lg">
                <Image
                  src="/favicon.svg"
                  alt="Quickly logo"
                  width={20}
                  height={20}
                  className="w-5 h-5 filter brightness-0 invert"
                />
              </div>
              <div className="font-bold text-slate-900 text-xl">
                Quickly
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 py-2 px-3 text-slate-500 hover:text-slate-900 transition-colors duration-200 min-w-0"
                >
                  <Icon size={22} />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Bottom Nav Logout Button */}
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex flex-col items-center gap-1 py-2 px-3 text-slate-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
            >
              {logoutMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-medium">Loading</span>
                </>
              ) : (
                <>
                  <LogOut size={22} />
                  <span className="text-xs font-medium">Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Spacer */}
      <div className="md:hidden h-16"></div>
    </>
  );
}