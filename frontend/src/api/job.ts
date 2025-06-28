import { api } from '@/lib/api';

export type Job = {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  type?: 'QUICK_BOOK' | 'POST_AND_QUOTE';
  acceptPrice?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bids: number;}
};

export type Bid = {
  id: string;
  price: number;
  note?: string;
  provider?: { id: string; name: string };
  createdAt: string;
  // Add other fields as needed
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


export async function submitBid(jobId: string, data: { price: number; note?: string }) {
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