'use client';

import type { DashboardResponse } from '../hooks/useDashboard';

/* =====================================================
   EXECUTIVE OVERVIEW CARD
   Se renderiza inmediatamente, con skeleton interno
   mientras la API responde.
===================================================== */

interface Props {
  data: DashboardResponse | null;
  loading: boolean;
}

export default function ExecutiveOverview({ data, loading }: Props) {
  return (
    <div className="bg-slate-200 border border-blue-300 p-8 lg:p-12 rounded-3xl shadow-sm space-y-8">

      {/* Título — siempre visible */}
      <h1 className="text-3xl lg:text-4xl font-semibold text-slate-800">
        Executive Overview
      </h1>

      {/* Mensaje ejecutivo */}
      {loading || !data ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-300 rounded-lg w-full max-w-2xl" />
          <div className="h-4 bg-slate-300 rounded-lg w-5/6" />
          <div className="h-4 bg-slate-300 rounded-lg w-3/4" />
        </div>
      ) : (
        <p className="text-lg text-slate-700 leading-relaxed">
          {data.executive_summary?.message}
        </p>
      )}

      {/* Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {loading || !data ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-blue-200 p-5 rounded-xl animate-pulse space-y-2"
              >
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-6 w-20 bg-slate-200 rounded" />
              </div>
            ))}
          </>
        ) : (
          <>
            <ExecutiveBadge
              label="Overall Posture"
              value={data.executive_summary?.overall_posture ?? '—'}
            />
            <ExecutiveBadge
              label="Risk Score"
              value={`${data.risk?.risk_score ?? 0}%`}
            />
            <ExecutiveBadge
              label="Governance"
              value={`${data.governance?.compliance_percentage ?? 0}%`}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ExecutiveBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-blue-200 p-5 rounded-xl">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}
