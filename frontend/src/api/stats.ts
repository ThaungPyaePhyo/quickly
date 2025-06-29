import { api } from '@/lib/api';

export async function fetchStats() {
  return api('/stats', {
    method: 'GET',
  });
}

export async function fetchRecentActivity() {
  return api('/stats/recent-activity', {
    method: 'GET',
  });
}