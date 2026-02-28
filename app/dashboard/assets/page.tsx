'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useInventory } from '../hooks/useInventory';

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function AssetsPage() {
  const { data, loading, error } = useInventory();

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Cargando inventario...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">
          Assets
        </h1>
        <p className="text-gray-500 mt-2">
          Inventario completo de recursos detectados en tu entorno cloud.
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      {data.summary && (
        <div className="bg-white p-8 rounded-3xl border shadow-xl">
          <h2 className="text-xl font-semibold mb-6">
            Resumen por servicio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(data.summary)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => (
                <div
                  key={service}
                  className="bg-gray-50 border rounded-2xl p-6 shadow-sm"
                >
                  <p className="text-sm uppercase tracking-wide text-gray-500">
                    {service}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {count}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Recursos detectados
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
              {data.resources.map((r) => (
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

    </div>
  );
}