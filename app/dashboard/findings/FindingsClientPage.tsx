'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useFindings } from "./hooks/useFindings";
import { useFindingsStats } from "./hooks/useFindingsStats";
import { useAuditStatus } from "../hooks/useAuditStatus";

import FindingsStatsCards from "./components/FindingsStatsCards";
import FindingsTable from "./components/FindingsTable";
import FindingsFilters from "./components/FindingsFilters";
import FindingsDrawer from "./components/FindingsDrawer";

import { Finding } from "./types";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { API_URL } from "@/app/lib/api";

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function FindingsPage() {

  /* ================= STATE ================= */

  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [account, setAccount] = useState<number | "">("");
  const [region, setRegion] = useState("");
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const [scanModal, setScanModal] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const { token, isAuthReady } = useAuth();
  const { fetchStatus } = useAuditStatus();
  const [runningAudit, setRunningAudit] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  /* ================= HOOKS ================= */

  const {
    data,
    pages,
    loading,
    error,
    resolveFinding,
    refetch,
  } = useFindings({
    page,
    severity,
    status,
    search,
    service,
    account,
    region,
  });

  const {
    stats,
    refetch: refetchStats,
  } = useFindingsStats({
    severity,
    status,
    search,
    service,
    account,
    region,
  });

  const searchParams = useSearchParams();

  const availableRegions: string[] = Array.from(
    new Set(
      data
        .map((f) => f.region?.trim().toLowerCase().slice(0,9))
        .filter((r): r is string => Boolean(r))
    )
  ).sort();

  /* =====================================================
     EFFECTS
  ===================================================== */

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setService(serviceParam);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {

    const loadLastScan = async () => {
  
      try {
  
        const res = await apiFetch("/api/client/dashboard/last-scan", {
          token
        });
  
        if (res.last_scan) {
          setLastScan(res.last_scan);
        }
  
      } catch (err) {
        console.error(err);
      }
  
    };
  
    loadLastScan();
  
  }, []);

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleFiltersChange = (filters: {
    severity?: string;
    status?: string;
    search?: string;
    service?: string;
    account?: number | "";
    region?: string;
  }) => {
    if (filters.severity !== undefined) setSeverity(filters.severity);
    if (filters.status !== undefined) setStatus(filters.status);
    if (filters.search !== undefined) setSearch(filters.search);
    if (filters.service !== undefined) setService(filters.service);
    if (filters.account !== undefined) {
      setAccount(filters.account);
    }
    if (filters.region !== undefined) setRegion(filters.region);  

    setPage(1);
  };

  const handleResolve = async (id: number) => {
    await resolveFinding(id);
    await refetch();
    await refetchStats();
    setSelectedFinding(null);
  };

  const handleRowClick = (finding: Finding) => {
    setSelectedFinding(finding);
  };

  const handleCloseDrawer = () => {
    setSelectedFinding(null);
  };

  const handleExport = async (format: "pdf" | "csv" | "xlsx") => {
    if (!isAuthReady || !token) {
      alert("Inicia sesión para exportar.");
      return;
    }
    const endpoint = `/api/client/reports/${format}`;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("No se pudo exportar el reporte");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `findings.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const runAudit = async () => {

    try {
  
      setRunningAudit(true);
      setScanModal(true);
  
      await apiFetch("/api/client/audit/run", {
        method: "POST",
        token
      });
  
      const pollAudit = async () => {
  
        const accounts = await fetchStatus();
  
        const stillRunning = accounts?.some(
          (a: any) => a.status === "running"
        );
  
        if (stillRunning) {
  
          setTimeout(pollAudit, 5000);
  
        } else {
  
          await refetch();
          await refetchStats();
  
          setScanModal(false);
          setScanSuccess(true);
  
          setLastScan(new Date().toISOString());
          setRunningAudit(false);
  
        }
  
      };
  
      setTimeout(pollAudit, 4000);
  
    } catch (err) {
  
      console.error(err);
  
      alert("Error ejecutando auditoría");
  
      setScanModal(false);
      setRunningAudit(false);
  
    }
  
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-14">

      {/* ================= HEADER ================= */}

      <div className="bg-slate-100 border border-blue-300 p-8 rounded-3xl shadow-sm flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-semibold text-slate-800">
            Findings & Optimization
          </h1>

          <p className="text-slate-600 mt-3">
          Detección y recomendaciones de optimización (rightsizing, tags, gobernanza y costos) en tu entorno cloud, incluyendo ahorro estimado y acciones sugeridas.
          </p>

        </div>

        <div className="flex flex-col items-end">

        <button
          onClick={runAudit}
          disabled={runningAudit}
          className={`px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2
          ${runningAudit
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
        {runningAudit && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}

        {runningAudit ? "Scanning..." : "Run Scan"}

        </button>

        {lastScan && (

        <p className="text-xs text-gray-500 mt-2">

        Last scan: {new Date(lastScan).toLocaleString()}

        </p>

        )}

        </div>
        </div>

      {/* ================= STATS ================= */}
      {stats && (
        <FindingsStatsCards stats={stats} />
      )}

      {/* ================= EXPORT ACTIONS ================= */}
      <div className="flex flex-wrap justify-end gap-3">
        <ExportCard label="Exportar PDF" onClick={() => handleExport("pdf")} color="bg-blue-600 text-white hover:bg-blue-700" disabled={!isAuthReady || !token} />
        <ExportCard label="Exportar CSV" onClick={() => handleExport("csv")} color="bg-emerald-600 text-white hover:bg-emerald-700" disabled={!isAuthReady || !token} />
        <ExportCard label="Exportar XLSX" onClick={() => handleExport("xlsx")} color="bg-indigo-600 text-white hover:bg-indigo-700" disabled={!isAuthReady || !token} />
      </div>

      {/* ================= FILTERS ================= */}
      <FindingsFilters
        severity={severity}
        status={status}
        search={search}
        service={service}
        account={account}
        region={region}
        availableRegions={availableRegions}
        onChange={handleFiltersChange}
      />

      {/* ================= ERROR STATE ================= */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
          {error}
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-blue-300 p-10 rounded-3xl shadow-sm">

        {loading ? (
          <div className="text-center py-16 text-slate-500">
            Cargando findings...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No se encontraron findings con los filtros aplicados.
          </div>
        ) : (
          <FindingsTable
            findings={data}
            onResolve={handleResolve}
            onRowClick={handleRowClick}
          />
        )}

        {/* ================= PAGINATION ================= */}
        {pages > 1 && !loading && (
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Pagina {page} de {pages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                disabled={page === pages}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ================= SCAN MODAL ================= */}

      {scanModal && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8 text-center space-y-6">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>

          <h2 className="text-lg font-semibold">
            Scanning AWS resources...
          </h2>

          <p className="text-gray-500 text-sm">
            FinOpsLatam está analizando tu infraestructura cloud.
            Este proceso puede tardar unos minutos.
          </p>

        </div>

      </div>

      )}

      {/* ================= SCAN SUCCESS ================= */}

      {scanSuccess && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8 text-center space-y-6">

          <div className="text-5xl">
            ✅
          </div>

          <h2 className="text-lg font-semibold">
            Scan completed successfully
          </h2>

          <p className="text-gray-500 text-sm">
            FinOpsLatam terminó de analizar tu infraestructura cloud.
            Los findings demoran entre 3 a 5 minutos en reflejarse la primera vez.
          </p>

          <button
            onClick={() => setScanSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Entendido
          </button>

        </div>

      </div>

      )}

      {/* ================= DRAWER ================= */}
      <FindingsDrawer
        finding={selectedFinding}
        onClose={handleCloseDrawer}
        onResolve={handleResolve}
      />

    </div>
  );
}

function ExportCard({
  label,
  onClick,
  color,
  disabled,
}: {
  label: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-xl shadow-sm font-semibold text-sm ${color} transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/5 disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
