import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>(
  endpoint: string,
  token?: string | null
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    apiFetch<T>(endpoint, { token })
      .then(response => {
        if (!cancelled) {
          setData(response);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('API Error:', err);
          setError(err.message || 'Error inesperado');
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [endpoint, token]);

  return { data, loading, error };
}
