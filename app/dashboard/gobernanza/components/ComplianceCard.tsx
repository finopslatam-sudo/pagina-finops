/* SVG circular gauge */
function Gauge({ value, size = 180 }: { value: number; size?: number }) {
  const c = size / 2;
  const r = size * 0.38;
  const stroke = size * 0.072;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (pct / 100) * circumference;
  const col =
    pct >= 80 ? { stroke: '#10b981', text: 'text-emerald-600' } :
    pct >= 50 ? { stroke: '#f59e0b', text: 'text-amber-600'   } :
                { stroke: '#ef4444', text: 'text-red-600'      };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={c} cy={c} r={r} fill="none"
          stroke={col.stroke} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${col.text}`}>{pct}%</span>
        <span className="text-xs text-slate-500 mt-0.5">compliance</span>
      </div>
    </div>
  );
}

function ResourceBar({ label, value, total, color }: {
  label: string; value: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-medium">{value} ({pct}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface Props {
  gov: {
    compliance_percentage: number;
    compliant_resources: number;
    non_compliant_resources: number;
    total_resources: number;
  };
}

export default function ComplianceCard({ gov }: Props) {
  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Nivel de Compliance</h2>
        <p className="text-sm text-slate-500 mt-1">Recursos que cumplen las buenas prácticas de AWS sobre el total escaneado.</p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <Gauge value={gov.compliance_percentage} size={200} />
        <div className="w-full space-y-3">
          <ResourceBar label="Conformes"    value={gov.compliant_resources}     total={gov.total_resources} color="bg-emerald-500" />
          <ResourceBar label="No conformes" value={gov.non_compliant_resources} total={gov.total_resources} color="bg-red-400" />
        </div>
      </div>
    </div>
  );
}
