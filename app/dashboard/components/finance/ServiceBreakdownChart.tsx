'use client';

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { service: string; amount: number }[];
}

export default function ServiceBreakdownChart({ data }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-lg">
      <h3 className="text-md font-semibold mb-4">
        Distribución por servicio
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="service"
            outerRadius={120}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}