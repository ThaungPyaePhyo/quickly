'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchTopBids, Bid } from '@/api/job';

export default function TopBidsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const { data: bids, isLoading, error } = useQuery<Bid[]>({
    queryKey: ['top-bids', jobId],
    queryFn: () => fetchTopBids(jobId),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="animate-spin rounded-full border-4 border-blue-300 border-t-transparent w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Failed to load top bids.
      </div>
    );
  }
  if (bids && bids.length > 0) {
    console.log('Top Bids:', bids.map(bid => bid.provider?.name ?? bid.providerId));
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <h1 className="text-2xl font-bold mb-6">Top 3 Ranked Bids</h1>
      {bids && bids.length === 0 && (
        <div className="text-zinc-500">No bids yet for this job.</div>
      )}
      <ul className="space-y-4 w-full max-w-md">        {bids?.map((bid, idx) => (
        <li key={bid.id} className="p-4 border rounded shadow bg-white flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">#{idx + 1}</span>
            <span className="text-blue-600 font-bold">${bid.price}</span>
          </div>
          <div>
            <span className="text-sm text-zinc-600">Provider: {bid.provider?.name ?? bid.providerId}</span>
          </div>
          <div>
            <span className="text-sm text-zinc-600">ETA: {bid.eta} hours</span>
          </div>
          <div className="text-sm text-zinc-600">
            Rank Score: {bid.rankScore !== undefined && bid.rankScore !== null ? bid.rankScore.toFixed(2) : 'N/A'}
          </div>
          {bid.note && (
            <div className="text-sm text-zinc-500 mt-2">Note: {bid.note}</div>
          )}
        </li>
      ))}
      </ul>
    </main>
  );
}