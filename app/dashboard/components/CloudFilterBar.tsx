'use client';

import Link from 'next/link';
import { useCloud, CloudProviderId } from '../context/CloudContext';

interface Props {
  className?: string;
  showAccountSelector?: boolean;
}

export default function CloudFilterBar({
  className = '',
  showAccountSelector = true,
}: Props) {
  const {
    clouds,
    loading,
    selectedProvider,
    setSelectedProvider,
    selectedAccountId,
    setSelectedAccountId,
  } = useCloud();

  const providers: { id: CloudProviderId; label: string; icon: string }[] = [
    { id: 'all', label: 'Todas las nubes', icon: '🌐' },
    { id: 'aws', label: 'AWS', icon: '🟠' },
    { id: 'azure', label: 'Azure', icon: '🔷' },
    { id: 'gcp', label: 'GCP', icon: '🔴' },
  ];

  // Cuentas disponibles según la nube seleccionada
  const accountsForSelection =
    selectedProvider === 'all'
      ? [
          ...clouds.aws.accounts,
          ...clouds.azure.accounts,
          ...clouds.gcp.accounts,
        ]
      : selectedProvider === 'aws'
      ? clouds.aws.accounts
      : selectedProvider === 'azure'
      ? clouds.azure.accounts
      : clouds.gcp.accounts;

  const currentCloudInfo =
    selectedProvider !== 'all' ? clouds[selectedProvider] : null;

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-4 lg:p-5 shadow-sm space-y-4 ${className}`}
    >
      {/* ── BARRA SUPERIOR: TÍTULO Y PILLS DE PROVEEDOR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-slate-800">
            ☁️ Nubes de Infraestructura
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {loading ? 'Cargando...' : `${clouds.aws.isConfigured ? 1 : 0 + (clouds.azure.isConfigured ? 1 : 0) + (clouds.gcp.isConfigured ? 1 : 0)} activas`}
          </span>
        </div>

        {/* Link directo a gestión de nubes */}
        <Link
          href="/dashboard/cloud"
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition self-start md:self-auto"
        >
          <span>⚙️ Administrar conexiones</span>
          <span>→</span>
        </Link>
      </div>

      {/* ── BOTONES / TABS DE NUBES ── */}
      <div className="flex flex-wrap items-center gap-2">
        {providers.map((p) => {
          const isSelected = selectedProvider === p.id;
          const info = p.id !== 'all' ? clouds[p.id] : null;
          const isConfigured = info ? info.isConfigured : true;

          return (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                  : isConfigured
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  : 'bg-white text-slate-400 border-dashed border-slate-200 hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{p.icon}</span>
              <span className="font-semibold">{p.label}</span>

              {/* Indicador de estado */}
              {p.id !== 'all' && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-md font-normal ${
                    isSelected
                      ? isConfigured
                        ? 'bg-white/20 text-emerald-200'
                        : 'bg-white/10 text-slate-300'
                      : isConfigured
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isConfigured
                    ? `${info?.accountsCount} ${info?.accountLabel}`
                    : 'Sin configurar'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── SELECTOR DE CUENTAS / SUSCRIPCIONES / PROYECTOS ── */}
      {showAccountSelector && (
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Filtrar por {selectedProvider === 'azure' ? 'Suscripción' : selectedProvider === 'gcp' ? 'Proyecto' : 'Cuenta'}:
            </span>

            <select
              value={selectedAccountId ?? ''}
              onChange={(e) =>
                setSelectedAccountId(e.target.value === '' ? null : e.target.value)
              }
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 max-w-full sm:max-w-xs"
            >
              <option value="">
                {selectedProvider === 'all'
                  ? 'Todas las cuentas y suscripciones'
                  : selectedProvider === 'aws'
                  ? 'Todas las cuentas AWS'
                  : selectedProvider === 'azure'
                  ? 'Todas las suscripciones Azure'
                  : 'Todos los proyectos GCP'}
              </option>

              {accountsForSelection.map((acc) => (
                <option key={`${acc.provider}-${acc.id}`} value={acc.id}>
                  {acc.provider.toUpperCase()} — {acc.name} ({acc.identifier})
                </option>
              ))}
            </select>
          </div>

          {/* Resumen del filtro activo */}
          <div className="text-xs text-slate-500">
            {selectedProvider === 'all' ? (
              <span>Visualizando infraestructura global consolidada</span>
            ) : currentCloudInfo?.isConfigured ? (
              <span className="text-emerald-700 font-medium">
                ● Conectada · {currentCloudInfo.accountsCount} {currentCloudInfo.accountLabel}
              </span>
            ) : (
              <span className="text-amber-600 font-medium">
                ⚠️ No configurada ·{' '}
                <Link
                  href={`/dashboard/cloud`}
                  className="underline hover:text-amber-800"
                >
                  Conectar ahora
                </Link>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

