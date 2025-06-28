import { api } from "@/lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PROVIDER';
  // Add other fields as needed
};

export async function fetchMe(): Promise<User> {
  return api<User>('/user/me', {
    method: 'GET',
  });
}