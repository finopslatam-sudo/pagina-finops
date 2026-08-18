'use client';

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  serviceAccountKey: string;
  loading: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onValidate: () => void;
}

const SETUP_SCRIPT = `# 1) Crear la Service Account de solo lectura para FinOpsLatam
gcloud iam service-accounts create finopslatam-readonly \\
  --display-name="FinOpsLatam Read-Only"

# 2) Dar acceso de solo lectura al proyecto (rol "Viewer")
gcloud projects add-iam-policy-binding <PROJECT_ID> \\
  --member="serviceAccount:finopslatam-readonly@<PROJECT_ID>.iam.gserviceaccount.com" \\
  --role="roles/viewer"

# 3) Generar y descargar la key JSON (guárdala, es la que se pega abajo)
gcloud iam service-accounts keys create finopslatam-key.json \\
  --iam-account=finopslatam-readonly@<PROJECT_ID>.iam.gserviceaccount.com`;

export default function ConnectionForm({ serviceAccountKey, loading, error, onChange, onValidate }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SETUP_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Setup script */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
        <h3 className="font-semibold text-red-900">1. Crea el acceso de solo lectura en GCP</h3>
        <p className="text-sm mt-2 text-red-700">
          Ejecuta este script en Cloud Shell (o en tu terminal con gcloud autenticado).
          Crea una Service Account dedicada, sin acceso de escritura, con el rol{" "}
          <span className="font-mono">Viewer</span> a nivel de proyecto.
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

      {/* JSON key form */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-lg">2. Pega el contenido del archivo JSON generado</h3>
        <p className="text-sm text-gray-600">
          Se guarda cifrado y solo se usa para leer inventario y costos de tu proyecto GCP.
        </p>

        <textarea
          placeholder='{"type": "service_account", "project_id": "...", ...}'
          value={serviceAccountKey}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="border rounded px-3 py-2 w-full font-mono text-xs"
        />

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
