'use client';

import { Download, ExternalLink } from "lucide-react";
import { API_URL } from "@/app/lib/api";
import { AzureFormState } from "../hooks/useAzureConnection";

interface Props {
  form: AzureFormState;
  loading: boolean;
  error: string | null;
  onChange: (form: AzureFormState) => void;
  onValidate: () => void;
}

const TEMPLATE_URL = `${API_URL}/api/client/azure/template`;

const STEPS = [
  {
    title: 'Crea el App Registration',
    detail: 'portal.azure.com → busca "Registros de aplicaciones" → "Nuevo registro" → nombre "FinOpsLatam-Audit" → tipo de cuenta "Solo este directorio organizativo" → Registrar.',
  },
  {
    title: 'Copia el Tenant ID y el Application (client) ID',
    detail: 'En la página "Overview" del registro recién creado, copia "Id. de aplicación (cliente)" e "Id. de directorio (inquilino)".',
  },
  {
    title: 'Genera el Client Secret',
    detail: '"Certificados y secretos" → "Nuevo secreto de cliente" → copia el VALOR inmediatamente (no se vuelve a mostrar).',
  },
  {
    title: 'Copia el Object ID del Service Principal',
    detail: '"Aplicaciones empresariales" (Enterprise applications) → busca "FinOpsLatam-Audit" → copia su "Id. de objeto". Ojo: es distinto al Id. de objeto del App registration del paso 1.',
  },
  {
    title: 'Da acceso de solo lectura (rol Reader) con la plantilla ARM',
    detail: 'Descarga la plantilla JSON de abajo → en el portal busca "Implementar una plantilla personalizada" → "Generar plantilla en el editor" → pega el JSON → ámbito "Suscripción" → pega el Object ID del paso 4 como parámetro "principalId" → Revisar y crear.',
  },
];

const FIELDS: { key: keyof AzureFormState; label: string; placeholder: string }[] = [
  { key: "subscriptionId", label: "Subscription ID", placeholder: "00000000-0000-0000-0000-000000000000" },
  { key: "tenantId", label: "Tenant ID", placeholder: "00000000-0000-0000-0000-000000000000" },
  { key: "appClientId", label: "Application (client) ID", placeholder: "00000000-0000-0000-0000-000000000000" },
  { key: "clientSecret", label: "Client Secret", placeholder: "Valor del secreto generado" },
];

export default function ConnectionForm({ form, loading, error, onChange, onValidate }: Props) {
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = TEMPLATE_URL;
    link.download = "finopslatam_role_assignment.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Setup steps — sin CLI, todo por el portal de Azure */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <h3 className="font-semibold text-blue-900">1. Crea el acceso de solo lectura en Azure</h3>
        <p className="text-sm mt-2 text-blue-700">
          Todo se hace desde el portal de Azure con clics — no necesitas terminal ni Azure CLI.
        </p>

        <ol className="mt-4 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-blue-900">{step.title}</p>
                <p className="text-xs text-blue-700 mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            <Download size={16} /> Descargar plantilla ARM (JSON)
          </button>
          <a
            href="https://portal.azure.com/#create/Microsoft.Template"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white border border-blue-300 text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition"
          >
            <ExternalLink size={16} /> Abrir "Implementar plantilla personalizada"
          </a>
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
