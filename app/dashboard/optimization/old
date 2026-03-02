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

      {/* ================= HERO OPTIMIZATION CARD ================= */}
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Optimization & Risk Strategy
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Proyección estratégica de reducción de riesgo, fortalecimiento de gobernanza
          y maximización del retorno financiero. Esta vista consolida el impacto
          potencial de las acciones de optimización priorizadas sobre tu entorno cloud.
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
            variant="orange"
            />

            <MetricCard
            label="Projected Governance"
            value={`${roi.projected_governance}%`}
            variant="blue"
            />

            <MetricCard
            label="Projected Risk Level"
            value={roi.projected_risk_level}
            variant="purple"
            />

            <MetricCard
            label="High Savings Opportunity (Annual)"
            value={`$${roi.high_savings_opportunity_annual}`}
            variant="green"
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

            <div className="space-y-4">
              {data.priority_services.map((service: any, idx: number) => (
                <div
                  key={idx}
                  className="border rounded-2xl p-6 bg-gray-50 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {service.service}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Risk Score: {service.risk_score}% · 
                      Nivel: {service.risk_level}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>High: {service.high}</p>
                    <p>Medium: {service.medium}</p>
                    <p>Low: {service.low}</p>
                  </div>
                </div>
              ))}
            </div>
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
  variant = "default",
}: {
  label: string;
  value: string | number;
  variant?: "blue" | "green" | "purple" | "orange" | "default";
}) {

  const variants = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
    default: "bg-gray-50 border-gray-200",
  };

  return (
    <div className={`${variants[variant]} border rounded-2xl p-6 shadow-sm`}>
      <p className="text-sm text-gray-600">
        {label}
      </p>
      <p className="text-2xl font-semibold mt-2 text-gray-900">
        {value}
      </p>
    </div>
  );
}