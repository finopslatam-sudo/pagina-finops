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

  // Rightsizing findings carry specific backend messages (instance types, costs, savings).
  // Show them directly instead of replacing with a static string.
  const RIGHTSIZING_TYPES = new Set([
    "EC2_UNDERUTILIZED", "RDS_UNDERUTILIZED", "LAMBDA_MEMORY_RIGHTSIZING",
    "EBS_GP2_TO_GP3", "DYNAMODB_PROVISIONED_RIGHTSIZING",
    "CLOUDWATCH_STORAGE_RIGHTSIZING", "S3_STORAGE_RIGHTSIZING_REVIEW",
    "ECS_SERVICE_RIGHTSIZING_REVIEW", "ECS_FARGATE_RIGHTSIZING",
    "EKS_NODEGROUP_RIGHTSIZING_REVIEW", "NAT_IDLE_GATEWAY",
    "REDSHIFT_UNDERUTILIZED", "RIGHTSIZING_OPPORTUNITY",
  ]);

  const translateMessage = (msg?: string, findingType?: string) => {
    if (!msg) return "";

    // Rightsizing findings: show actual backend message (contains specific recommendations)
    if (findingType && RIGHTSIZING_TYPES.has(findingType)) return msg;

    // Static translations for governance / tag / state findings
    const mapByType: Record<string, string> = {
      STOPPED_INSTANCE: "La instancia EC2 está detenida.",
      MISSING_TAG_OWNER: "Falta la etiqueta obligatoria: Owner.",
      MISSING_TAG_ENVIRONMENT: "Falta la etiqueta obligatoria: Environment.",
      CLOUDWATCH_NO_RETENTION: "El grupo de logs no tiene retención configurada.",
      DYNAMODB_EMPTY_TABLE: "La tabla DynamoDB no tiene elementos.",
      UNATTACHED_VOLUME: "El volumen EBS no está adjunto a ninguna instancia.",
    };
    if (findingType && mapByType[findingType]) return mapByType[findingType];

    const lower = msg.toLowerCase();
    if (lower.includes("ec2 instance is stopped")) return mapByType.STOPPED_INSTANCE;
    if (lower.includes("missing required tag: owner")) return mapByType.MISSING_TAG_OWNER;
    if (lower.includes("missing required tag: environment")) return mapByType.MISSING_TAG_ENVIRONMENT;
    if (lower.includes("log group has unlimited retention")) return mapByType.CLOUDWATCH_NO_RETENTION;
    if (lower.includes("dynamodb table has zero items")) return mapByType.DYNAMODB_EMPTY_TABLE;
    if (lower.includes("volume not attached")) return mapByType.UNATTACHED_VOLUME;

    return msg;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="w-full sm:w-[400px] bg-white h-full shadow-xl p-6 overflow-y-auto">
        
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
            {translateMessage(finding.message, finding.finding_type)}
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
