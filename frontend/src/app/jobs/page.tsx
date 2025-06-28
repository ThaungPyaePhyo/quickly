'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchJobs, Job } from '@/api/job';

export default function JobListPage() {
  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex justify-end w-full max-w-4xl mb-4">
        <Button asChild>
          <Link href="/jobs/new">Post a Job</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      {isLoading && <p>Loading jobs...</p>}
      {error && <p className="text-red-600">Failed to load jobs.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {jobs?.length ? (
          jobs.map(job => (
            <Card key={job.id} className="border border-blue-100 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="py-6 px-6 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold text-blue-700">{job.title}</div>
                  {job.price !== undefined && (
                    <div className="text-blue-600 font-bold text-base">${job.price}</div>
                  )}
                </div>
                <div className="text-zinc-600 mb-2">{job.description}</div>
                <div>
                  {job.category && (
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded mr-2">
                      {job.category}
                    </span>
                  )}
                  {job.type && (
                    <span className="inline-block bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded">
                      {job.type}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
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