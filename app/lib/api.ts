// app/lib/api.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.finopslatam.com';

type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: any;
};

/**
 * Fetch centralizado enterprise-safe
 */
export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
) {
  const { method = 'GET', token, body } = options;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API error');
  }

  // 204 No Content safe
  if (res.status === 204) return null;

  return res.json();
}
