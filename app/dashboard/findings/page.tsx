"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

import { useFindings } from "./hooks/useFindings";
import { useFindingsStats } from "./hooks/useFindingsStats";

import FindingsStatsCards from "./components/FindingsStatsCards";
import FindingsTable from "./components/FindingsTable";
import FindingsFilters from "./components/FindingsFilters";
import FindingsDrawer from "./components/FindingsDrawer";

import { Finding } from "./types";

export default function FindingsPage() {
  // ---------------- AUTH ----------------
  const { isClientUser } = useAuth();

  // ---------------- STATE ----------------
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

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
  });

  const {
    stats,
    refetch: refetchStats,
  } = useFindingsStats();

  // ---------------- PROTECTION ----------------
  if (!isClientUser) {
    return (
      <div className="p-6 text-center text-red-500">
        Unauthorized
      </div>
    );
  }

  // ---------------- HANDLERS ----------------

  const handleFiltersChange = (filters: {
    severity?: string;
    status?: string;
    search?: string;
  }) => {
    if (filters.severity !== undefined) setSeverity(filters.severity);
    if (filters.status !== undefined) setStatus(filters.status);
    if (filters.search !== undefined) setSearch(filters.search);

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

  // ---------------- RENDER ----------------
  return (
    <div className="p-6 space-y-6">

      {/* Stats */}
      {stats && <FindingsStatsCards stats={stats} />}

      {/* Filters */}
      <FindingsFilters
        severity={severity}
        status={status}
        search={search}
        onChange={handleFiltersChange}
      />

      {/* Table */}
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

      {/* Pagination */}
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

      {/* Drawer */}
      <FindingsDrawer
        finding={selectedFinding}
        onClose={handleCloseDrawer}
        onResolve={handleResolve}
      />
    </div>
  );
}
