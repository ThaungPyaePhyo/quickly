'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/api/user';
import { fetchStats, fetchRecentActivity } from '@/api/stats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, Briefcase, PlusCircle, Activity, Star, CheckCircle } from 'lucide-react';

function formatDate(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    enabled: !!user,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
    enabled: !!user,
  });

  if (userLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <span className="animate-spin rounded-full border-4 border-blue-300 border-t-transparent w-8 h-8" />
      </div>
    );
  }

  const statCards = [
    {
      label: user?.role === 'CUSTOMER' ? 'Jobs Posted' : 'Jobs Completed',
      value: user?.role === 'CUSTOMER' ? stats?.jobsPosted : stats?.jobsCompleted,
      icon: <Briefcase className="w-6 h-6 text-blue-500" />,
    },
    {
      label: user?.role === 'CUSTOMER' ? 'Jobs Completed' : 'Avg. Rating',
      value: user?.role === 'CUSTOMER' ? stats?.jobsCompleted : stats?.avgRating?.toFixed?.(2) ?? stats?.avgRating,
      icon: user?.role === 'CUSTOMER'
        ? <CheckCircle className="w-6 h-6 text-green-500" />
        : <Star className="w-6 h-6 text-yellow-400" />,
    },
    {
      label: 'Active Jobs',
      value: stats?.activeJobs,
      icon: <Activity className="w-6 h-6 text-purple-500" />,
    },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name || '...'}
            </h1>
            <div className="text-zinc-500">{formatDate()}</div>
          </div>
          <div className="flex gap-2">
            {user?.role === 'CUSTOMER' && (
              <Button asChild>
                <Link href="/jobs/new">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Post a Job
                </Link>
              </Button>
            )}
            <Button asChild variant="secondary">
              <Link href="/profile">
                <User className="w-5 h-5 mr-2" />
                My Profile
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat, i) => (
            <Card key={i} className="flex flex-row items-center gap-4 p-4 shadow border-0 bg-white/90">
              <div className="p-3 rounded-full bg-blue-50">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold">{stat.value ?? '-'}</div>
                <div className="text-zinc-500 text-sm">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/90 shadow border-0">
            <CardHeader className="flex flex-row items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-zinc-600 text-sm space-y-2">
                {activityLoading && <li>Loading...</li>}
                {recentActivity && recentActivity.length === 0 && <li>No recent activity yet.</li>}
                {recentActivity && recentActivity.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-50 transition group"
                    style={{ minHeight: 40 }}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'COMPLETED'
                          ? 'bg-green-500'
                          : item.status === 'CANCELLED'
                            ? 'bg-red-400'
                            : item.status === 'BOOKED'
                              ? 'bg-yellow-400'
                              : item.status === 'ASSIGNED'
                                ? 'bg-blue-400'
                                : 'bg-gray-400'
                        }`}
                    ></span>
                    <span className="font-medium max-w-[160px] truncate flex-1" title={item.title}>
                      {item.title}
                    </span>
                    <span className="ml-1 text-xs px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 min-w-[90px] text-center">
                      {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                    </span>
                    <span className="ml-auto text-zinc-400 text-xs whitespace-nowrap">
                      {new Date(item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}{" "}
                      {new Date(item.updatedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white/90 shadow border-0">
            <CardHeader className="flex flex-row items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mt-2">
                <li>
                  <Link href="/jobs" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Briefcase className="w-4 h-4" />
                    Browse jobs
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <User className="w-4 h-4" />
                    Update your profile
                  </Link>
                </li>
                {user?.role === 'CUSTOMER' && (
                  <li>
                    <Link href="/jobs/new" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <PlusCircle className="w-4 h-4" />
                      Post a new job
                    </Link>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}