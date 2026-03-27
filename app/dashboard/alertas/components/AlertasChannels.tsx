const CHANNELS = [
  { icon: '📧', label: 'Email',  desc: 'Notificación directa por correo',  status: null },
  { icon: '💬', label: 'Slack',  desc: 'Alertas en canales de Slack',       status: 'Próximamente' },
  { icon: '👥', label: 'Teams',  desc: 'Alertas en Microsoft Teams',        status: 'Próximamente' },
];

export default function AlertasChannels() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-8">
      <h2 className="text-lg font-bold text-slate-800 mb-1">Canales de Notificación</h2>
      <p className="text-sm text-slate-500 mb-6">
        Configura los destinos donde se enviarán las alertas cuando se active una política.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CHANNELS.map(ch => (
          <div key={ch.label} className="border border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center text-center gap-2">
            <span className="text-3xl">{ch.icon}</span>
            <span className="font-semibold text-slate-700 text-sm">{ch.label}</span>
            <span className="text-xs text-slate-400">{ch.desc}</span>
            {ch.status && (
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{ch.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
