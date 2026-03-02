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

  type Filters = {
    service: string;
    region: string;
    state: string;
    severity: 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
    search: string;
  };
  
  const [filters, setFilters] = useState<Filters>({
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
    () =>
      [...new Set(
        resources
          .map(r => r.state?.label)
          .filter((v): v is string => Boolean(v))
      )],
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

  const serviceDistribution = Object.values(
    filteredResources.reduce((acc, r) => {
      if (!acc[r.service_name]) {
        acc[r.service_name] = { name: r.service_name, value: 0 };
      }
      acc[r.service_name].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  const severityOptions: Filters['severity'][] = [
    'ALL',
    'HIGH',
    'MEDIUM',
    'LOW'
  ];

  /* ================= BADGES ================= */

  const renderStateBadge = (state: { label: string; category: string } | undefined) => {
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

  const renderRiskBadge = (r: {
    severity: 'HIGH' | 'MEDIUM' | 'LOW' | null | undefined;
    findings_count: number;
  }) => {
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

      {/* ================= HERO CARD ================= */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Assets & Overview
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Hallazgos de riesgo detectados en tu entorno cloud y oportunidades
          estratégicas de optimización. Esta vista consolida exposición,
          estado operacional y distribución por servicio para apoyar decisiones
          ejecutivas basadas en datos.
        </p>
      </div>

      {/* ================= ANALYTICS GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* ===== RISK DISTRIBUTION ===== */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-2">
          Distribución de Riesgo
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Proporción de recursos según nivel de severidad detectada.
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                outerRadius={100}
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

      {/* ===== SERVICE DISTRIBUTION ===== */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-2">
          Distribución por Servicio
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Inventario consolidado agrupado por tipo de servicio cloud.
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceDistribution}
                dataKey="value"
                outerRadius={100}
                label
              >
                {serviceDistribution.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

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
                options={severityOptions}
                onChange={(value) =>
                  setFilters(prev => ({
                    ...prev,
                    severity: value as Filters['severity']
                  }))
                }
              />

              <div className="flex flex-col text-sm">
                <label className="text-gray-500 mb-1">Buscar recurso</label>
                <input
                  type="text"
                  placeholder="Search resource..."
                  value={filters.search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters(prev => ({ ...prev, search: e.target.value }))
                  }
                  className="border rounded px-3 py-2"
                />
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

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col text-sm">
      <label className="text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}