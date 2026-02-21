'use client';

import { useDashboardSummary } from '../hooks/useDashboardSummary';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function GobernanzaPage() {
  const { data, loading } = useDashboardSummary();

  if (loading) {
    return <p className="p-6 text-gray-400">Cargando gobernanza...</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">Error al cargar datos</p>;
  }

  /* =======================
     MÉTRICAS DERIVADAS
  ======================== */

  const totalActive =
    data.findings.high +
    data.findings.medium +
    data.findings.low;

  const resolvedPercentage =
    data.findings.total > 0
      ? Math.round(
          (data.findings.resolved / data.findings.total) * 100
        )
      : 0;

  const riskScore =
    totalActive === 0
      ? 0
      : data.findings.high * 5 +
        data.findings.medium * 3 +
        data.findings.low * 1;

  const healthScore = Math.max(0, 100 - riskScore);

  let riskLabel = 'Riesgo Bajo';
  let riskColor = 'bg-green-600';

  if (healthScore < 70) {
    riskLabel = 'Riesgo Medio';
    riskColor = 'bg-yellow-500';
  }

  if (healthScore < 40) {
    riskLabel = 'Riesgo Alto';
    riskColor = 'bg-red-600';
  }

  const severityData = [
    { name: 'HIGH', value: data.findings.high },
    { name: 'MEDIUM', value: data.findings.medium },
    { name: 'LOW', value: data.findings.low },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-14">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Gobernanza & Compliance
        </h1>
        <p className="text-gray-500 mt-2">
          Control de riesgo, estado operativo y salud general del entorno cloud.
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <KpiCard title="HIGH" value={data.findings.high} color="bg-red-600" />
        <KpiCard title="MEDIUM" value={data.findings.medium} color="bg-yellow-500" />
        <KpiCard title="LOW" value={data.findings.low} color="bg-blue-600" />
        <KpiCard title="Recursos afectados" value={data.resources_affected} color="bg-purple-600" />

        <div className={`p-6 rounded-xl shadow text-white ${riskColor}`}>
          <h3 className="text-xs uppercase opacity-80">
            Salud general
          </h3>
          <p className="text-3xl font-bold">
            {healthScore}%
          </p>
          <p className="text-sm mt-1 opacity-90">
            {riskLabel}
          </p>
        </div>

      </div>

      {/* DISTRIBUCIÓN + ESTADO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* DONUT SEVERIDAD */}
        <div className="bg-white p-8 rounded-3xl border shadow-xl">
          <h2 className="text-xl font-semibold mb-6">
            Distribución por severidad
          </h2>

          {totalActive === 0 ? (
            <p className="text-gray-400">
              No existen findings activos.
            </p>
          ) : (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={60}
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ESTADO DE RESOLUCIÓN */}
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <h2 className="text-xl font-semibold">
            Estado de resolución
          </h2>

          <div>
            <p className="text-sm text-gray-500">
              Progreso de resolución
            </p>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-700"
                style={{ width: `${resolvedPercentage}%` }}
              />
            </div>

            <p className="text-sm mt-2 font-semibold">
              {resolvedPercentage}% completado
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Total findings
              </p>
              <p className="text-2xl font-semibold">
                {data.findings.total}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Activos
              </p>
              <p className="text-2xl font-semibold">
                {totalActive}
              </p>
            </div>

          </div>

          <div>
            <p className="text-sm text-gray-500">
              Última sincronización
            </p>
            <p className="text-sm text-gray-700">
              {data.last_sync
                ? new Date(data.last_sync).toLocaleString()
                : 'Sin sincronización registrada'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================
   KPI CARD COMPONENT
========================= */

function KpiCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`p-6 rounded-xl shadow text-white ${color}`}>
      <h3 className="text-xs uppercase opacity-80">
        {title}
      </h3>
      <p className="text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}