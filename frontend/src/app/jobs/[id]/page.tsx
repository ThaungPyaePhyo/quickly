'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobById, fetchBidsForJob, submitBid, acceptQuickBookJob } from '@/api/job';
import { fetchMe } from '@/api/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const userRole = user?.role;

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });

  const { data: bids, refetch: refetchBids } = useQuery({
    queryKey: ['bids', id],
    queryFn: () => fetchBidsForJob(id),
    enabled: !!id,
  });

  const [bidPrice, setBidPrice] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const bidMutation = useMutation({
    mutationFn: () => submitBid(id, { price: Number(bidPrice), note: bidNote }),
    onSuccess: () => {
      setBidPrice('');
      setBidNote('');
      refetchBids();
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    },
    onError: (err: any) => setError(err.message || 'Failed to submit bid'),
  });

  if (jobLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <main className="flex flex-col items-center min-h-screen">
      <Card className="w-full max-w-xl mb-6">
        <CardContent className="py-6 px-6">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <div className="mb-2 text-zinc-600">{job.description}</div>
          <div className="mb-2">
            <span className="font-semibold">Category:</span> {job.category}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Type:</span> {job.type}
          </div>
          {job.type === 'QUICK_BOOK' && job.price !== undefined && (
            <div className="mb-2">
              <span className="font-semibold">Price:</span> ${job.price}
            </div>
          )}
          {job.type === 'POST_AND_QUOTE' && job.acceptPrice !== undefined && (
            <div className="mb-2">
              <span className="font-semibold">Accept Price:</span> ${job.acceptPrice}
            </div>
          )}
        </CardContent>
      </Card>

      {userRole === 'PROVIDER' && job.type === 'QUICK_BOOK' && (
        <Card className="w-full max-w-xl mb-6">
          <CardContent>
            <Button
              onClick={() => acceptQuickBookJob(job.id)}
              className="w-full"
            >
              Accept Job
            </Button>
          </CardContent>
        </Card>
      )}

      {userRole === 'PROVIDER' && job.type === 'POST_AND_QUOTE' && (
        <Card className="w-full max-w-xl mb-6">
          <CardContent>
            <h2 className="font-semibold mb-2">Submit Your Bid</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                bidMutation.mutate();
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="number"
                placeholder="Your price"
                value={bidPrice}
                onChange={e => setBidPrice(e.target.value)}
                required
                className="border px-2 py-1 rounded"
              />
              <textarea
                placeholder="Note (optional)"
                value={bidNote}
                onChange={e => setBidNote(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <Button type="submit" disabled={bidMutation.isPending}>
                {bidMutation.isPending ? 'Submitting...' : 'Submit Bid'}
              </Button>
              {error && <div className="text-red-600">{error}</div>}
            </form>
          </CardContent>
        </Card>
      )}


      {userRole === 'CUSTOMER' && bids && (
        <Card className="w-full max-w-xl">
          <CardContent>
            <h2 className="font-semibold mb-2">Bids</h2>
            {bids.length === 0 ? (
              <div>No bids yet.</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {bids
                  .sort((a, b) => a.price - b.price)
                  .slice(0, 3)
                  .map(bid => (
                    <li key={bid.id} className="border p-2 rounded flex flex-col">
                      <div>
                        <span className="font-bold">${bid.price}</span> by {bid.provider?.name}
                        {bid.note && <span className="ml-2 text-zinc-500">({bid.note})</span>}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}