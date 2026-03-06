'use client';

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminPlanUpgradesPage() {

  const { token } = useAuth();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {

    try {

      const res = await apiFetch("/api/admin/upgrades", { token });

      setRequests(res.data || []);

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
        Cargando solicitudes de upgrade...
      </p>
    );
  }

  return (

    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      <div>

        <h1 className="text-3xl font-bold">
          Plan Upgrade Requests
        </h1>

        <p className="text-gray-600 mt-2">
          Solicitudes de cambio de plan enviadas por clientes.
        </p>

      </div>

      {requests.length === 0 && (

        <div className="text-gray-500">
          No hay solicitudes pendientes.
        </div>

      )}

      {requests.length > 0 && (

        <div className="bg-white border rounded-xl overflow-hidden shadow">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left p-4">Client ID</th>
                <th className="text-left p-4">Requested Plan</th>
                <th className="text-left p-4">Requested By</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {requests.map((r) => (

                <tr
                  key={r.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {r.client_id}
                  </td>

                  <td className="p-4 font-semibold">
                    {r.requested_plan}
                  </td>

                  <td className="p-4">
                    {r.requested_by_user_id}
                  </td>

                  <td className="p-4">
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