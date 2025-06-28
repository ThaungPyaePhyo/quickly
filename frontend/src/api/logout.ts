import { api } from '@/lib/api';

export async function logout() {
  return api('/logout', {
    method: 'POST',
  });
}