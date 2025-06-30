import { api } from '@/lib/api';

export type Rating = {
  providerId: string;
  score: number;
  comment?: string; 
};

export async function rateProvider(jobId: string, score: number, comment?: string) {
  return api(`/rating/job/${jobId}/rate`, {
    method: 'POST',
    body: { score, comment }
  });
}

export async function getJobRatings(jobId: string): Promise<Rating[]> {
  return api<Rating[]>(`/ratings/${jobId}`, { method: 'GET' });
}
export async function getProviderRatings(providerId: string) {
  return api(`/rating/provider/${providerId}`, {
    method: 'GET',
  });
}