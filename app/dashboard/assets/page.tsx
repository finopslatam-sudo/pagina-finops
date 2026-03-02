'use client';

import { useState, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AssetsPage() {

  const { data, loading, error } = useInventory();

  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    service: 'ALL',
    region: 'ALL',
    state: 'ALL',
    severity: 'ALL',
    search: ''
  });

  /* ================= SAFE DATA ================= */

  const resources = data?.resources ?? [];

  /* ================= UNIQUE VALUES ================= */

  const uniqueServices = useMemo(
    () => [...new Set(resources.map(r => r.service_name))],
    [resources]
  );

  const uniqueRegions = useMemo(
    () => [...new Set(resources.map(r => r.region))],
    [resources]
  );

  const uniqueStates = useMemo(
    () => [...new Set(resources.map(r => r.state?.label))],
    [resources]
  );

  /* ================= FILTER LOGIC ================= */

  const filteredResources = useMemo(() => {
    return resources.filter(r => {

      const matchesService =
        filters.service === 'ALL' || r.service_name === filters.service;

      const matchesRegion =
        filters.region === 'ALL' || r.region === filters.region;

      const matchesState =
        filters.state === 'ALL' || r.state?.label === filters.state;

      const matchesSeverity =
        filters.severity === 'ALL' || r.severity === filters.severity;

      const matchesSearch =
        r.resource_id.toLowerCase().includes(filters.search.toLowerCase());

      return (
        matchesService &&
        matchesRegion &&
        matchesState &&
        matchesSeverity &&
        matchesSearch
      );
    });
  }, [resources, filters]);

  /* ================= EARLY RETURNS ================= */

  if (loading) return <div className="p-6 text-gray-400">Cargando inventario...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return null;

  /* ================= ANALYTICS DATA ================= */

  const riskDistribution = [
    { name: 'Alto', value: filteredResources.filter(r => r.severity === 'HIGH').length },
    { name: 'Medio', value: filteredResources.filter(r => r.severity === 'MEDIUM').length },
    { name: 'Bajo', value: filteredResources.filter(r => r.severity === 'LOW').length },
    { name: 'Sin Riesgo', value: filteredResources.filter(r => !r.severity).length }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  /* ================= BADGES ================= */

  const renderStateBadge = (state: any) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    if (!state) return null;

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
      return <span className={`${base} bg-red-100 text-red-700`}>🔴 Alto ({r.findings_count})</span>;

    if (r.severity === 'MEDIUM')
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>🟡 Medio ({r.findings_count})</span>;

    if (r.severity === 'LOW')
      return <span className={`${base} bg-blue-100 text-blue-700`}>🔵 Bajo ({r.findings_count})</span>;

    return <span className={`${base} bg-green-100 text-green-700`}>🟢 Sin riesgos</span>;
  };

  /* ================= RENDER ================= */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Assets</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Vista consolidada del inventario cloud con análisis de riesgo,
          estado operacional y exposición potencial. Permite identificar
          recursos críticos, infraestructura subutilizada y prioridades
          de optimización en tiempo real.
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border flex flex-wrap gap-4 items-end">

        <FilterSelect
          label="Servicio"
          value={filters.service}
          options={['ALL', ...uniqueServices]}
          onChange={(value: string) =>
            setFilters(prev => ({ ...prev, service: value }))
          }
        />

        <FilterSelect
          label="Región"
          value={filters.region}
          options={['ALL', ...uniqueRegions]}
          onChange={(value: string) =>
            setFilters(prev => ({ ...prev, region: value }))
          }
        />

        <FilterSelect
          label="Estado"
          value={filters.state}
          options={['ALL', ...uniqueStates]}
          onChange={(value: string) =>
            setFilters(prev => ({ ...prev, state: value }))
          }
        />

        <FilterSelect
          label="Riesgo"
          value={filters.severity}
          options={['ALL', 'HIGH', 'MEDIUM', 'LOW']}
          onChange={(value: string) =>
            setFilters(prev => ({ ...prev, severity: value }))
          }
        />

        <div className="flex flex-col text-sm">
          <label className="text-gray-500 mb-1">Buscar recurso</label>
          <input
            type="text"
            placeholder="ID del recurso..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilters(prev => ({ ...prev, search: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
        </div>

      </div>

      {/* ================= ANALYTICS CARD ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Distribución de Riesgo
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                outerRadius={120}
                label
              >
                {riskDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABLE ================= */}
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
/* ================= FILTER COMPONENT ================= */

function FilterSelect({ label, value, options, onChange }: any) {
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