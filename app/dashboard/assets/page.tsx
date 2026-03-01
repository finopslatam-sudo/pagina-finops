'use client';

import { useInventory } from '../hooks/useInventory';

export default function AssetsPage() {
  const { data, loading, error } = useInventory();

  if (loading) {
    return <div className="p-6 text-gray-400">Cargando inventario...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-bold">Assets</h1>
        <p className="text-gray-500 mt-2">
          Inventario completo de recursos detectados en tu entorno cloud.
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
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
                  className="rounded-2xl p-6 shadow-md border bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {service}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-blue-700">
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
                <th className="p-4 text-left">Tipo</th>
                <th className="p-4 text-left">Recurso</th>
                <th className="p-4 text-left">Región</th>
                <th className="p-4 text-left">Estado</th>
                <th className="p-4 text-left">Riesgo</th>
              </tr>
            </thead>

            <tbody>
              {data.resources.map((r) => (
                <tr key={r.resource_id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800">
                    {r.service_name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {r.resource_type}
                  </td>

                  <td className="p-4 font-mono text-xs text-gray-700">
                    {r.resource_id}
                  </td>

                  <td className="p-4">{r.region}</td>

                  <td className="p-4">{r.state}</td>

                  <td className="p-4">
                    {r.severity === 'HIGH' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        🔴 High ({r.findings_count})
                      </span>
                    )}

                    {r.severity === 'MEDIUM' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        🟡 Medium ({r.findings_count})
                      </span>
                    )}

                    {r.severity === 'LOW' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        🔵 Low ({r.findings_count})
                      </span>
                    )}

                    {!r.severity && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        🟢 Clean
                      </span>
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