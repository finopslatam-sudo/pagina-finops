'use client';

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

  const safeCurrent = typeof currentMonthCost === "number" ? currentMonthCost : 0;
  const safeSavings = typeof potentialSavings === "number" ? potentialSavings : 0;
  const safePercentage = typeof savingsPercentage === "number" ? savingsPercentage : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <Card
        title="Gasto actual mes"
        value={`$${safeCurrent.toFixed(2)}`}
        bg="bg-blue-50"
        border="border-blue-200"
      />

      <Card
        title="Ahorro potencial"
        value={`$${safeSavings.toFixed(2)}`}
        bg="bg-emerald-50"
        border="border-emerald-200"
      />

      <Card
        title="Potencial optimización"
        value={`${safePercentage}%`}
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
}: {
  title: string;
  value: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`${bg} ${border} border p-6 rounded-2xl shadow-sm`}>
      <h3 className="text-sm text-gray-600 mb-2 uppercase">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}