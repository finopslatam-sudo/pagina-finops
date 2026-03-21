"use client";

import { Finding } from "../types";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  findings: Finding[];
  onResolve: (id: number) => void;
  onRowClick?: (finding: Finding) => void;
}

const RESOLUTION: Record<string, string> = {
  EBS_GP2_TO_GP3:
    "Migrar volumen EBS de GP2 a GP3. Sin downtime: modificar el volumen desde la consola EC2 o con AWS CLI (modify-volume).",
  EC2_UNDERUTILIZED:
    "Aplicar rightsizing: reducir el tipo de instancia o apagarla si no está en uso activo.",
  STOPPED_INSTANCE:
    "Verificar si la instancia puede eliminarse. Si es temporal, crear AMI y terminarla para detener el cobro del volumen EBS.",
  UNATTACHED_VOLUME:
    "Crear snapshot del volumen como respaldo y luego eliminarlo. Los volúmenes desconectados siguen generando costo.",
  CLOUDWATCH_NO_RETENTION:
    "Configurar política de retención en el Log Group (ej. 30 o 90 días) desde CloudWatch > Log Groups > Actions.",
  CLOUDWATCH_HIGH_RETENTION:
    "Reducir el período de retención del Log Group. Evaluar si se necesitan más de 90 días o mover logs a S3 Glacier.",
  CLOUDWATCH_STORAGE_RIGHTSIZING:
    "Revisar los Log Groups con mayor volumen y reducir retención o filtrar qué métricas/logs se envían.",
  LAMBDA_HIGH_MEMORY:
    "Reducir la memoria asignada a la función Lambda. Usar AWS Lambda Power Tuning para encontrar la configuración óptima.",
  LAMBDA_MEMORY_RIGHTSIZING:
    "Ajustar la memoria de la función Lambda al valor óptimo usando la herramienta Lambda Power Tuning.",
  LAMBDA_DEPRECATED_RUNTIME:
    "Actualizar el runtime de la función Lambda a una versión soportada para evitar fin de soporte y posibles vulnerabilidades.",
  RDS_UNDERUTILIZED:
    "Escalar hacia abajo la instancia RDS (instance type) o considerar Aurora Serverless si el uso es intermitente.",
  RDS_GP2_STORAGE:
    "Migrar el almacenamiento RDS de GP2 a GP3 para reducir costo y mejorar IOPS base sin cargo adicional.",
  RDS_MULTI_AZ_DISABLED:
    "Habilitar Multi-AZ en RDS para alta disponibilidad. Si solo es desarrollo, no es necesario.",
  RDS_NOT_ENCRYPTED:
    "Crear un snapshot de la instancia y restaurarla con cifrado habilitado. No se puede cifrar una instancia existente directamente.",
  RDS_NO_BACKUP_RETENTION:
    "Configurar el período de retención de backups automáticos a mínimo 7 días en la configuración de la instancia RDS.",
  RDS_PUBLIC_ACCESS:
    "Desactivar 'Publicly Accessible' en la instancia RDS y acceder a través de VPC o bastion host.",
  DYNAMODB_EMPTY_TABLE:
    "Eliminar la tabla DynamoDB si ya no es necesaria. Si tiene datos archivados, exportarla a S3 antes de borrar.",
  DYNAMODB_PROVISIONED_MODE:
    "Cambiar de Provisioned a On-Demand si el tráfico es impredecible, o ajustar las unidades de capacidad provisionadas.",
  DYNAMODB_PROVISIONED_RIGHTSIZING:
    "Revisar las Read/Write Capacity Units y ajustarlas a los valores reales de consumo para evitar capacidad ociosa.",
  NAT_IDLE_GATEWAY:
    "Eliminar el NAT Gateway si no hay tráfico activo. Verificar que no haya rutas apuntando a él antes de eliminarlo.",
  S3_STORAGE_RIGHTSIZING_REVIEW:
    "Aplicar S3 Intelligent-Tiering o políticas de ciclo de vida para mover objetos fríos a clases de almacenamiento más baratas.",
  EC2_RI:
    "Adquirir Reserved Instances de 1 año para las instancias con uso sostenido. Puede reducir el costo hasta un 40%.",
  RI_UNUSED:
    "Vender las Reserved Instances no utilizadas en el AWS Marketplace o reasignarlas a otras instancias compatibles.",
  LOW_RI_COVERAGE:
    "Aumentar la cobertura de Reserved Instances para los tipos de instancia con mayor uso sostenido.",
  SP_REVIEW:
    "Evaluar la compra de Savings Plans (Compute o EC2) para los workloads con uso predecible y sostenido.",
  ECS_SERVICE_RIGHTSIZING_REVIEW:
    "Revisar los límites de CPU y memoria de las tareas ECS. Reducir las reservas sobredimensionadas.",
  EKS_NODEGROUP_RIGHTSIZING_REVIEW:
    "Ajustar el tipo de instancia y el tamaño del Node Group de EKS según el uso real de los pods.",
  REDSHIFT_UNDERUTILIZED:
    "Pausar el clúster Redshift cuando no esté en uso o migrar a Redshift Serverless para pago por consulta.",
  RIGHTSIZING_OPPORTUNITY:
    "Analizar el uso real del recurso y migrar a un tipo o tamaño inferior que cubra la carga de trabajo.",
};

