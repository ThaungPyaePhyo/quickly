import { api } from "@/lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER';
  isAvailable: boolean;
};

export async function fetchMe(): Promise<User> {
  return api<User>('/user/me', {
    method: 'GET',
  });
}

export async function updateMe(data: Partial<User>) {
  return api<User>('/user/update', {
    method: 'PATCH',
    body: data,
  });
}