'use client';

import { useDashboard } from '../hooks/useDashboard';
import DashboardFinancialKPIs from '../components/finance/DashboardFinancialKPIs';
import MonthlyCostChart from '../components/finance/MonthlyCostChart';
import ServiceBreakdownChart from '../components/finance/ServiceBreakdownChart';

export default function CostosPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return <p className="p-6 text-gray-400">Cargando costos...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">No se pudieron cargar los costos</p>;
  }

  const cost = data.cost;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          Costos & Tendencias
        </h1>
        <p className="text-gray-500 mt-2">
          Análisis financiero detallado del consumo cloud.
        </p>
      </div>

      {/* ================= KPIs PRINCIPALES ================= */}
      <DashboardFinancialKPIs
        currentMonthCost={cost.current_month_cost ?? 0}
        potentialSavings={cost.potential_savings ?? 0}
        savingsPercentage={cost.savings_percentage ?? 0}
      />

      {/* ================= KPIs ADICIONALES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <MetricCard
          title="Exposición mensual estimada"
          value={`$${data.executive_summary.monthly_financial_exposure ?? 0}`}
        />

        <MetricCard
          title="Exposición anual estimada"
          value={`$${data.executive_summary.annual_financial_exposure ?? 0}`}
        />

        <MetricCard
          title="Oportunidad ahorro anual (HIGH)"
          value={`$${data.roi_projection.high_savings_opportunity_annual ?? 0}`}
        />

      </div>

      {/* ================= TENDENCIA MENSUAL ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Tendencia mensual
        </h2>
        <MonthlyCostChart data={cost.monthly_cost ?? []} />
      </div>

      {/* ================= DISTRIBUCIÓN POR SERVICIO ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Distribución por servicio
        </h2>
        <ServiceBreakdownChart data={cost.service_breakdown ?? []} />
      </div>

    </div>
  );
}

/* =====================================================
   COMPONENTE INTERNO KPI SIMPLE
===================================================== */

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}