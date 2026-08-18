'use client';

import { AzureAccount, ConnectionStatus as ConnectionStatusType } from "../hooks/useAzureConnection";

interface Props {
  status: ConnectionStatusType;
  accounts: AzureAccount[];
  accountLimit: number;
  accountLimitReached: boolean;
  loading: boolean;
  onRunAudit: () => void;
  onAddAccount: () => void;
  onDelete: (accountId: string) => void;
}

const STATUS_CONFIG: Record<ConnectionStatusType, { label: string; color: string; dot: string }> = {
  connected: { label: "Suscripción conectada", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  disconnected: { label: "Sin suscripción conectada", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export default function ConnectionStatus({
  status,
  accounts,
  accountLimit,
  accountLimitReached,
  loading,
  onRunAudit,
  onAddAccount,
  onDelete,
}: Props) {
  const current = STATUS_CONFIG[status];

  return (
    <>
      <div className={`p-6 rounded-2xl border ${current.color}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${current.dot}`} />
          <h3 className="text-lg font-semibold">
            {accounts.length} suscripción(es) Azure conectadas
          </h3>
        </div>

        <div className="text-sm mt-2 opacity-80">
          {accounts.length > 0
            ? `FinOpsLatam tiene acceso a ${accounts.length} suscripción(es) Azure para auditoría y análisis FinOps.`
            : "No existe ninguna suscripción Azure conectada a tu organización."}
        </div>

        {status === "connected" && (
          <div className="mt-4">
            <button
              onClick={onRunAudit}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Escaneando..." : "Ejecutar escaneo"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Suscripciones Azure conectadas</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {accounts.length} / {accountLimit}
            </span>
          </div>

          <button
            disabled={accountLimitReached}
            onClick={onAddAccount}
            className={`px-4 py-2 rounded-lg text-white w-full sm:w-auto ${
              accountLimitReached ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            + Conectar suscripción Azure
          </button>
        </div>

        {accountLimitReached && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <p className="text-sm text-amber-800 font-semibold">
              Has alcanzado el límite de suscripciones Azure de tu plan.
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard/ClientAdministration")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
            >
              Ver plan
            </button>
          </div>
        )}

        {accounts.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay suscripciones Azure conectadas todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-2">Subscription ID</th>
                  <th className="py-2">Nombre</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} className="border-b">
                    <td className="py-2 font-mono">{acc.subscription_id}</td>
                    <td className="py-2">{acc.subscription_name}</td>
                    <td className="py-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        Conectada
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => onDelete(acc.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Desconectar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
