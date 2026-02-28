'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useDashboard } from '../hooks/useDashboard';

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function OptimizationPage() {
  const { data, loading, error } = useDashboard();

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Cargando optimización...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const roi = data.roi_projection;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          Optimization
        </h1>
        <p className="text-gray-500 mt-2">
          Proyección de mejora, reducción de riesgo y oportunidades financieras.
        </p>
      </div>

      {/* ================= ROI PROJECTION ================= */}
      {roi && (
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">

          <h2 className="text-xl font-semibold">
            Proyección de mejora
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <MetricCard
              label="Projected Risk Score"
              value={`${roi.projected_risk_score}%`}
            />

            <MetricCard
              label="Projected Governance"
              value={`${roi.projected_governance}%`}
            />

            <MetricCard
              label="Projected Risk Level"
              value={roi.projected_risk_level}
            />

            <MetricCard
            label="High Savings Opportunity (Annual)"
            value={`$${roi.high_savings_opportunity_annual}`}
            />

          </div>

        </div>
      )}

      {/* ================= PRIORITY SERVICES ================= */}
      {data.priority_services && (
        <div className="bg-white p-8 rounded-3xl border shadow-xl">
          <h2 className="text-xl font-semibold mb-6">
            Servicios prioritarios
          </h2>

          {data.priority_services.length === 0 ? (
            <p className="text-gray-400">
              No hay servicios prioritarios identificados.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.priority_services.map((service: any, idx: number) => (
                <li
                  key={idx}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  {JSON.stringify(service)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border rounded-xl p-6 bg-gray-50 shadow-sm">
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="text-2xl font-semibold mt-2">
        {value}
      </p>
    </div>
  );
}