'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   TYPES — ALINEADO 100% CON BACKEND
===================================================== */

export interface DashboardSummary {
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

  governance: {
    compliance_percentage: number;
    compliant_resources: number;
    non_compliant_resources: number;
    total_resources: number;
  };

  risk: {
    high: number;
    medium: number;
    low: number;
    risk_level: string;
    risk_points: number;
    risk_score: number;
  };

  executive_summary: {
    overall_posture: string;
    governance_status: string;
    primary_risk_driver: string;
    financial_exposure: number;
    message: string;
  };

  roi_projection: {
    projected_risk_score: number;
    projected_risk_level: string;
    projected_governance: number;
    high_savings_opportunity: number;
  };

  priority_services: any[];
  trend: any[];
  remediation: any;
}

/* =====================================================
   HOOK
===================================================== */

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

        const response = await apiFetch<DashboardSummary>(
          '/api/client/dashboard/summary',
          { token }
        );

        setData(response);
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