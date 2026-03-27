'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

interface Props {
  riskDistribution:    { name: string; value: number }[];
  serviceDistribution: { name: string; value: number }[];
  servicesMeta:        { services?: Record<string, unknown> } | null;
}

export default function AssetsCharts({ riskDistribution, serviceDistribution, servicesMeta }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Distribución de Riesgo</h2>
        <p className="text-sm text-gray-500 mb-6">Proporción de recursos según nivel de severidad detectada.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" outerRadius={100} label>
                {riskDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Distribución por Servicio</h2>
        <p className="text-sm text-gray-500 mb-6">
          Inventario consolidado agrupado por tipo de servicio cloud.
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={serviceDistribution} dataKey="value" outerRadius={100} label>
                {serviceDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {servicesMeta && Object.keys(servicesMeta.services || {}).length > 0 && (
          <p className="text-xs text-gray-500 mt-3">
            Servicios detectados: {Object.keys(servicesMeta.services!).length}
          </p>
        )}
      </div>

    </div>
  );
}
