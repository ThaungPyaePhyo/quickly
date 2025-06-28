import { api } from '@/lib/api';

export async function fetchCategories(): Promise<Category[]> {
  return api<Category[]>('/categories', {
    method: 'GET',
  });
}