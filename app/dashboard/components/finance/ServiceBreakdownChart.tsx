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

  // 🔎 Filtrar servicios con monto real
  const filteredData = (data || [])
    .filter(item => item.amount > 0.01)
    .sort((a, b) => b.amount - a.amount);

  if (!filteredData.length) {
    return (
      <p className="text-gray-400 text-sm">
        No hay consumo registrado aún (Free Tier detectado).
      </p>
    );
  }

  // 🎨 Paleta pastel profesional
  const COLORS = [
    '#93c5fd', // blue-300
    '#86efac', // green-300
    '#fca5a5', // red-300
    '#c4b5fd', // purple-300
    '#fdba74', // orange-300
    '#67e8f9', // cyan-300
    '#f9a8d4', // pink-300
    '#fde68a', // yellow-300
  ];

  const total = filteredData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="space-y-6">

      {/* 🎯 Donut Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={filteredData}
            dataKey="amount"
            nameKey="service"
            outerRadius={120}
            innerRadius={70}
            label={(props) => {
              const percent = props.percent ?? 0;
              return `${(percent * 100).toFixed(0)}%`;
            }}
            isAnimationActive={true}
            animationDuration={800}
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

      {/* 📌 Leyenda personalizada */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {filteredData.map((item, index) => {
          const percentage =
            ((item.amount / total) * 100).toFixed(1);

          return (
            <div
              key={item.service}
              className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />
                <span className="text-gray-700">
                  {item.service}
                </span>
              </div>

              <div className="text-gray-600">
                {percentage}% · ${item.amount.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}