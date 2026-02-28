'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   TIPADO REAL — ALINEADO CON BACKEND ACTUAL
===================================================== */

export interface DashboardResponse {
  accounts: number;
  last_sync: string | null;
  resources_affected: number;

  findings: {
    total: number;
    active: number;
    resolved: number;
    high: number;
    medium: number;
    low: number;
    estimated_monthly_savings: number;
  };

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
    monthly_financial_exposure: number;
    annual_financial_exposure: number;
    message: string;
  };

  cost: {
    current_month_cost: number;
    monthly_cost: { month: string; amount: number }[];
    service_breakdown: { service: string; amount: number }[];
    potential_savings: number;
    savings_percentage: number;
  };

  roi_projection: {
    projected_risk_score: number;
    projected_risk_level: string;
    projected_governance: number;
    high_savings_opportunity_monthly: number;
    high_savings_opportunity_annual: number;
  };

  priority_services: any[];
  trend: any;
  remediation: any;
  risk_by_service: any;
}

/* =====================================================
   HOOK CONSOLIDADO
===================================================== */

export function useDashboard() {
  const { token, isAuthReady } = useAuth();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthReady || !token) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await apiFetch<DashboardResponse>(
          '/api/client/dashboard/',
          { token }
        );

        setData(response);
        setError('');
      } catch (err: any) {
        console.error('DASHBOARD ERROR:', err);
        setError('No se pudo cargar el dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthReady, token]);

  return { data, loading, error };
}