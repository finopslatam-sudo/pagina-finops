'use client';

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  data: { service: string; amount: number }[];
}

export default function ServiceBreakdownChart({ data }: Props) {

  // 🔎 Filtrar servicios con monto real (> 0.01)
  const filteredData = (data || [])
    .filter(item => item.amount > 0.01)
    .sort((a, b) => b.amount - a.amount);

  // 🟡 Caso Free Tier / Sin consumo
  if (!filteredData.length) {
    return (
      <div className="bg-white p-6 rounded-2xl border shadow-lg">
        <h3 className="text-md font-semibold mb-4">
          Distribución por servicio
        </h3>
        <p className="text-gray-400 text-sm">
          No hay consumo registrado aún (Free Tier detectado).
        </p>
      </div>
    );
  }

  // 🎨 Colores profesionales enterprise
  const COLORS = [
    '#2563eb',
    '#16a34a',
    '#dc2626',
    '#9333ea',
    '#ea580c',
    '#0891b2',
    '#7c3aed',
    '#059669',
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-lg">
      <h3 className="text-md font-semibold mb-4">
        Distribución por servicio
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="amount"
            nameKey="service"
            outerRadius={120}
            label
          >
            {filteredData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
          formatter={(value) => {
            const numericValue =
              typeof value === 'number'
                ? value
                : parseFloat(value as string);

            if (isNaN(numericValue)) return '$0.00';

            return `$${numericValue.toFixed(2)}`;
          }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}