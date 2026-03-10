'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useFindings } from "./hooks/useFindings";
import { useFindingsStats } from "./hooks/useFindingsStats";

import FindingsStatsCards from "./components/FindingsStatsCards";
import FindingsTable from "./components/FindingsTable";
import FindingsFilters from "./components/FindingsFilters";
import FindingsDrawer from "./components/FindingsDrawer";

import { Finding } from "./types";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

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
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const [scanModal, setScanModal] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const { token } = useAuth();
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
  });

  const {
    stats,
    refetch: refetchStats,
  } = useFindingsStats();

  const searchParams = useSearchParams();

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
  }) => {
    if (filters.severity !== undefined) setSeverity(filters.severity);
    if (filters.status !== undefined) setStatus(filters.status);
    if (filters.search !== undefined) setSearch(filters.search);
    if (filters.service !== undefined) setService(filters.service);

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

  const runAudit = async () => {

    try {
  
      setRunningAudit(true);
      setScanModal(true);
  
      await apiFetch("/api/client/audit/run", {
        method: "POST",
        token
      });
  
      // Esperar procesamiento del backend
      setTimeout(async () => {
  
        await refetch();
        await refetchStats();
  
        setScanModal(false);
  
        setScanSuccess(true);
  
        setLastScan(new Date().toISOString());
  
      }, 7000);
  
    } catch (err) {
  
      console.error(err);
      alert("Error ejecutando auditoría");
  
      setScanModal(false);
  
    } finally {
  
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
            Risk & Findings
          </h1>

          <p className="text-slate-600 mt-3">
            Hallazgos de riesgo detectados en tu entorno cloud y oportunidades de optimización.
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

      {/* ================= FILTERS ================= */}
      <FindingsFilters
        severity={severity}
        status={status}
        search={search}
        service={service}
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
          <div className="flex justify-center gap-3 mt-10">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition
                  ${
                    page === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-blue-200 hover:bg-blue-50"
                  }`}
              >
                {i + 1}
              </button>
            ))}
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
            Este proceso puede tardar unos segundos.
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
            Los findings han sido actualizados.
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