import { FindingsStats } from "../types";

interface Props {
  stats: FindingsStats;
}

export default function FindingsStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Card title="Active" value={stats.active} />
      <Card title="Resolved" value={stats.resolved} />
      <Card title="High Severity" value={stats.high} />
      <Card
        title="Monthly Savings"
        value={`$${stats.estimated_monthly_savings}`}
      />
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
