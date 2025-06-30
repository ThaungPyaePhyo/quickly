import { api } from '@/lib/api';

export type Stats = {
  jobsPosted?: number;
  jobsCompleted?: number;
  avgRating?: number;
  activeJobs?: number;
};

export type RecActivity = {
  title: string;
  status: string;
  updatedAt: string;
};

export async function fetchStats(): Promise<Stats> {
  return api<Stats>('/stats', { method: 'GET' });
}

export async function fetchRecentActivity(): Promise<RecActivity[]> {
  return api<RecActivity[]>('/stats/recent-activity', {
    method: 'GET',
  });
}