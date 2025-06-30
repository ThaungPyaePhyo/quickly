import { api } from '@/lib/api';

export type Job = {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  category?: { id: string; name: string };
  type?: 'QUICK_BOOK' | 'POST_AND_QUOTE';
  acceptPrice?: number;
  acceptUntil?: string;
  status: 'OPEN' | 'BOOKED' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt?: string;
  providerId?: string;
  provider?: { id: string; name: string };
  customerId?: string;
  customer?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  _count?: {
    bids: number;
  }
};

export type Bid = {
  id: string;
  price: number;
  note?: string;
  providerId: string;
  provider?: { id: string; name: string };
  eta?: number;
  rankScore?: number;
  createdAt: string;
};

export async function fetchJobs(): Promise<Job[]> {
  return api<Job[]>('/job');
}

export async function createJob(data: Omit<Job, 'id'>) {
  return api<Job>('/job/create', {
    method: 'POST',
    body: data,
  });
}

export async function fetchJobById(id: string): Promise<Job> {
  return api<Job>(`/job/${id}`);
}

export async function fetchBidsForJob(jobId: string): Promise<Bid[]> {
  return api<Bid[]>(`/bid/job/${jobId}`);
}


export async function submitBid(jobId: string, data: { price: number; note?: string; eta: number }) {
  return api<Bid>(`/bid`, {
    method: 'POST',
    body: { ...data, jobId },
  });
}

export async function acceptQuickBookJob(jobId: string) {
  return api(`/job/${jobId}/accept`, {
    method: 'POST',
  });
}

export async function acceptBid(bidId: string) {
  return api(`/bid/${bidId}/accept`, {
    method: 'PATCH',
  });
}

export async function cancelJob(jobId: string) {
  return api(`/job/${jobId}/cancel`, {
    method: 'PATCH',
  });
}

export async function completeJob(jobId: string) {
  return api(`/job/${jobId}/complete`, {
    method: 'PATCH',
  });
}

export async function fetchTopBids(jobId: string) {
  return api<Bid[]>(`/bid/top/${jobId}`);
}