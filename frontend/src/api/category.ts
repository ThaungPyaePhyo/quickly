import { api } from '@/lib/api';


type Category = {
  id: string;
  name: string;
};

export async function fetchCategories(): Promise<Category[]> {
  return api<Category[]>('/categories', {
    method: 'GET',
  });
}