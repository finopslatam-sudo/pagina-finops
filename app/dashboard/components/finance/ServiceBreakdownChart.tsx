'use client';

import { formatUSD, formatPercentage } from "@/app/lib/finopsFormat";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { service: string; amount: number }[];
}

export default function ServiceBreakdownChart({ data }: Props) {
  const rows = (data || [])
    .filter((item) => item.amount > 0.01)
    .sort((a, b) => b.amount - a.amount);

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
        No se ha detectado consumo facturable en esta cuenta.
      </div>
    );
  }

  const total = rows.reduce((sum, item) => sum + item.amount, 0);
  const chartRows = rows.slice(0, 8).map((item) => ({
    ...item,
    percentage: total > 0 ? (item.amount / total) * 100 : 0,
  }));

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-5 py-4 font-semibold">Servicio</th>
              <th className="px-5 py-4 font-semibold">Costo mensual</th>
              <th className="px-5 py-4 font-semibold">Porcentaje</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((item) => {
              const percentage = total > 0
                ? (item.amount / total) * 100
                : 0;

              return (
                <tr key={item.service} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 text-gray-900">{item.service}</td>
                  <td className="px-5 py-4 text-gray-700">
                    {formatUSD(item.amount)}
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full max-w-[180px] overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="min-w-[56px] text-right">
                        {formatPercentage(percentage)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-5 py-4 font-semibold text-gray-900">Total</td>
              <td className="px-5 py-4 font-semibold text-gray-900">
                {formatUSD(total)}
              </td>
              <td className="px-5 py-4 font-semibold text-gray-900">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Participacion por servicio
          </h3>
          <p className="text-sm text-gray-500">
            Vista resumida de los servicios con mayor peso en el costo mensual.
          </p>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartRows}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
              />
              <YAxis
                type="category"
                dataKey="service"
                width={180}
              />
              <Tooltip
                formatter={(value, name) => {
                  const numericValue =
                    typeof value === "number"
                      ? value
                      : parseFloat(value as string);

                  if (name === "percentage") {
                    return formatPercentage(
                      Number.isNaN(numericValue) ? 0 : numericValue
                    );
                  }

                  return formatUSD(
                    Number.isNaN(numericValue) ? 0 : numericValue
                  );
                }}
                labelFormatter={(label) => `Servicio: ${label}`}
              />
              <Bar
                dataKey="percentage"
                name="percentage"
                fill="#3b82f6"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
