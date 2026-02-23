'use client';

import { useInventory } from '../hooks/useInventory';

export default function InventoryPage() {
  const { data, loading, error } = useInventory();

  if (loading) return <p>Cargando inventario...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        Inventario Completo
      </h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
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
                <td className="p-4">{r.resource_type}</td>
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
  );
}