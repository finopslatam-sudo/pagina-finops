"use client";

import { Finding } from "../types";
import { useAuth } from "@/app/context/AuthContext";
import ProviderBadge from "../../components/ProviderBadge";
import RESOLUTION from "../resolutionMap";

interface Props {
  findings: Finding[];
  onResolve: (id: number) => void;
  onRowClick?: (finding: Finding) => void;
}

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
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] bg-white shadow rounded-xl text-sm table-fixed">
        <colgroup>
          <col className="w-[6%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[12%]" />
          <col className="w-[10%]" />
          <col className="w-[7%]" />
          <col className="w-[6%]" />
          <col className="w-[6%]" />
          <col className="w-[16%]" />
          <col className="w-[19%]" />
        </colgroup>
        <thead>
          <tr className="text-left border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">Provider</th>
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
              <td className="px-4 py-3">
                <ProviderBadge provider={f.provider} />
              </td>

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
