'use client';

import { AwsAccount, ConnectionStatus as ConnectionStatusType } from "../hooks/useAwsConnection";

interface Props {
  status: ConnectionStatusType;
  accounts: AwsAccount[];
  accountLimit: number;
  accountLimitReached: boolean;
  loading: boolean;
  onRunAudit: () => void;
  onAddAccount: () => void;
}

const STATUS_CONFIG: Record<ConnectionStatusType, {
  label: string;
  color: string;
  dot: string;
}> = {
  connected: {
    label: "Cuenta conectada",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Conexión pendiente",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  disconnected: {
    label: "Cuenta no conectada",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
};

export default function ConnectionStatus({
  status,
  accounts,
  accountLimit,
  accountLimitReached,
  loading,
  onRunAudit,
  onAddAccount,
}: Props) {
  const current = STATUS_CONFIG[status];

  return (
    <>
      {/* Status banner */}
      <div className={`p-6 rounded-2xl border ${current.color}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${current.dot}`} />
          <h3 className="text-lg font-semibold">
            {status === "pending"
              ? "Conexión en progreso"
              : `${accounts.length} cuenta(s) AWS conectadas`}
          </h3>
        </div>

        <div className="text-sm mt-2 opacity-80">
          {accounts.length > 0 &&
            `FinOpsLatam tiene acceso a ${accounts.length} cuenta(s) AWS para auditoría y análisis FinOps.`}
          {status === "pending" &&
            "Completa el despliegue de CloudFormation para finalizar la conexión."}
          {status === "disconnected" &&
            "No existe una cuenta AWS conectada a tu organización."}
        </div>

        {status === "connected" && (
          <div className="mt-4">
            <button
              onClick={onRunAudit}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? "Running audit..." : "Run Audit Scan"}
            </button>
          </div>
        )}
      </div>

      {/* Accounts table card */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Cuentas AWS conectadas</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {accounts.length} / {accountLimit}
            </span>
          </div>

          {accountLimitReached && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between mb-4">
              <div className="text-sm text-amber-800">
                <p className="font-semibold">
                  Has alcanzado el límite de cuentas AWS de tu plan.
                </p>
                <p>Actualiza tu suscripción para agregar más usuarios y cuentas AWS.</p>
              </div>
              <button
                onClick={() => (window.location.href = "/dashboard/ClientAdministration")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Upgrade Plan
              </button>
            </div>
          )}

          <button
            disabled={accountLimitReached}
            onClick={onAddAccount}
            className={`px-4 py-2 rounded-lg text-white ${
              accountLimitReached
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            + Add AWS Account
          </button>
        </div>

        {accounts.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay cuentas AWS conectadas todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-2">Account ID</th>
                  <th className="py-2">Nombre</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} className="border-b">
                    <td className="py-2 font-mono">{acc.account_id}</td>
                    <td className="py-2">{acc.account_name}</td>
                    <td className="py-2">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                        Conectada
                      </span>
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
