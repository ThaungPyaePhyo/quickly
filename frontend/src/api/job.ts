import { api } from '@/lib/api';

export type Job = {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: string;
  type?: 'QUICK_BOOK' | 'CUSTOM_BOOK';
  createdAt: string;
  updatedAt: string;
  _count?: {
    bids: number;}
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