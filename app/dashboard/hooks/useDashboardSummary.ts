'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface DashboardSummary {
  findings: {
    total: number;
    active: number;
    resolved: number;
    high: number;
    medium: number;
    low: number;
    estimated_monthly_savings: number;
  };
  accounts: number;
  last_sync: string | null;
  resources_affected: number;
}

export function useDashboardSummary() {
  const { token, isAuthReady } = useAuth();

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthReady || !token) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);

        const response = await apiFetch<{
          status: string;
          data: DashboardSummary;
        }>('/api/client/dashboard/summary', { token });

        if (response.status !== 'ok') {
          throw new Error('No se pudo cargar el dashboard');
        }

        setData(response.data);
        setError('');
      } catch (err: any) {
        console.error('DASHBOARD SUMMARY ERROR:', err);
        setError('No se pudo cargar el resumen del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [isAuthReady, token]);

  return { data, loading, error };
}
