'use client';

import { ClientInfo } from "../types";

const POLICY_LABELS = {
  disabled: "Desactivado",
  optional: "Opcional por usuario",
  required: "Obligatorio para todos",
  required_for_admins: "Obligatorio para owners y admins",
} as const;

type Policy = keyof typeof POLICY_LABELS;

interface Props {
  client: ClientInfo | null;
  saving: boolean;
  onChangePolicy: (policy: Policy) => void;
}

export default function SecurityPolicyCard({
  client,
  saving,
  onChangePolicy,
}: Props) {
  const policy = (client?.mfa_policy || "disabled") as Policy;

  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Seguridad de acceso</h2>
        <p className="text-sm text-gray-600 mt-2">
          Elige si tu organización quiere activar autenticación multifactor para el inicio de sesión.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Política MFA
        </label>
        <select
          value={policy}
          onChange={(e) => onChangePolicy(e.target.value as Policy)}
          disabled={saving}
          className="w-full px-4 py-3 border rounded-xl bg-white"
        >
          {Object.entries(POLICY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border bg-blue-50 px-4 py-4 text-sm text-blue-900 space-y-2">
        <p>
          <strong>Actual:</strong> {POLICY_LABELS[policy]}
        </p>
        <p>
          <strong>Cómo funciona:</strong> con &quot;Opcional por usuario&quot;, cada miembro puede activarlo desde su perfil.
        </p>
        {client?.mfa_updated_at && (
          <p>
            <strong>Última actualización:</strong> {new Date(client.mfa_updated_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
