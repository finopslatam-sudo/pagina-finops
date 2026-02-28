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

  /* ================= HOOKS ================= */

  const {
    data,
    pages,
    loading,
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
    }
  }, [searchParams]);

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

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          Risk & Findings
        </h1>
        <p className="text-gray-500 mt-2">
          Hallazgos de riesgo detectados en tu entorno cloud y oportunidades de optimización.
        </p>
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

      {/* ================= TABLE ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Cargando findings...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
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
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* ================= DRAWER ================= */}
      <FindingsDrawer
        finding={selectedFinding}
        onClose={handleCloseDrawer}
        onResolve={handleResolve}
      />

    </div>
  );
}