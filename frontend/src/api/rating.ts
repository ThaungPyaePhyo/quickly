import { api } from '@/lib/api';

export async function rateProvider(jobId: string, score: number, comment?: string) {
  return api(`/rating/job/${jobId}/rate`, {
    method: 'POST',
    body: { score, comment }
  });
}