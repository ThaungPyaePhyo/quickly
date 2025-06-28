'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchJobs, Job } from '@/api/job';
import { fetchMe } from '@/api/user';
import { useState } from 'react';

export default function JobListPage() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });
  const userRole = user?.role;

  const [search, setSearch] = useState('');

  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const filteredJobs = jobs?.filter(
    job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(search.toLowerCase())) ||
      (job.category && job.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col w-full max-w-4xl mb-6">
        <div className="flex flex-row items-center justify-between mb-2 gap-2">
          <h1 className="text-3xl font-bold">Jobs</h1>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded w-40"
            />
            <Button asChild>
              <Link href="/jobs/new">+ Post a Job</Link>
            </Button>
          </div>
        </div>
        <div className="h-px bg-blue-100 w-full mb-4" />
      </div>
      {isLoading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">Failed to load jobs.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {filteredJobs?.length ? (
          filteredJobs.map(job => (
            <Link href={`/jobs/${job.id}`} key={job.id} className="h-full block">
              <Card className="h-full border border-blue-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="py-6 px-6 flex flex-col gap-2 h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-semibold text-blue-700">{job.title}</div>
                    {job.type === 'QUICK_BOOK' && job.price !== undefined && (
                      <div className="text-blue-600 font-bold text-base">${job.price}</div>
                    )}
                    {job.type === 'POST_AND_QUOTE' && job.acceptPrice !== undefined && (
                      <div className="text-green-600 font-bold text-base">
                        ${job.acceptPrice}
                      </div>
                    )}
                  </div>
                  <div className="text-zinc-600 mb-2 line-clamp-1">{job.description}</div>
                  <div className="flex items-center gap-2">
                    {job.category && (
                      <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded mr-2">
                        {job.category.name}
                      </span>
                    )}
                    {job.type && (
                      <span className="inline-block bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded">
                        {job.type}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 ml-auto">
                      {job._count?.bids ?? 0} bid{(job._count?.bids ?? 0) === 1 ? '' : 's'}
                    </span>
                    {userRole === 'PROVIDER' && job.type === 'POST_AND_QUOTE' && (
                      <Button
                        size="sm"
                        onClick={e => {
                          e.preventDefault();
                          window.location.href = `/jobs/${job.id}`;
                        }}
                      >
                        Bid
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          !isLoading && (
            <Card>
              <CardContent className="py-8 flex flex-col items-center justify-center">
                <span className="text-4xl mb-2">🗒️</span>
                <div className="text-zinc-500 text-center">
                  No jobs found.<br />Be the first to post a job!
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </main>
  );
}