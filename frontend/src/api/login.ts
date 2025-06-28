import { api } from '@/lib/api';

export async function login(email: string, password: string) {
  return api('/login', {
    method: 'POST',
    body: { email, password },
  });
}