'use client';

import Link from 'next/link';
import { useCloud } from '@/app/dashboard/context/CloudContext';

export default function CloudAccountsCard() {
  const { clouds, loading } = useCloud();

  const providerList = [
    { key: 'aws', label: 'AWS', icon: '🟠', info: clouds.aws, color: 'bg-orange-500' },
    { key: 'azure', label: 'Azure', icon: '🔷', info: clouds.azure, color: 'bg-blue-500' },
    { key: 'gcp', label: 'GCP', icon: '🔴', info: clouds.gcp, color: 'bg-red-500' },
  ] as const;

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-3xl border shadow-xl animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            ☁️ Nubes &amp; Cuentas Conectadas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resumen de suscripciones, proyectos y cuentas conectadas por proveedor.
          </p>
        </div>

        <Link
          href="/dashboard/cloud"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <span>Gestionar conexiones</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providerList.map(({ key, label, icon, info, color }) => {
          const used = info.accountsCount;
          const limit = info.accountsLimit || 10;
          const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
          const isNearLimit = percentage >= 80;

          return (
            <div
              key={key}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-bold text-slate-800">{label}</span>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    info.isConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {info.isConfigured ? 'Conectada' : 'Sin configurar'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{used}</span>
                <span className="text-slate-400 text-sm">
                  / {limit} {info.accountLabel}
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isNearLimit ? 'bg-amber-500' : color
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  {info.isConfigured
                    ? `${used} de ${limit} ${info.accountLabel} usadas`
                    : `0 de ${limit} ${info.accountLabel}`}
                </span>
                <Link
                  href={`/dashboard/${key}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {info.isConfigured ? 'Ver →' : 'Conectar +'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

