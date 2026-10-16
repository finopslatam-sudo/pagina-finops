'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { useCloud } from '../context/CloudContext';

interface Props {
  provider: 'azure' | 'gcp';
}

export default function CloudProviderOverview({ provider }: Props) {
  const { token } = useAuth();
  const { clouds, refreshClouds } = useCloud();
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const info = clouds[provider];
  const isAzure = provider === 'azure';
  const providerTitle = isAzure ? 'Microsoft Azure' : 'Google Cloud Platform (GCP)';
  const providerIcon = isAzure ? '🔷' : '🔴';
  const accountTypeLabel = isAzure ? 'Suscripciones' : 'Proyectos';
  const connectionUrl = isAzure ? '/dashboard/azure' : '/dashboard/gcp';
  const auditApiUrl = isAzure ? '/api/client/azure/audit/run' : '/api/client/gcp/audit/run';

  const handleRunAudit = async () => {
    if (!token) return;
    setRunningAudit(true);
    setAuditMessage(null);

    try {
      await apiFetch(auditApiUrl, { method: 'POST', token });
      setAuditMessage(`Escaneo de ${info.name} iniciado en segundo plano. Los resultados se actualizarán al completar.`);
      await refreshClouds();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar escaneo';
      setAuditMessage(`Error: ${msg}`);
    } finally {
      setRunningAudit(false);
    }
  };

  if (!info.isConfigured) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 lg:p-10 rounded-3xl shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{providerIcon}</span>
          <div>
            <h2 className="text-2xl font-bold">{providerTitle} no configurado</h2>
            <p className="text-slate-300 text-sm mt-1">
              No tienes ninguna cuenta de {info.name} conectada a FinOps Latam todavía.
            </p>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/10 max-w-2xl space-y-3">
          <h3 className="font-semibold text-white text-base">¿Qué obtendrás al conectar {info.name}?</h3>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
            <li>Detección de recursos huérfanos (discos, IPs, snapshots no utilizados).</li>
            <li>Auditoría continua de seguridad y mejores prácticas de costos.</li>
            <li>Visibilidad centralizada multi-cloud en un único panel de control.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link
            href={connectionUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-md transition"
          >
            <span>Conectar {info.name} ahora</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── CARD RESUMEN DEL PROVEEDOR ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{providerIcon}</span>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
                {providerTitle}
              </h2>
              <p className="text-sm text-slate-500">
                {info.accountsCount} {accountTypeLabel.toLowerCase()} conectadas ({info.accountsCount} de {info.accountsLimit} de tu plan)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAudit}
              disabled={runningAudit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2"
            >
              {runningAudit ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Escaneando...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Ejecutar escaneo de {info.name}</span>
                </>
              )}
            </button>

            <Link
              href={connectionUrl}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition"
            >
              Administrar
            </Link>
          </div>
        </div>

        {auditMessage && (
          <div className="p-4 rounded-xl text-sm bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-between">
            <span>ℹ️ {auditMessage}</span>
            <button onClick={() => setAuditMessage(null)} className="font-bold text-blue-600 hover:text-blue-800">✕</button>
          </div>
        )}

        {/* ── LISTADO DE CUENTAS / SUSCRIPCIONES ── */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            {accountTypeLabel} Conectadas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {info.accounts.map((acc) => (
              <div
                key={acc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 truncate" title={acc.name}>
                    {acc.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ● Activa
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-mono truncate" title={acc.identifier}>
                  ID: {acc.identifier}
                </p>

                <div className="text-xs text-slate-500 pt-1 flex items-center justify-between border-t border-slate-200/60">
                  <span>Auditoría: {acc.auditStatus || 'idle'}</span>
                  <span>{acc.lastSync ? new Date(acc.lastSync).toLocaleDateString() : 'Sin sync'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

