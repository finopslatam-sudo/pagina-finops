const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  'https://api.finopslatam.com';

interface ApiFetchOptions {
  token?: string | null;
  method?: string;
  body?: any;
}

export async function apiFetch(
  endpoint: string,
  { token, method = 'GET', body }: ApiFetchOptions = {}
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw error;
  }

  return res.json();
}
