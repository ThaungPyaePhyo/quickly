'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobById, fetchBidsForJob, submitBid, acceptQuickBookJob, acceptBid, cancelJob, completeJob } from '@/api/job';
import { fetchMe } from '@/api/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RatingForm from '@/components/RatingFrom';
import { useState } from 'react';
import { getJobRatings } from '@/api/rating';
import Link from 'next/link';
import { toast } from 'react-hot-toast';


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

  const { data: ratings } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () => getJobRatings(id),
    enabled: !!id,
  });

  const [bidPrice, setBidPrice] = useState('');
  const [bidNote, setBidNote] = useState('');
  const [bidEta, setBidEta] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: countdown = 0 } = useQuery({
    queryKey: ['acceptCountdown', job?.id, job?.acceptUntil],
    queryFn: () => {
      if (!job?.acceptUntil) return 0;
      const now = Date.now();
      const until = new Date(job.acceptUntil).getTime();
      return Math.max(0, Math.floor((until - now) / 1000));
    },
    enabled: !!job?.acceptUntil && job.status === 'OPEN' && userRole === 'PROVIDER' && job.type === 'QUICK_BOOK',
    refetchInterval: 1000,
  });

  const userBid = bids?.find(bid => bid.providerId === user?.id);

  const bidMutation = useMutation({
    mutationFn: () => submitBid(id, { price: Number(bidPrice), note: bidNote, eta: Number(bidEta) }),
    onSuccess: () => {
      setBidPrice('');
      setBidNote('');
      setBidEta('');
      refetchBids();
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Bid submitted!');
    },
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
        toast.error((err as { message: string }).message);
      } else {
        setError('Failed to submit bid');
        toast.error('Failed to submit bid');
      }
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptQuickBookJob(job.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job accepted!');
    },
    onError: () => {
      toast.error('Failed to accept job');
    }
  });

  const acceptBidMutation = useMutation({
    mutationFn: (bidId: string) => acceptBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['bids', id] });
      toast.success('Bid accepted!');
    },
    onError: () => {
      toast.error('Failed to accept bid');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelJob(job.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job cancelled.');
    },
    onError: () => {
      toast.error('Failed to cancel job');
    }
  });

  const completeMutation = useMutation({
    mutationFn: () => completeJob(job.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job marked as completed!');
    },
    onError: () => {
      toast.error('Failed to complete job');
    }
  });

  if (jobLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found.</div>;

  const jobAlreadyRated =
    ratings &&
    job.providerId &&
    ratings.some((r: any) => r.providerId === job.providerId);


  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <Card className="w-full max-w-xl mb-6">
        <CardContent className="py-6 px-6">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <div className="mb-2 text-zinc-600">{job.description}</div>
          <div className="mb-2">
            <span className="font-semibold">Category:</span> {job.category.name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Type:</span> {job.type}
          </div>
          {job.scheduledAt && (
            <div className="mb-2 text-xs text-zinc-400">
              Scheduled: {new Date(job.scheduledAt).toLocaleString()}
            </div>
          )}
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
          {job.status === 'CANCELLED' && (
            <div className="text-red-600 font-semibold mt-2">This job has been cancelled.</div>
          )}
          {job.status === 'COMPLETED' && (
            <div className="text-green-600 font-semibold mt-2">This job is completed.</div>
          )}
        </CardContent>
      </Card>

      {userRole === 'CUSTOMER' &&
        job.type === 'POST_AND_QUOTE' &&
        job.status === 'OPEN' && (
          <Link href={`/jobs/${job.id}/top-bids`}>
            <Button className="mb-6 w-full max-w-xl">
              View Top Bids
            </Button>
          </Link>
        )}


      {userRole === 'CUSTOMER' && job.type === 'QUICK_BOOK' && (
        <Card className="w-full max-w-xl mb-6">
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Category:</span> {job.category.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Smart Price:</span> ${job.price}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Arrival Window:</span>{' '}
              {job.scheduledAt
                ? new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                ' - ' +
                new Date(new Date(job.scheduledAt).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                : 'Not set'}
            </div>
            {job.status === 'BOOKED' && (
              <div className="text-green-600 font-semibold">
                Provider accepted your job!
                {job.provider && (
                  <div className="mt-2">
                    Provider: <span className="font-semibold">{job.provider.name}</span>
                  </div>
                )}
              </div>
            )}
            {job.status === 'OPEN' && (
              <div className="text-blue-600 font-semibold">
                Waiting for provider to accept...
              </div>
            )}
            {job.status === 'COMPLETED' && (
              <div className="text-green-600 font-semibold">
                This job is completed.
              </div>
            )}
            {job.status === 'CANCELLED' && (
              <div className="text-red-600 font-semibold">
                This job has been cancelled.
              </div>
            )}
            {/* Cancel button for customer */}
            {(job.status === 'OPEN' || job.status === 'BOOKED') && (
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {userRole === 'PROVIDER' && job.type === 'QUICK_BOOK' && (
        <Card className="w-full max-w-xl mb-6">
          <CardContent>
            {job.status === 'OPEN' ? (
              <>
                <div className="mb-2 text-lg font-semibold text-blue-700">
                  One-tap hire for routine, urgent chores
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Category:</span> {job.category.name}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Smart Price:</span> ${job.price}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Arrival Window:</span>{' '}
                  {job.scheduledAt
                    ? new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                    ' - ' +
                    new Date(new Date(job.scheduledAt).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : 'Not set'}
                </div>
                <Button
                  onClick={() => acceptMutation.mutate()}
                  className="w-full mb-2"
                  disabled={acceptMutation.isPending || countdown === 0}
                >
                  {acceptMutation.isPending
                    ? 'Accepting...'
                    : countdown > 0
                      ? `Accept (${countdown}s)`
                      : 'Time expired'}
                </Button>
                <div className="text-xs text-zinc-500 text-center">
                  First provider to accept wins!
                </div>
                <Button
                  variant="destructive"
                  className="mt-4"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
                </Button>
              </>
            ) : (
              <div className="text-red-600 font-semibold text-center">Job filled</div>
            )}
          </CardContent>
        </Card>
      )}

      {userRole === 'PROVIDER' && job.type === 'POST_AND_QUOTE' && (
        <Card className="w-full max-w-xl mb-6">
          <CardContent>
            {userBid ? (
              <div className="text-green-600 mb-4">
                You have already submitted a bid for this job.
              </div>
            ) : (
              <>
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
                  <input
                    type="number"
                    placeholder="ETA (hours)"
                    value={bidEta}
                    onChange={e => setBidEta(e.target.value)}
                    required
                    min={1}
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
              </>
            )}
          </CardContent>
        </Card>
      )}

      {userRole === 'CUSTOMER' &&
        user?.id === job.customerId &&
        job.type === 'POST_AND_QUOTE' &&
        bids && (
          <Card className="w-full max-w-xl">
            <CardContent>
              <h2 className="font-semibold mb-2">Bids</h2>
              {bids.length === 0 ? (
                <div>No bids yet.</div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {bids
                    .sort((a, b) => a.price - b.price)
                    .map(bid => (
                      <li key={bid.id} className="border p-2 rounded flex flex-col">
                        <div>
                          <span className="font-bold">${bid.price}</span> by {bid.provider?.name}
                          {bid.note && <span className="ml-2 text-zinc-500">({bid.note})</span>}
                        </div>
                        {job.status === 'OPEN' && (
                          <Button
                            size="sm"
                            className="mt-2 w-fit"
                            onClick={() => acceptBidMutation.mutate(bid.id)}
                            disabled={acceptBidMutation.isPending}
                          >
                            {acceptBidMutation.isPending ? 'Accepting...' : 'Accept Bid'}
                          </Button>
                        )}
                        {job.providerId === bid.providerId && job.status === 'ASSIGNED' && (
                          <>
                            <span className="text-green-600 text-xs mt-1">Accepted</span>
                            <Button
                              variant="destructive"
                              className="mt-2"
                              onClick={() => cancelMutation.mutate()}
                              disabled={cancelMutation.isPending}
                            >
                              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Job'}
                            </Button>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

      {userRole === 'PROVIDER' &&
        (
          (job.type === 'POST_AND_QUOTE' && job.status === 'ASSIGNED' && job.providerId === user?.id) ||
          (job.type === 'QUICK_BOOK' && job.status === 'BOOKED' && job.providerId === user?.id)
        ) && (
          <Card className="w-full max-w-xl mt-4">
            <CardContent>
              <Button
                className="w-full"
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending ? 'Completing...' : 'Mark as Completed'}
              </Button>
            </CardContent>
          </Card>
        )}

      {userRole === 'CUSTOMER' &&
        user?.id === job.customerId &&
        job.status === 'COMPLETED' &&
        job.providerId &&
        !jobAlreadyRated && (
          <Card className="w-full max-w-xl mt-4">
            <CardContent>
              <h2 className="font-semibold mb-2">Rate Your Provider</h2>
              <RatingForm
                jobId={job.id}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ['ratings', id] });
                }}
              />
            </CardContent>
          </Card>
        )}

      {job.status === 'COMPLETED' && ratings && ratings.length > 0 && (
        <Card className="w-full max-w-xl mt-4">
          <CardContent>
            <h2 className="font-semibold mb-2">Your Rating</h2>
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-500 text-lg">
                {'★'.repeat(ratings[0].score)}
                {'☆'.repeat(5 - ratings[0].score)}
              </span>
              <span className="ml-2 text-zinc-700">{ratings[0].score} / 5</span>
            </div>
            {ratings[0].comment && (
              <div className="mt-2 text-zinc-600 italic">"{ratings[0].comment}"</div>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}