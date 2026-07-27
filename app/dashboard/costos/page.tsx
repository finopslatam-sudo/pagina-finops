'use client';

import { useDashboard } from '../hooks/useDashboard';
import MonthlyCostChart from '../components/finance/MonthlyCostChart';
import ServiceBreakdownChart from '../components/finance/ServiceBreakdownChart';
import AwsAccountSelector from "../components/AwsAccountSelector";
import CostosSkeleton from './components/CostosSkeleton';
import CostosKpiRows from './components/CostosKpiRows';

export default function CostosPage() {

  const { data, loading, error } = useDashboard();

  if (loading) {
    return <CostosSkeleton />;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">No se pudieron cargar los costos</p>;
  }

  const cost = data.cost;
  const dl = cost.date_labels ?? {} as NonNullable<typeof cost.date_labels>;

  const fmt = (iso: string) => {
    if (!iso) return iso;
    const [y, m, d] = iso.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-12">

      {/* ================= HERO FINANCIAL CARD ================= */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-3xl p-5 lg:p-8 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Costos & Finanzas
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Análisis financiero consolidado del consumo cloud, exposición proyectada
          y oportunidades estratégicas de optimización.
        </p>
      </div>

      {/* ================= ACCOUNT FILTER ================= */}
      <div className="flex items-center gap-4 pt-2">
        <AwsAccountSelector />
      </div>

      <CostosKpiRows cost={cost} dl={dl} fmt={fmt} />

      {/* ================= TENDENCIA MENSUAL ================= */}
      <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Tendencia mensual
        </h2>
        <MonthlyCostChart data={cost.monthly_cost ?? []} />
      </div>

      {/* ================= DISTRIBUCIÓN POR SERVICIO ================= */}
      <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Distribución por servicio
        </h2>
        <ServiceBreakdownChart data={cost.service_breakdown ?? []} />
      </div>

    </div>
  );
}
