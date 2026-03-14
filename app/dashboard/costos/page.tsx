'use client';

import { useDashboard } from '../hooks/useDashboard';
import DashboardFinancialKPIs from '../components/finance/DashboardFinancialKPIs';
import MonthlyCostChart from '../components/finance/MonthlyCostChart';
import ServiceBreakdownChart from '../components/finance/ServiceBreakdownChart';
import AwsAccountSelector from "../components/AwsAccountSelector";

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

      {/* ================= HERO FINANCIAL CARD ================= */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">
          Costs & Financials
        </h1>

        <p className="text-gray-600 mt-3 max-w-3xl">
          Análisis financiero consolidado del consumo cloud, exposición proyectada
          y oportunidades estratégicas de optimización.
        </p>

      </div>

      {/* ================= ACCOUNT FILTER ================= */}
      <div className="flex justify-end">
        <AwsAccountSelector />
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
          title="EXPOSICIÓN MENSUAL ESTIMADA"
          value={`$${data.executive_summary.monthly_financial_exposure ?? 0}`}
          variant="blue"
        />

        <MetricCard
          title="EXPOSICIÓN ANUAL ESTIMADA"
          value={`$${data.executive_summary.annual_financial_exposure ?? 0}`}
          variant="purple"
        />

        <MetricCard
          title="OPORTUNIDAD AHORRO ANUAL (HIGH)"
          value={`$${data.roi_projection.high_savings_opportunity_annual ?? 0}`}
          variant="green"
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
  variant = 'default',
}: {
  title: string;
  value: string;
  variant?: 'blue' | 'green' | 'purple' | 'default';
}) {

  const variants = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    default: "bg-gray-50 border-gray-200"
  };

  return (
    <div className={`${variants[variant]} border rounded-2xl p-6 shadow-sm`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-semibold mt-2 text-gray-900">{value}</p>
    </div>
  );
}