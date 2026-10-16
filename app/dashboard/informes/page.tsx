'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useCloud } from '../context/CloudContext';
import { REPORTS, type ExportFormat, type ReportDef } from './constants';
import InformesHero from './components/InformesHero';
import ReportCard, { type ReportAccountOption } from './components/ReportCard';
import CloudFilterBar from '../components/CloudFilterBar';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function InformesPage() {
  const { token, isAuthReady, isFoundation, isProfessional, isEnterprise } = useAuth();
  const { clouds, selectedProvider, loading: loadingCloud } = useCloud();

  const currentPlan = isFoundation ? 'foundation' : isProfessional ? 'professional' : isEnterprise ? 'enterprise' : null;
  const visibleReports = currentPlan
    ? REPORTS.filter(r => r.allowedPlans.includes(currentPlan))
    : REPORTS;

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, number | string | null>>({});

  const setAccount = (reportId: string, value: number | string | null) =>
    setSelectedAccounts(prev => ({ ...prev, [reportId]: value }));

  const availableAccounts: ReportAccountOption[] = useMemo(() => {
    if (selectedProvider === 'aws') {
      return clouds.aws.accounts.map(a => ({ id: a.id, name: a.name, identifier: a.identifier, provider: 'aws' as const }));
    }
    if (selectedProvider === 'azure') {
      return clouds.azure.accounts.map(a => ({ id: a.id, name: a.name, identifier: a.identifier, provider: 'azure' as const }));
    }
    if (selectedProvider === 'gcp') {
      return clouds.gcp.accounts.map(a => ({ id: a.id, name: a.name, identifier: a.identifier, provider: 'gcp' as const }));
    }
    return [
      ...clouds.aws.accounts.map(a => ({ id: a.id, name: `[AWS] ${a.name}`, identifier: a.identifier, provider: 'aws' as const })),
      ...clouds.azure.accounts.map(a => ({ id: a.id, name: `[Azure] ${a.name}`, identifier: a.identifier, provider: 'azure' as const })),
      ...clouds.gcp.accounts.map(a => ({ id: a.id, name: `[GCP] ${a.name}`, identifier: a.identifier, provider: 'gcp' as const })),
    ];
  }, [clouds, selectedProvider]);

  const handleExport = async (report: ReportDef, format: ExportFormat) => {
    if (!isAuthReady || !token) { setError('Inicia sesión para exportar informes.'); return; }
    if (!report.endpoint) return;

    const key = `${report.id}-${format}`;
    setLoadingKey(key);
    setError(null);
    setSuccess(null);

    try {
      const accountId = selectedAccounts[report.id] ?? null;
      const params = new URLSearchParams();
      if (accountId) params.set('account_id', String(accountId));
      if (selectedProvider && selectedProvider !== 'all') params.set('provider', selectedProvider);
      const qs = params.toString() ? `?${params.toString()}` : '';

      const res = await fetch(`${API_URL}${report.endpoint}/${format}${qs}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe-${report.id}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(`Informe "${report.title}" descargado correctamente.`);
    } catch {
      setError('No se pudo generar el informe. Intenta nuevamente.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-10">
      <InformesHero
        availableCount={visibleReports.filter(r => r.available).length}
        totalCount={visibleReports.length}
      />

      <CloudFilterBar />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="font-bold">×</button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-3 text-sm flex justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="font-bold">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleReports.map(report => (
          <ReportCard
            key={report.id}
            report={report}
            accounts={availableAccounts}
            loadingAccounts={loadingCloud}
            selectedAccount={selectedAccounts[report.id] ?? null}
            selectedProvider={selectedProvider}
            loadingKey={loadingKey}
            onSelectAccount={setAccount}
            onExport={handleExport}
          />
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">📌 Nota sobre los informes</p>
        <p>
          Todos los informes se generan en tiempo real con los datos más recientes de tu entorno cloud.
          Los datos de costos provienen directamente de Cost Explorer y son actualizados continuamente.
          Los informes en formato PDF son adecuados para presentaciones ejecutivas y auditorías.
          Para análisis de datos, utiliza los formatos CSV o XLSX.
        </p>
      </div>
    </div>
  );
}
