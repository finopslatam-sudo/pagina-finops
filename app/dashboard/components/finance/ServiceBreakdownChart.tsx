'use client';

import { formatUSD, formatPercentage } from "@/app/lib/finopsFormat";

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

  return (
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
  );
}
