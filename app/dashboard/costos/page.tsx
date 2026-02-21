'use client';

import { useDashboardCosts } from '../hooks/useDashboardCosts';
import DashboardFinancialKPIs from '../components/finance/DashboardFinancialKPIs';
import MonthlyCostChart from '../components/finance/MonthlyCostChart';
import ServiceBreakdownChart from '../components/finance/ServiceBreakdownChart';

export default function CostosPage() {
  const { data, loading } = useDashboardCosts();

  if (loading) {
    return <p className="p-6 text-gray-400">Cargando costos...</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">No se pudieron cargar los costos</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
  
      <div>
        <h1 className="text-3xl font-bold">
          Costos & Tendencias
        </h1>
        <p className="text-gray-500 mt-2">
          Análisis financiero detallado de consumo cloud.
        </p>
      </div>
  
      {/* KPIs Financieros */}
      <DashboardFinancialKPIs
        currentMonthCost={data.current_month_cost}
        potentialSavings={data.potential_savings}
        savingsPercentage={data.savings_percentage}
        />
  
      {/* Tendencia mensual */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Tendencia mensual
        </h2>
        <MonthlyCostChart data={data.monthly_cost} />
      </div>
  
      {/* Distribución por servicio */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Distribución por servicio
        </h2>
        <ServiceBreakdownChart data={data.service_breakdown} />
      </div>
  
    </div>
  );
}