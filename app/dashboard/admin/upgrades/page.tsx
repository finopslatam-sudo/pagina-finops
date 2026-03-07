'use client';

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminUpgradesPage() {

  const { token } = useAuth();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {

    if (!token) return;
  
    loadRequests();
  
  }, [token]);

  const loadRequests = async () => {

    try {

      const res = await apiFetch("/api/admin/upgrades", { token });

      setRequests(res?.data ?? []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const approve = async (id: number) => {

    try {

      setProcessingId(id);

      await apiFetch(`/api/admin/upgrades/${id}/approve`, {
        method: "POST",
        token
      });

      await loadRequests();

    } catch (err) {

      console.error(err);
      alert("Error aprobando solicitud");

    } finally {

      setProcessingId(null);

    }

  };

  const reject = async (id: number) => {

    try {

      setProcessingId(id);

      await apiFetch(`/api/admin/upgrades/${id}/reject`, {
        method: "POST",
        token
      });

      await loadRequests();

    } catch (err) {

      console.error(err);
      alert("Error rechazando solicitud");

    } finally {

      setProcessingId(null);

    }

  };

  if (loading) {
    return (
      <p className="p-6 text-gray-400">
        Cargando solicitudes...
      </p>
    );
  }

  return (

    <div className="p-6 space-y-6">

    {/* HEADER CARD */}

    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

    <h1 className="text-2xl font-bold text-blue-900">
        Plan Upgrade Requests
    </h1>

    <p className="text-blue-700 mt-2">
        Solicitudes de cambio de plan enviadas por clientes.
        Revisa el impacto antes de aprobar upgrades.
    </p>

    </div>

      {requests.length === 0 && (

        <div className="text-gray-500">
          No hay solicitudes pendientes.
        </div>

      )}

      {requests.length > 0 && (

        <div className="bg-white border rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

                <tr>

                <th className="p-4 text-left">Cliente ID</th>
                <th className="p-4 text-left">Empresa</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Plan actual</th>
                <th className="p-4 text-left">Plan solicitado</th>
                <th className="p-4 text-left">Fecha</th>
                <th className="p-4 text-left">Acción</th>

              </tr>

            </thead>

            <tbody>

              {requests.map((r) => (

                <tr
                  key={r.id}
                  className="border-b hover:bg-gray-50"
                >


                  <td className="p-4 font-semibold">
                    {r.client_id}
                    </td>

                    <td className="p-4">
                    {r.company_name || "-"}
                    </td>

                    <td className="p-4 text-gray-600">
                    {r.email || "-"}
                    </td>

                    <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {r.current_plan || "-"}
                    </span>
                    </td>

                    <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {r.requested_plan}
                    </span>
                    </td>

                    <td className="p-4 text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                    </td>

                  <td className="p-4 space-x-2">

                    <button
                      disabled={processingId === r.id}
                      onClick={() => approve(r.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      disabled={processingId === r.id}
                      onClick={() => reject(r.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}