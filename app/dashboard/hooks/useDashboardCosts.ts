'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface MonthlyCost {
  month: string;
  amount: number;
}

interface ServiceBreakdown {
  service: string;
  amount: number;
}

export interface DashboardCosts {
  monthly_cost: MonthlyCost[];
  service_breakdown: ServiceBreakdown[];
  current_month_cost: number;
  potential_savings: number;
  savings_percentage: number;
}

export function useDashboardCosts() {
  const { token, isAuthReady } = useAuth();

  const [data, setData] = useState<DashboardCosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthReady || !token) return;

    const fetchCosts = async () => {
      try {
        setLoading(true);

        const response = await apiFetch<DashboardCosts>(
          '/api/client/dashboard/costs',
          { token }
        );

        setData(response);
        setError('');
      } catch (err) {
        console.error('DASHBOARD COST ERROR:', err);
        setError('No se pudieron cargar los costos.');
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
  }, [isAuthReady, token]);

  return { data, loading, error };
}