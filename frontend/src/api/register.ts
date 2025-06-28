import { api } from '@/lib/api';

export async function register(
  email: string,
  password: string,
  name: string,
  role: 'CUSTOMER' | 'PROVIDER'
) {
  return api('/user/register', {
    method: 'POST',
    body: { email, password, name, role },
  });
}