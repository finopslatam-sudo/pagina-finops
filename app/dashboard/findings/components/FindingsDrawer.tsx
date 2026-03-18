"use client";

import { Finding } from "../types";
import SeverityBadge from "./SeverityBadge";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  finding: Finding | null;
  onClose: () => void;
  onResolve: (id: number) => void;
}

export default function FindingsDrawer({
  finding,
  onClose,
  onResolve,
}: Props) {

  // 🔥 EL HOOK VA AQUÍ DENTRO
  const { isFinopsAdmin } = useAuth();

  if (!finding) return null;

  const translateMessage = (msg?: string) => {
    if (!msg) return "";
    const lower = msg.toLowerCase();
    if (lower.includes("ec2 instance is stopped")) return "La instancia EC2 está detenida";
    if (lower.includes("missing required tag: owner")) return "Falta la etiqueta obligatoria: Owner";
    if (lower.includes("missing required tag: environment")) return "Falta la etiqueta obligatoria: Environment";
    if (lower.includes("log group has unlimited retention")) return "El grupo de logs no tiene retención configurada";
    return msg;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="w-[400px] bg-white h-full shadow-xl p-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Detalle del hallazgo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Severity */}
        <div className="mb-4">
          <SeverityBadge severity={finding.severity} />
        </div>

        {/* Core Info */}
        <div className="space-y-3 text-sm">
          <div>
            <strong>Tipo de hallazgo:</strong> {finding.finding_type}
          </div>
          <div>
            <strong>ID de recurso:</strong> {finding.resource_id}
          </div>
          <div>
            <strong>Tipo de recurso:</strong> {finding.resource_type}
          </div>
          <div>
            <strong>Ahorro estimado:</strong> $
            {finding.estimated_monthly_savings}
          </div>
          <div>
            <strong>Estado:</strong>{" "}
            {finding.resolved ? "Resuelto" : "Activo"}
          </div>
          <div>
            <strong>Detectado el:</strong> {finding.detected_at}
          </div>
          <div>
            <strong>Creado el:</strong> {finding.created_at}
          </div>
        </div>

        {/* Message */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Mensaje</h3>
          <p className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl shadow-sm">
            {translateMessage(finding.message)}
          </p>
        </div>

        {/* 🔥 Action - SOLO FINOPS ADMIN */}
        {isFinopsAdmin && !finding.resolved && (
          <button
            onClick={() => onResolve(finding.id)}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Marcar como resuelto
          </button>
        )}
      </div>
    </div>
  );
}
