'use client';

import { useState, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';

export default function AssetsPage() {
  const { data, loading, error } = useInventory();
  const [severityFilter, setSeverityFilter] =
    useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  if (loading) {
    return <div className="p-6 text-gray-400">Cargando inventario...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!data) return null;

  /* ================= FILTER ================= */

  const filteredResources = useMemo(() => {
    if (severityFilter === 'ALL') return data.resources;
    return data.resources.filter(r => r.severity === severityFilter);
  }, [data.resources, severityFilter]);

  /* ================= STATE BADGE ================= */

  const renderStateBadge = (state: any) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    if (state.category === 'healthy')
      return <span className={`${base} bg-green-100 text-green-700`}>{state.label}</span>;

    if (state.category === 'warning')
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>{state.label}</span>;

    if (state.category === 'waste')
      return <span className={`${base} bg-red-100 text-red-700`}>{state.label}</span>;

    return <span className={`${base} bg-gray-100 text-gray-600`}>{state.label}</span>;
  };

  /* ================= RISK BADGE ================= */

  const renderRiskBadge = (r: any) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    if (r.severity === 'HIGH')
      return <span className={`${base} bg-red-100 text-red-700`}>
        🔴 Alto ({r.findings_count})
      </span>;

    if (r.severity === 'MEDIUM')
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>
        🟡 Medio ({r.findings_count})
      </span>;

    if (r.severity === 'LOW')
      return <span className={`${base} bg-blue-100 text-blue-700`}>
        🔵 Bajo ({r.findings_count})
      </span>;

    return <span className={`${base} bg-green-100 text-green-700`}>
      🟢 Sin riesgos
    </span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Assets</h1>
        <p className="text-gray-500 mt-2">
          Vista ejecutiva del inventario cloud y su nivel de riesgo.
        </p>
      </div>

      {/* FILTRO */}
      <div className="flex gap-3">
        {['ALL','HIGH','MEDIUM','LOW'].map(level => (
          <button
            key={level}
            onClick={() => setSeverityFilter(level as any)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              severityFilter === level
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-600'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Recursos detectados
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Servicio</th>
                <th className="p-4 text-left">Tipo</th>
                <th className="p-4 text-left">Recurso</th>
                <th className="p-4 text-left">Región</th>
                <th className="p-4 text-left">Estado Operacional</th>
                <th className="p-4 text-left">Nivel de Riesgo</th>
              </tr>
            </thead>

            <tbody>
              {filteredResources.map((r) => (
                <tr key={r.resource_id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold">{r.service_name}</td>
                  <td className="p-4 text-gray-600">{r.resource_type}</td>
                  <td className="p-4 font-mono text-xs">{r.resource_id}</td>
                  <td className="p-4">{r.region}</td>
                  <td className="p-4">{renderStateBadge(r.state)}</td>
                  <td className="p-4">{renderRiskBadge(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}