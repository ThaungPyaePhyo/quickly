const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function api<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers, body, cache, next } = options;

  const xsrfToken = getCookie('XSRF-TOKEN');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', 
    cache,
    next,
  });

  console.log('response status:', res.status);

if (!res.ok) {
  let errorMsg = `API error: ${res.status}`;
  console.log('API error response:', res);
  try {
    const error = await res.json();
    errorMsg = error.message || errorMsg;
  } catch {
    const text = await res.text();
    if (text.startsWith('<!DOCTYPE')) {
      errorMsg = 'Server returned an HTML error page. Check your API URL and backend.';
    } else {
      errorMsg = text || errorMsg;
    }
  }
   throw new ApiError(res.status, errorMsg); 
}

  return res.json();
}