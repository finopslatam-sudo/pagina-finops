'use client';

import Link from 'next/link';
import { useDashboard } from '../hooks/useDashboard';
import { useCloud } from '../context/CloudContext';
import CloudFilterBar from '../components/CloudFilterBar';
import MonthlyCostChart from '../components/finance/MonthlyCostChart';
import ServiceBreakdownChart from '../components/finance/ServiceBreakdownChart';
import CostosSkeleton from './components/CostosSkeleton';
import CostosKpiRows from './components/CostosKpiRows';

export default function CostosPage() {
  const { data, loading, error } = useDashboard();
  const { selectedProvider, selectedAccountId } = useCloud();

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
  const dl = cost.date_labels ?? ({} as NonNullable<typeof cost.date_labels>);

  const fmt = (iso: string) => {
    if (!iso) return iso;
    const [y, m, d] = iso.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  };

  const isAzure = selectedProvider === 'azure';
  const isGcp = selectedProvider === 'gcp';
  const hasNoAccountCost = selectedAccountId && (!cost.monthly_cost || cost.monthly_cost.length === 0);

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

      {/* ================= CLOUD FILTER BAR ================= */}
      <CloudFilterBar />

      {/* ================= VISTA SEGÚN PROVEEDOR ================= */}
      {isAzure ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="text-4xl">🔷</div>
          <h2 className="text-xl font-bold text-slate-800">
            No existen gastos asociados a la nube Microsoft Azure
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Actualmente no se registran costos de facturación procesados para Microsoft Azure.
            El análisis detallado de costos y finanzas está disponible para AWS; puedes auditar tus
            activos y hallazgos de Azure en la sección de Findings e Integraciones.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/azure"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
            >
              <span>Gestionar suscripciones Azure</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ) : isGcp ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="text-4xl">🔴</div>
          <h2 className="text-xl font-bold text-slate-800">
            No existen gastos asociados a la nube Google Cloud Platform
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Actualmente no se registran costos de facturación procesados para Google Cloud Platform.
            El análisis detallado de costos y finanzas está disponible para AWS; puedes auditar tus
            activos y hallazgos de GCP en la sección de Findings e Integraciones.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/gcp"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
            >
              <span>Gestionar proyectos GCP</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ) : hasNoAccountCost ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3 shadow-sm">
          <div className="text-3xl">📊</div>
          <h3 className="text-lg font-semibold text-slate-700">
            No existen gastos asociados a la cuenta seleccionada
          </h3>
          <p className="text-xs text-slate-400">
            Verifica que la cuenta tenga datos de facturación procesados en AWS Cost Explorer.
          </p>
        </div>
      ) : (
        <>
          <CostosKpiRows cost={cost} dl={dl} fmt={fmt} />

          {/* ================= TENDENCIA MENSUAL ================= */}
          <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
            <h2 className="text-xl font-semibold mb-6">Tendencia mensual</h2>
            <MonthlyCostChart data={cost.monthly_cost ?? []} />
          </div>

          {/* ================= DISTRIBUCIÓN POR SERVICIO ================= */}
          <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
            <h2 className="text-xl font-semibold mb-6">Distribución por servicio</h2>
            <ServiceBreakdownChart data={cost.service_breakdown ?? []} />
          </div>
        </>
      )}
    </div>
  );
}
