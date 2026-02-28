'use client';

import { useDashboard } from '../hooks/useDashboard';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function GobernanzaPage() {
  const { data, loading } = useDashboard();

  if (loading) {
    return <p className="p-6 text-gray-400">Cargando gobernanza...</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">Error al cargar datos</p>;
  }

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
  let healthColor = 'bg-emerald-100 text-emerald-700';

  if (healthScore < 70) {
    riskLabel = 'Riesgo Medio';
    healthColor = 'bg-yellow-100 text-yellow-700';
  }

  if (healthScore < 40) {
    riskLabel = 'Riesgo Alto';
    healthColor = 'bg-red-100 text-red-700';
  }

  const severityData = [
    { name: 'HIGH', value: data.findings.high },
    { name: 'MEDIUM', value: data.findings.medium },
    { name: 'LOW', value: data.findings.low },
  ];

  const COLORS = ['#fca5a5', '#fde68a', '#93c5fd'];

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

      {/* KPI GRID PASTEL */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <PastelCard title="HIGH" value={data.findings.high} bg="bg-red-50" text="text-red-600" />
        <PastelCard title="MEDIUM" value={data.findings.medium} bg="bg-yellow-50" text="text-yellow-600" />
        <PastelCard title="LOW" value={data.findings.low} bg="bg-blue-50" text="text-blue-600" />
        <PastelCard title="Recursos afectados" value={data.resources_affected} bg="bg-purple-50" text="text-purple-600" />

        <div className={`p-6 rounded-2xl border ${healthColor}`}>
          <h3 className="text-xs uppercase opacity-80">
            Salud general
          </h3>
          <p className="text-3xl font-bold">
            {healthScore}%
          </p>
          <p className="text-sm mt-1">
            {riskLabel}
          </p>
        </div>

      </div>

      {/* DISTRIBUCIÓN + ESTADO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* DONUT SEVERIDAD */}
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <h2 className="text-xl font-semibold">
            Distribución por severidad
          </h2>

          {totalActive === 0 ? (
            <p className="text-gray-400">
              No existen findings activos.
            </p>
          ) : (
            <>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={severityData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      innerRadius={60}
                      label={(props) => {
                        const percent = props.percent ?? 0;
                        return `${(percent * 100).toFixed(0)}%`;
                      }}
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

              {/* Leyenda */}
              <div className="space-y-2 text-sm">
                {severityData.map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
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
                className="bg-emerald-500 h-4 rounded-full transition-all duration-700"
                style={{ width: `${resolvedPercentage}%` }}
              />
            </div>

            <p className="text-sm mt-2 font-semibold">
              {resolvedPercentage}% completado
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <Metric label="Total findings" value={data.findings.total} />
            <Metric label="Activos" value={totalActive} />

          </div>

          <div>
            <p className="text-sm text-gray-500">
              Risk Score ponderado
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {riskScore}
            </p>
            <p className="text-xs text-gray-400">
              (HIGH x5 · MEDIUM x3 · LOW x1)
            </p>
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

/* COMPONENTES */

function PastelCard({
  title,
  value,
  bg,
  text,
}: {
  title: string;
  value: number;
  bg: string;
  text: string;
}) {
  return (
    <div className={`${bg} p-6 rounded-2xl border`}>
      <h3 className="text-xs uppercase text-gray-500">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${text}`}>
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}