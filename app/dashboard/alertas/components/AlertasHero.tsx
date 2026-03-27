type Props = { historyCount: number; configuredChannels: number };

export default function AlertasHero({ historyCount, configuredChannels }: Props) {
  const stats = [
    { label: 'Políticas configuradas',   value: String(historyCount),          icon: '📋' },
    { label: 'Alertas activas',          value: String(historyCount),          icon: '🔔' },
    { label: 'Alertas disparadas hoy',   value: '0',                           icon: '⚡' },
    { label: 'Canales de notificación',  value: String(configuredChannels),    icon: '📨' },
  ];

  return (
    <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 lg:p-10 shadow-md text-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold">Políticas &amp; Alertas</h1>
          <p className="text-slate-700 mt-3 max-w-3xl leading-relaxed">
            Define reglas de presupuesto, alertas de consumo, detección de anomalías y políticas de
            gobernanza para mantener el control total del gasto cloud de tu organización.
          </p>
        </div>
        <span className="text-xs text-slate-500">9 tipos de políticas disponibles</span>
      </div>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white/80 border border-white/70 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-800">{s.icon} {s.value}</div>
            <div className="text-xs text-slate-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
