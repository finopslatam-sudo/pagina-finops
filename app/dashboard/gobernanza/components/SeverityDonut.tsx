'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DONUT_COLORS = ['#f87171', '#fbbf24', '#60a5fa'];

interface Props {
  f: { high: number; medium: number; low: number };
  severityData: { name: string; value: number }[];
}

export default function SeverityDonut({ f, severityData }: Props) {
  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Distribución por Severidad</h2>
        <p className="text-sm text-slate-500 mt-1">Findings activos clasificados por nivel de criticidad.</p>
      </div>

      {severityData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-4xl mb-3">✅</span>
          <p className="text-slate-600 font-medium">Sin findings activos</p>
          <p className="text-xs text-slate-400 mt-1">El entorno está completamente limpio</p>
        </div>
      ) : (
        <>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={severityData} dataKey="value" nameKey="name"
                  outerRadius={95} innerRadius={52}
                  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {severityData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n === 'HIGH' ? 'Alto' : n === 'MEDIUM' ? 'Medio' : 'Bajo']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Alto',  value: f.high,   color: 'bg-red-100 border-red-200 text-red-700' },
              { label: 'Medio', value: f.medium, color: 'bg-amber-100 border-amber-200 text-amber-700' },
              { label: 'Bajo',  value: f.low,    color: 'bg-blue-100 border-blue-200 text-blue-700' },
            ].map(s => (
              <div key={s.label} className={`flex flex-col items-center rounded-xl border px-3 py-3 ${s.color}`}>
                <span className="text-2xl font-bold">{s.value}</span>
                <span className="text-xs mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
