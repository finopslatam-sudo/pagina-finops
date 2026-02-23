'use client';

import { useState, useEffect } from "react";

import { useFindings } from "./hooks/useFindings";
import { useFindingsStats } from "./hooks/useFindingsStats";
import { useInventory } from "@/app/dashboard/hooks/useInventory";

import FindingsStatsCards from "./components/FindingsStatsCards";
import FindingsTable from "./components/FindingsTable";
import FindingsFilters from "./components/FindingsFilters";
import FindingsDrawer from "./components/FindingsDrawer";
import { useSearchParams } from "next/navigation";
import { Finding } from "./types";


export default function FindingsPage() {

  // ---------------- STATE ----------------
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");

  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // ---------------- HOOKS ----------------
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

  const { data: inventoryData } = useInventory();

  

  // ---------------- HANDLERS ----------------

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

  const searchParams = useSearchParams();

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      setService(serviceParam);
    }
  }, [searchParams]);

  // ---------------- RENDER ----------------
  return (
    <div className="p-6 space-y-8">

      {/* ================= INVENTARIO ================= */}
      {inventoryData && (
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <h2 className="text-xl font-semibold">
            Inventario Completo
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Servicio</th>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Región</th>
                  <th className="p-4 text-left">Estado</th>
                  <th className="p-4 text-left">Findings</th>
                </tr>
              </thead>

              <tbody>
                {inventoryData.resources.map((r) => (
                  <tr key={r.resource_id} className="border-t">
                    <td className="p-4 font-medium">
                      {r.resource_type}
                    </td>
                    <td className="p-4">{r.resource_id}</td>
                    <td className="p-4">{r.region}</td>
                    <td className="p-4">{r.state}</td>
                    <td className="p-4">
                      {r.has_findings ? (
                        <span className="text-red-600 font-semibold">
                          {r.findings_count}
                        </span>
                      ) : (
                        <span className="text-green-600">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= STATS ================= */}
      {stats && <FindingsStatsCards stats={stats} />}

      {/* ================= FILTERS ================= */}
      <FindingsFilters
        severity={severity}
        status={status}
        search={search}
        service={service} 
        onChange={handleFiltersChange}
      />

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading findings...
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
        <div className="flex justify-center gap-2">
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

      {/* ================= DRAWER ================= */}
      <FindingsDrawer
        finding={selectedFinding}
        onClose={handleCloseDrawer}
        onResolve={handleResolve}
      />
    </div>
  );
}