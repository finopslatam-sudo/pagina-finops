'use client';

import { formatUSD, formatPercentage } from "@/app/lib/finopsFormat";

interface Props {
  currentMonthCost?: number;
  potentialSavings?: number;
  savingsPercentage?: number;
}

export default function DashboardFinancialKPIs({
  currentMonthCost,
  potentialSavings,
  savingsPercentage,
}: Props) {

  const safeCurrent =
    typeof currentMonthCost === "number" ? currentMonthCost : 0;

  const safeSavings =
    typeof potentialSavings === "number" ? potentialSavings : 0;

  const safePercentage =
    typeof savingsPercentage === "number" ? savingsPercentage : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <Card
        title="Gasto actual mensual"
        value={formatUSD(safeCurrent)}

        bg="bg-blue-50"
        border="border-blue-200"
      />

      <Card
        title="Ahorro potencial mensual"
        value={formatUSD(safeSavings)}
        bg="bg-emerald-50"
        border="border-emerald-200"
        tooltip="El ahorro potencial solo considera hallazgos con impacto economico directo. Los hallazgos de revision y gobernanza no inflan este indicador."
      />

      <Card
        title="Potencial optimización"
        value={formatPercentage(safePercentage)}
        bg="bg-purple-50"
        border="border-purple-200"
      />

    </div>
  );
}

function Card({
  title,
  value,
  bg,
  border,
  tooltip,
}: {
  title: string;
  value: string;
  bg: string;
  border: string;
  tooltip?: string;
}) {
  return (
    <div className={`${bg} ${border} border p-6 rounded-2xl shadow-sm`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-sm text-gray-600 uppercase">
          {title}
        </h3>

        {tooltip ? (
          <div className="group relative shrink-0">
            <button
              type="button"
              aria-label={`Informacion sobre ${title}`}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white/80 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-white"
            >
              i
            </button>

            <div className="pointer-events-none absolute right-0 top-8 z-10 w-64 rounded-xl border border-gray-200 bg-white p-3 text-xs normal-case text-gray-600 opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
              {tooltip}
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}
