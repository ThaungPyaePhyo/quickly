'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/api/user';
import { fetchStats, fetchRecentActivity, Stats, RecActivity } from '@/api/stats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Briefcase, PlusCircle, Activity, Star, CheckCircle, TrendingUp, Calendar, Clock } from 'lucide-react';

function formatDate(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: fetchStats,
    enabled: !!user,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<RecActivity[]>({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
    enabled: !!user,
  });

  if (userLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: user?.role === 'CUSTOMER' ? 'Jobs Posted' : 'Jobs Completed',
      value: user?.role === 'CUSTOMER' ? stats?.jobsPosted : stats?.jobsCompleted,
      icon: <Briefcase className="w-5 h-5" />,
      change: '+12%',
    },
    {
      label: user?.role === 'CUSTOMER' ? 'Jobs Completed' : 'Avg. Rating',
      value: user?.role === 'CUSTOMER' ? stats?.jobsCompleted : stats?.avgRating?.toFixed?.(2) ?? stats?.avgRating,
      icon: user?.role === 'CUSTOMER'
        ? <CheckCircle className="w-5 h-5" />
        : <Star className="w-5 h-5" />,
      change: '+8%',
    },
    {
      label: 'Active Jobs',
      value: stats?.activeJobs,
      icon: <Activity className="w-5 h-5" />,
      change: '+5%',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'BOOKED': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {user?.name || '...'}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 justify-center lg:justify-start">
              <Calendar className="w-4 h-4" />
              {formatDate()}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {user?.role === 'CUSTOMER' && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/jobs/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Post a Job
                </Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/profile">
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <Card key={i} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <div className="text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value ?? '-'}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-white">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-h-80 overflow-y-auto">
                {activityLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
                {recentActivity && recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-500">No recent activity yet.</div>
                  </div>
                )}
                {recentActivity && recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {item.title}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(item.updatedAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric' 
                        })} at {new Date(item.updatedAt).toLocaleTimeString(undefined, { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Link 
                  href="/jobs" 
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Browse Jobs</div>
                    <div className="text-sm text-gray-500">Find your next opportunity</div>
                  </div>
                </Link>

                {user?.role === 'CUSTOMER' && (
                  <Link 
                    href="/jobs/new" 
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <PlusCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Post New Job</div>
                      <div className="text-sm text-gray-500">Get help with your tasks</div>
                    </div>
                  </Link>
                )}

                <Link 
                  href="/profile" 
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Update Profile</div>
                    <div className="text-sm text-gray-500">Keep your info current</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}