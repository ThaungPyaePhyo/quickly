import { api } from '@/lib/api';

export async function rateProvider(jobId: string, score: number, comment?: string) {
  return api(`/rating/job/${jobId}/rate`, {
    method: 'POST',
    body: { score, comment }
  });
}

export async function getJobRatings(jobId: string) {
  return api(`/rating/job/${jobId}`, {
    method: 'GET',
  });
}

export async function getProviderRatings(providerId: string) {
  return api(`/rating/provider/${providerId}`, {
    method: 'GET',
  });
}