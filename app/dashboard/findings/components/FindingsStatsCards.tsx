import { FindingsStats } from "../types";

interface Props {
  stats: FindingsStats;
}

export default function FindingsStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6">

      <Card
        title="Active"
        value={stats.active}
        color="rose"
      />

      <Card
        title="Resolved"
        value={stats.resolved}
        color="emerald"
      />

      <Card
        title="High Severity"
        value={stats.high}
        color="amber"
      />

      <Card
        title="Monthly Savings"
        value={`$${stats.estimated_monthly_savings}`}
        color="blue"
      />
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: "rose" | "emerald" | "amber" | "blue";
}) {

  const colors = {
    rose: "bg-rose-50 border-rose-200 text-rose-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${colors[color]}`}>
      <div className="text-sm uppercase tracking-wide opacity-80 mb-2">
        {title}
      </div>
      <div className="text-3xl font-bold">
        {value}
      </div>
    </div>
  );
}