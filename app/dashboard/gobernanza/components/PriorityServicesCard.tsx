interface Props {
  services: Record<string, unknown>[];
}

export default function PriorityServicesCard({ services }: Props) {
  if (!services.length) return null;

  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Servicios Prioritarios</h2>
        <p className="text-sm text-slate-500 mt-1">Servicios con mayor concentración de riesgo que requieren atención inmediata.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.slice(0, 6).map((svc, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <p className="font-semibold text-slate-700 text-sm">
              {(svc.service ?? svc.service_name ?? '—') as string}
            </p>
            {svc.high_findings != null && (
              <p className="text-xs text-red-500">{svc.high_findings as number} findings HIGH</p>
            )}
            {svc.risk_score != null && (
              <p className="text-xs text-slate-400">Risk score: {svc.risk_score as number}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
