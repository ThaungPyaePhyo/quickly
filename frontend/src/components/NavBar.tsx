'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/logout';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { LogOut, User, Briefcase, LayoutDashboard, Bell, X, Menu } from 'lucide-react';
import Image from 'next/image';

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const notificationRef = useRef<HTMLDivElement>(null);
  
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

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  // Enhanced notifications with better structure
  const notifications = [
    {
      id: 1,
      title: 'New Job Application',
      message: 'You have a new application for Software Engineer position',
      time: '2 minutes ago',
      unread: true,
      type: 'application' as const,
    },
    {
      id: 2,
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      time: '1 hour ago',
      unread: true,
      type: 'profile' as const,
    },
    {
      id: 3,
      title: 'Interview Scheduled',
      message: 'Interview scheduled for tomorrow at 3 PM',
      time: '2 hours ago',
      unread: false,
      type: 'interview' as const,
    },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id: number) => {
    console.log('Mark notification as read:', id);
    // Update notification count
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <Image
                  src="/favicon.svg"
                  alt="Quickly Logo"
                  width={20}
                  height={20}
                  priority
                />
              </div>
              <div className="font-bold text-slate-900 text-2xl">
                Quickly
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
                          aria-label="Close notifications"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          <Bell size={32} className="mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                              notification.unread ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.unread ? 'bg-blue-500' : 'bg-transparent'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-slate-400 text-xs mt-2">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 bg-slate-50 border-t border-gray-100">
                        <button
                          onClick={clearAllNotifications}
                          className="w-full text-center text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium py-1"
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Logout Button */}
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  variant="outline"
                  className="font-medium px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                >
                  {logoutMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
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

      {/* Tablet Navigation */}
      <nav className="hidden md:block lg:hidden w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <Image
                  src="/favicon.svg"
                  alt="Quickly logo"
                  width={20}
                  height={20}
                />
              </div>
              <div className="font-bold text-slate-900 text-xl">
                Quickly
              </div>
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                  aria-label="Notifications"
                >
                  <Bell size={22} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                aria-label="Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Tablet Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
            <div className="px-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  variant="outline"
                  className="w-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                >
                  {logoutMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
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
        )}
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <Image
                  src="/favicon.svg"
                  alt="Quickly logo"
                  width={20}
                  height={20}
                />
              </div>
              <div className="font-bold text-slate-900 text-xl">
                Quickly
              </div>
            </Link>

            {/* Mobile Notification Icon */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors duration-200 min-w-0 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Logout */}
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-slate-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
            >
              {logoutMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-medium">Loading</span>
                </>
              ) : (
                <>
                  <LogOut size={20} />
                  <span className="text-xs font-medium">Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Spacer */}
      <div className="md:hidden h-16"></div>
      
      {/* Mobile Notification Full Screen Modal */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 bg-white h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 -m-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg"
                aria-label="Close notifications"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pb-20">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <div className="bg-slate-100 rounded-full p-6 mb-4">
                    <Bell size={32} className="opacity-50" />
                  </div>
                  <p className="text-lg font-medium mb-2">No notifications</p>
                  <p className="text-sm text-center px-8">
                    When you have notifications, they'll appear here
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-slate-900 text-base">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          {notification.unread && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <button
                  onClick={clearAllNotifications}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}