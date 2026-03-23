'use client';

import { useDashboard } from '../../hooks/useDashboard';
import { useSnapshots } from '../../hooks/useSnapshots';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import { formatUSD } from '@/app/lib/finopsFormat';

export const RISK_LABEL: Record<string, string> = {
  LOW: 'Bajo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
  CRITICAL: 'Crítico',
};

export const RISK_COLOR: Record<string, string> = {
  LOW:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM:   'bg-amber-50 text-amber-700 border-amber-200',
  HIGH:     'bg-red-50 text-red-700 border-red-200',
  CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300',
};

export const DONUT_COLORS = ['#f87171', '#fbbf24', '#60a5fa'];

export function complianceColor(pct: number): {
  stroke: string;
  text: string;
  label: string;
} {
  if (pct >= 80) return { stroke: '#10b981', text: 'text-emerald-600', label: 'Cumplimiento óptimo' };
  if (pct >= 50) return { stroke: '#f59e0b', text: 'text-amber-600',   label: 'Requiere atención' };
  return              { stroke: '#ef4444', text: 'text-red-600',       label: 'Cumplimiento crítico' };
}

export interface GobernanzaDerived {
  gov: any;
  risk: any;
  exec: any;
  roi: any;
  f: any;
  riskKey: string;
  complianceCol: ReturnType<typeof complianceColor>;
  resolvedPct: number;
  trendCount: number;
  lastSync: string | null;
  severityData: { name: string; value: number }[];
  priorityServices: any[];
  resourcesAffected: number;
  formatUSD: typeof formatUSD;
}

export interface UseGobernanzaReturn {
  loading: boolean;
  accessDenied: boolean;
  derived: GobernanzaDerived | null;
  latest: any;
  trend: any;
  user: any;
}

export function useGobernanza(): UseGobernanzaReturn {
  const { data, loading } = useDashboard();
  const { user } = useAuth();
  const { latest, trend } = useSnapshots();

  const accessDenied = !hasFeature(user?.plan_code, 'gobernanza');

  if (loading || !data || accessDenied) {
    return { loading, accessDenied, derived: null, latest, trend, user };
  }

  const gov  = data.governance;
  const risk = data.risk;
  const exec = data.executive_summary;
  const roi  = data.roi_projection;
  const f    = data.findings;

  const riskKey       = (risk.risk_level ?? 'LOW').toUpperCase();
  const complianceCol = complianceColor(gov.compliance_percentage);
  const resolvedPct   = f.total > 0 ? Math.round((f.resolved / f.total) * 100) : 0;
  const trendCount    = Array.isArray(trend) ? trend.length : 0;
  const lastSync      = data.last_sync ? new Date(data.last_sync).toLocaleString('es-CL') : null;

  const severityData = [
    { name: 'HIGH',   value: f.high },
    { name: 'MEDIUM', value: f.medium },
    { name: 'LOW',    value: f.low },
  ].filter((d) => d.value > 0);

  const priorityServices: any[] = Array.isArray(data.priority_services) ? data.priority_services : [];

  const derived: GobernanzaDerived = {
    gov,
    risk,
    exec,
    roi,
    f,
    riskKey,
    complianceCol,
    resolvedPct,
    trendCount,
    lastSync,
    severityData,
    priorityServices,
    resourcesAffected: data.resources_affected ?? 0,
    formatUSD,
  };

  return { loading, accessDenied, derived, latest, trend, user };
}
