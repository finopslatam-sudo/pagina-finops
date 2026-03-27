'use client';

import { useInventory } from '../hooks/useInventory';
import AwsAccountSelector from '../components/AwsAccountSelector';
import AssetsCharts  from './components/AssetsCharts';
import AssetsFilters from './components/AssetsFilters';
import AssetsTable   from './components/AssetsTable';
import { useAssetsFilters } from './hooks/useAssetsFilters';

export default function AssetsPage() {
  const { data, servicesMeta, loading, error } = useInventory();
  const resources = data?.resources ?? [];

  const {
    filters, setFilters,
    filteredResources, paginatedResources,
    page, setPage, totalPages,
    uniqueServices, uniqueRegions, uniqueStates,
  } = useAssetsFilters(resources);

  if (loading) return <div className="p-6 text-gray-400">Cargando inventario...</div>;
  if (error)   return <div className="p-6 text-red-500">{error}</div>;
  if (!data)   return null;

  const riskDistribution = [
    { name: 'Alto',     value: filteredResources.filter(r => r.severity === 'HIGH').length },
    { name: 'Medio',    value: filteredResources.filter(r => r.severity === 'MEDIUM').length },
    { name: 'Bajo',     value: filteredResources.filter(r => r.severity === 'LOW').length },
    { name: 'Sin Riesgo', value: filteredResources.filter(r => !r.severity).length },
  ];

  const serviceDistribution = Object.values(
    filteredResources.reduce((acc, r) => {
      if (!acc[r.service_name]) acc[r.service_name] = { name: r.service_name, value: 0 };
      acc[r.service_name].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-12">

      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-3xl p-5 lg:p-8 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Assets & Overview</h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Hallazgos de riesgo detectados en tu entorno cloud y oportunidades estratégicas de optimización.
          Esta vista consolida exposición, estado operacional y distribución por servicio para apoyar
          decisiones ejecutivas basadas en datos.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <AwsAccountSelector />
      </div>

      <AssetsCharts
        riskDistribution={riskDistribution}
        serviceDistribution={serviceDistribution}
        servicesMeta={servicesMeta}
      />

      <AssetsFilters
        filters={filters} setFilters={setFilters}
        uniqueServices={uniqueServices}
        uniqueRegions={uniqueRegions}
        uniqueStates={uniqueStates}
      />

      <AssetsTable
        paginatedResources={paginatedResources}
        filteredResources={filteredResources}
        page={page} setPage={setPage} totalPages={totalPages}
      />

    </div>
  );
}
