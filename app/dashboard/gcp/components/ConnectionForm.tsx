'use client';

import { Download, ExternalLink } from "lucide-react";
import { API_URL } from "@/app/lib/api";

interface Props {
  serviceAccountKey: string;
  loading: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onValidate: () => void;
}

const TEMPLATE_URL = `${API_URL}/api/client/gcp/template`;

const STEPS = [
  {
    title: 'Abre Deployment Manager en tu proyecto',
    detail: 'console.cloud.google.com/dm → verifica que el proyecto activo (arriba) sea el que quieres conectar → "Crear implementación".',
  },
  {
    title: 'Pega la plantilla YAML',
    detail: 'Descarga el archivo de abajo, pega su contenido en el editor de "Crear implementación" (reemplaza el ejemplo que trae por defecto) y presiona "Implementar". Esto crea la Service Account y le da el rol Viewer del proyecto automáticamente.',
  },
  {
    title: 'Genera la key JSON de la Service Account',
    detail: 'IAM y administración → Cuentas de servicio → busca "finopslatam-audit" → pestaña "Claves" → "Agregar clave" → "Crear clave nueva" → tipo JSON → se descarga el archivo.',
  },
  {
    title: 'Pega el contenido del JSON abajo',
    detail: 'Abre el archivo descargado con un editor de texto y pega todo su contenido en el campo de abajo.',
  },
];

export default function ConnectionForm({ serviceAccountKey, loading, error, onChange, onValidate }: Props) {
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = TEMPLATE_URL;
    link.download = "finopslatam_role.yaml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Setup steps — sin CLI, todo por Cloud Console */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
        <h3 className="font-semibold text-red-900">1. Crea el acceso de solo lectura en GCP</h3>
        <p className="text-sm mt-2 text-red-700">
          Todo se hace desde Cloud Console con clics — no necesitas terminal ni gcloud CLI.
        </p>

        <ol className="mt-4 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-red-900">{step.title}</p>
                <p className="text-xs text-red-700 mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            <Download size={16} /> Descargar plantilla (YAML)
          </button>
          <a
            href="https://console.cloud.google.com/dm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white border border-red-300 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition"
          >
            <ExternalLink size={16} /> Abrir Deployment Manager
          </a>
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