function getResolution(findingType: string): string {
  return (
    RESOLUTION[findingType] ??
    "Revisar el recurso en la consola AWS y evaluar si puede ser optimizado o eliminado."
  );
}

export default function FindingsTable({
  findings,
  onResolve,
  onRowClick,
}: Props) {
  const { isFinopsAdmin } = useAuth();

  if (!findings.length) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No findings found.
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full bg-white shadow rounded-xl text-sm table-fixed">
        <colgroup>
          <col className="w-[7%]" />
          <col className="w-[10%]" />
          <col className="w-[13%]" />
          <col className="w-[11%]" />
          <col className="w-[8%]" />
          <col className="w-[7%]" />
          <col className="w-[7%]" />
          <col className="w-[18%]" />
          <col className="w-[19%]" />
        </colgroup>
        <thead>
          <tr className="text-left border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Resource</th>
            <th className="px-4 py-3">Region</th>
            <th className="px-4 py-3">Savings</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Finding</th>
            <th className="px-4 py-3">How to Fix</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {findings.map((f) => (
            <tr
              key={f.id}
              className="hover:bg-gray-50 cursor-pointer transition align-top"
              onClick={() => onRowClick?.(f)}
            >
              <td className="px-4 py-3 font-medium text-gray-800 truncate">
                {f.aws_service}
              </td>

              <td className="px-4 py-3 text-gray-600 truncate">
                {f.aws_account_name}
              </td>

              <td className="px-4 py-3 text-gray-700 truncate" title={f.finding_type}>
                {f.finding_type}
              </td>

              <td className="px-4 py-3 text-gray-500 truncate" title={f.resource_id}>
                {f.resource_id}
              </td>

              <td className="px-4 py-3 text-gray-600 truncate">
                {f.region || "—"}
              </td>

              <td className="px-4 py-3 text-gray-800 whitespace-nowrap">
                USD ${f.estimated_monthly_savings}
              </td>

              <td className="px-4 py-3">
                {f.resolved ? (
                  <span className="text-green-600 font-medium">Resolved</span>
                ) : (
                  <span className="text-red-500 font-medium">Active</span>
                )}
              </td>

              <td className="px-4 py-3 text-gray-600">
                <p className="text-xs leading-relaxed line-clamp-3" title={f.message}>
                  {f.message || "—"}
                </p>
              </td>

              <td className="px-4 py-3">
                <p className="text-xs leading-relaxed text-gray-600">
                  {getResolution(f.finding_type)}
                </p>
                {isFinopsAdmin && !f.resolved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve(f.id);
                    }}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Mark as resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
