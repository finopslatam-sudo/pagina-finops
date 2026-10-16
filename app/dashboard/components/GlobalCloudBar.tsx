'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCloud } from '../context/CloudContext';

/**
 * GlobalCloudBar:
 * Tira compacta global en el header del layout de dashboard.
 * Muestra el estado de las nubes configuradas y permite saltar a integraciones.
 */
export default function GlobalCloudBar() {
  const { clouds, loading } = useCloud();
  const pathname = usePathname();

  // No mostrar en la propia página de integraciones cloud para no redundar
  if (pathname === '/dashboard/cloud') return null;

  const totalConfigured =
    (clouds.aws.isConfigured ? 1 : 0) +
    (clouds.azure.isConfigured ? 1 : 0) +
    (clouds.gcp.isConfigured ? 1 : 0);

  return (
    <div className="w-full bg-slate-900 text-white rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span>☁️</span>
          <span>Nubes Conectadas ({loading ? '...' : totalConfigured}):</span>
        </span>

        {/* AWS */}
        <Link
          href="/dashboard/aws"
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium ${
            clouds.aws.isConfigured
              ? 'bg-orange-500/20 text-orange-200 border border-orange-500/30 hover:bg-orange-500/30'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span>🟠</span>
          <span>AWS</span>
          <span className="text-[10px] opacity-80">
            {clouds.aws.isConfigured ? `(${clouds.aws.accountsCount})` : '(—)'}
          </span>
        </Link>

        {/* Azure */}
        <Link
          href="/dashboard/azure"
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium ${
            clouds.azure.isConfigured
              ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30 hover:bg-blue-500/30'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span>🔷</span>
          <span>Azure</span>
          <span className="text-[10px] opacity-80">
            {clouds.azure.isConfigured ? `(${clouds.azure.accountsCount})` : '(—)'}
          </span>
        </Link>

        {/* GCP */}
        <Link
          href="/dashboard/gcp"
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition font-medium ${
            clouds.gcp.isConfigured
              ? 'bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          <span>🔴</span>
          <span>GCP</span>
          <span className="text-[10px] opacity-80">
            {clouds.gcp.isConfigured ? `(${clouds.gcp.accountsCount})` : '(—)'}
          </span>
        </Link>
      </div>

      <Link
        href="/dashboard/cloud"
        className="text-slate-300 hover:text-white transition font-medium flex items-center gap-1 self-end sm:self-auto"
      >
        <span>Gestionar integraciones</span>
        <span>→</span>
      </Link>
    </div>
  );
}

