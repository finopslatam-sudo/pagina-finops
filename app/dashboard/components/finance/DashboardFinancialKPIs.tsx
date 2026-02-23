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
      />

      <Card
        title="Ahorro potencial"
        value={`$${safeSavings.toFixed(2)}`}
      />

      <Card
        title="Potencial optimización"
        value={`${safePercentage}%`}
      />

    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-lg">
      <h3 className="text-sm text-gray-500 mb-2 uppercase">
        {title}
      </h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}