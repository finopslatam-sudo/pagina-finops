'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { useFindings } from './hooks/useFindings';
import { useFindingsStats } from './hooks/useFindingsStats';
import { useScanAudit } from './hooks/useScanAudit';
import { useFindingsFilters } from './hooks/useFindingsFilters';

import FindingsStatsCards from './components/FindingsStatsCards';
import FindingsTable from './components/FindingsTable';
import FindingsFilters from './components/FindingsFilters';
import FindingsDrawer from './components/FindingsDrawer';
import FindingsHeader from './components/FindingsHeader';
import ScanModal from './components/ScanModal';
import ScanSuccessModal from './components/ScanSuccessModal';

import { Finding } from './types';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

export default function FindingsPage() {
  const { token, isAuthReady } = useAuth();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const filters = useFindingsFilters();

  const { data, pages, loading, error, resolveFinding, refetch } = useFindings({
    page,
    severity: filters.severity,
    status: filters.status,
    search: filters.search,
    service: filters.service,
    account: filters.account,
    region: filters.region,
  });

  const { stats, refetch: refetchStats } = useFindingsStats({
    severity: filters.severity,
    status: filters.status,
    search: filters.search,
    service: filters.service,
    account: filters.account,
    region: filters.region,
  });

  const { scanModal, scanSuccess, runningAudit, runAudit, closeScanSuccess } = useScanAudit({
    token,
    onScanComplete: async () => { await refetch(); await refetchStats(); },
    onLastScanUpdate: setLastScan,
  });

  const availableRegions: string[] = Array.from(
    new Set(data.map(f => f.region?.trim().toLowerCase().slice(0, 9)).filter((r): r is string => Boolean(r)))
  ).sort();

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) { filters.handleFiltersChange({ service: serviceParam }); setPage(1); }
  }, [searchParams]);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ last_scan?: string | null }>('/api/client/dashboard/last-scan', { token })
      .then(res => { if (res.last_scan) setLastScan(res.last_scan); })
      .catch(console.error);
  }, []);

  const handleResolve = async (id: number) => {
    await resolveFinding(id);
    await refetch();
    await refetchStats();
    setSelectedFinding(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-14">

      <FindingsHeader runningAudit={runningAudit} lastScan={lastScan} onRunAudit={runAudit} />

      {stats && <FindingsStatsCards stats={stats} />}

      <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
        <span className="text-xl">📄</span>
        <p className="text-base font-bold text-slate-700">
          ¿Necesitas exportar un reporte?{' '}
          <Link href="/dashboard/informes" className="text-blue-600 font-bold hover:text-blue-800 underline underline-offset-2 transition">
            Ir a Informes Ejecutivos →
          </Link>
        </p>
      </div>

      <FindingsFilters
        severity={filters.severity}
        status={filters.status}
        search={filters.search}
        service={filters.service}
        account={filters.account}
        region={filters.region}
        availableRegions={availableRegions}
        onChange={next => { filters.handleFiltersChange(next); setPage(1); }}
      />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">{error}</div>}

      <div className="bg-white border border-blue-300 p-4 sm:p-8 lg:p-10 rounded-3xl shadow-sm">
        {loading ? (
          <div className="text-center py-16 text-slate-500">Cargando findings...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No se encontraron findings con los filtros aplicados.</div>
        ) : (
          <FindingsTable findings={data} onResolve={handleResolve} onRowClick={setSelectedFinding} />
        )}

        {pages > 1 && !loading && (
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Pagina {page} de {pages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
              <button onClick={() => setPage(p => Math.min(p + 1, pages))} disabled={page === pages} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
            </div>
          </div>
        )}
      </div>

      {scanModal && <ScanModal />}
      {scanSuccess && <ScanSuccessModal onClose={closeScanSuccess} />}

      <FindingsDrawer finding={selectedFinding} onClose={() => setSelectedFinding(null)} onResolve={handleResolve} />
    </div>
  );
}
