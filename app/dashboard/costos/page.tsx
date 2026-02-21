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
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      <h1 className="text-2xl font-bold">
        Costos & Tendencias
      </h1>

      <DashboardFinancialKPIs data={data} />

      <MonthlyCostChart data={data.monthly_cost} />

      <ServiceBreakdownChart data={data.service_breakdown} />

    </div>
  );
}