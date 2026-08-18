'use client';

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { AzureFormState } from "../hooks/useAzureConnection";

interface Props {
  form: AzureFormState;
  loading: boolean;
  error: string | null;
  onChange: (form: AzureFormState) => void;
  onValidate: () => void;
}

const SETUP_SCRIPT = `# 1) Crear el App Registration de solo lectura para FinOpsLatam
az ad app create --display-name "FinOpsLatam-ReadOnly"

# 2) Crear el Service Principal asociado (usa el appId devuelto arriba)
az ad sp create --id <APP_ID>

# 3) Generar el Client Secret (guárdalo, no se puede recuperar después)
az ad app credential reset --id <APP_ID> --append

# 4) Dar acceso de solo lectura a la suscripción (rol "Reader")
az role assignment create \\
  --assignee <APP_ID> \\
  --role "Reader" \\
  --scope "/subscriptions/<SUBSCRIPTION_ID>"`;

const FIELDS: { key: keyof AzureFormState; label: string; placeholder: string }[] = [
  { key: "subscriptionId", label: "Subscription ID", placeholder: "00000000-0000-0000-0000-000000000000" },
  { key: "tenantId", label: "Tenant ID", placeholder: "00000000-0000-0000-0000-000000000000" },
  { key: "appClientId", label: "Application (client) ID", placeholder: "00000000-0000-0000-0000-000000000000" },
  { key: "clientSecret", label: "Client Secret", placeholder: "Valor del secreto generado" },
];

export default function ConnectionForm({ form, loading, error, onChange, onValidate }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Setup script */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <h3 className="font-semibold text-blue-900">1. Crea el acceso de solo lectura en Azure</h3>
        <p className="text-sm mt-2 text-blue-700">
          Ejecuta este script en Azure Cloud Shell (o en tu terminal con Azure CLI autenticado).
          Crea un App Registration dedicado, sin acceso de escritura, con el rol{" "}
          <span className="font-mono">Reader</span> a nivel de suscripción.
        </p>
        <div className="relative mt-4">
          <pre className="bg-gray-900 text-gray-100 text-xs sm:text-sm rounded-xl p-4 overflow-x-auto whitespace-pre">
            {SETUP_SCRIPT}
          </pre>
          <button
            onClick={handleCopyScript}
            className="absolute top-3 right-3 text-gray-300 hover:text-white transition"
            aria-label="Copiar script"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Credentials form */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-lg">2. Ingresa las credenciales generadas</h3>
        <p className="text-sm text-gray-600">
          Estos 4 valores se guardan cifrados y solo se usan para leer inventario y costos de tu suscripción.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {FIELDS.map((field) => (
            <div key={field.key} className={field.key === "clientSecret" ? "sm:col-span-2" : ""}>
              <label className="text-xs font-semibold text-gray-600 tracking-wide">
                {field.label.toUpperCase()}
              </label>
              <input
                type={field.key === "clientSecret" ? "password" : "text"}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => onChange({ ...form, [field.key]: e.target.value })}
                className="border rounded px-3 py-2 w-full mt-1 font-mono text-sm"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={onValidate}
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Validando..." : "Probar conexión"}
          </button>
        </div>
      </div>
    </div>
  );
}
