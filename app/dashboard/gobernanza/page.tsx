'use client';

import { useDashboardSummary } from '../hooks/useDashboardSummary';

export default function GobernanzaPage() {
  const { data, loading } = useDashboardSummary();

  if (loading) {
    return <p className="p-6 text-gray-400">Cargando gobernanza...</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">Error al cargar datos</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      <h1 className="text-2xl font-bold">
        Gobernanza & Compliance
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-red-100 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-red-700">
            Findings críticos
          </h3>
          <p className="text-3xl font-bold">
            {data.findings.high}
          </p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-yellow-700">
            Recursos afectados
          </h3>
          <p className="text-3xl font-bold">
            {data.resources_affected}
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-blue-700">
            Última sincronización
          </h3>
          <p className="text-sm">
            {data.last_sync ?? 'Sin sincronización'}
          </p>
        </div>

      </div>

    </div>
  );
}