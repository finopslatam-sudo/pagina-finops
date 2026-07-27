'use client';

interface InformesHeroProps {
  availableCount: number;
  totalCount: number;
}

export default function InformesHero({ availableCount, totalCount }: InformesHeroProps) {
  const stats = [
    { label: 'Formatos disponibles', value: 'PDF · CSV · XLSX', icon: '📄' },
    { label: 'Generación', value: 'Tiempo real', icon: '⚡' },
    { label: 'Datos actualizados', value: 'Cada 24 horas', icon: '🔄' },
    { label: 'Idioma', value: 'Español', icon: '🌎' },
  ];

  return (
    <div className="bg-gradient-to-br from-violet-50 via-pink-50 to-sky-50 border border-purple-100 rounded-3xl p-6 lg:p-10 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Informes Ejecutivos</h1>
          <p className="text-slate-500 mt-3 max-w-3xl leading-relaxed">
            Genera y descarga informes formales de tu entorno cloud: hallazgos, costos, riesgos e inventario.
            Diseñados para dirección, equipos técnicos y auditorías internas. Disponibles en múltiples formatos.
          </p>
        </div>
        <div className="flex flex-col items-end justify-center">
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">{availableCount}/{totalCount}</div>
            <div className="text-xs text-slate-400">informes disponibles</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white/70 border border-purple-100 rounded-2xl p-4">
            <div className="text-lg font-bold text-slate-700">{s.icon} {s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
