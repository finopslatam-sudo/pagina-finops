'use client';

import { useState, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';

export default function AssetsPage() {
  const { data, loading, error } = useInventory();

  const [filters, setFilters] = useState({
    service: 'ALL',
    region: 'ALL',
    state: 'ALL',
    severity: 'ALL'
  });

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  const resources = data.resources;

  /* ============================
     FILTROS DINÁMICOS
  ============================ */

  const uniqueServices = [...new Set(resources.map(r => r.service_name))];
  const uniqueRegions = [...new Set(resources.map(r => r.region))];
  const uniqueStates = [...new Set(resources.map(r => r.state.label))];

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      return (
        (filters.service === 'ALL' || r.service_name === filters.service) &&
        (filters.region === 'ALL' || r.region === filters.region) &&
        (filters.state === 'ALL' || r.state.label === filters.state) &&
        (filters.severity === 'ALL' || r.severity === filters.severity)
      );
    });
  }, [resources, filters]);

  /* ============================
     KPI METRICS
  ============================ */

  const total = filteredResources.length;
  const highRisk = filteredResources.filter(r => r.severity === 'HIGH').length;
  const waste = filteredResources.filter(r => r.state.category === 'waste').length;
  const healthy = filteredResources.filter(r => r.state.category === 'healthy').length;

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
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Assets</h1>
        <p className="text-gray-500 mt-2">
          Vista ejecutiva del inventario cloud y exposición a riesgo.
        </p>
      </div>

      {/* ================= FILTROS ENTERPRISE ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border flex flex-wrap gap-4 items-end">

        <SelectFilter
          label="Servicio"
          value={filters.service}
          options={['ALL', ...uniqueServices]}
          onChange={(value: string) =>
            setFilters({ ...filters, service: value })
          }
        />

        <SelectFilter
          label="Región"
          value={filters.region}
          options={['ALL', ...uniqueRegions]}
          onChange={(value: string) =>
            setFilters({ ...filters, region: value })
          }
        />

        <SelectFilter
          label="Estado"
          value={filters.state}
          options={['ALL', ...uniqueStates]}
          onChange={(value: string) =>
            setFilters({ ...filters, state: value })
          }
        />

        <SelectFilter
          label="Riesgo"
          value={filters.severity}
          options={['ALL', 'HIGH', 'MEDIUM', 'LOW']}
          onChange={(value: string) =>
            setFilters({ ...filters, severity: value })
          }
        />

      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <KpiCard title="Total Recursos" value={total} color="blue" />
        <KpiCard title="Riesgo Alto" value={highRisk} color="red" />
        <KpiCard title="Sin Uso" value={waste} color="orange" />
        <KpiCard title="Operativos" value={healthy} color="green" />

      </div>

      {/* ================= TABLA ================= */}
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
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Riesgo</th>
              </tr>
            </thead>

            <tbody>
              {filteredResources.map((r) => (
                <tr key={r.resource_id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{r.service_name}</td>
                  <td className="p-4">{r.resource_type}</td>
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

/* ================= COMPONENTES ================= */

function SelectFilter({ label, value, options, onChange }: any) {
  return (
    <div className="flex flex-col text-sm">
      <label className="text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {options.map((opt: string) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function KpiCard({ title, value, color }: any) {

  const colorMap: any = {
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}