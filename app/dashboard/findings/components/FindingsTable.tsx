"use client";

import { Finding } from "../types";
import SeverityBadge from "./SeverityBadge";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  findings: Finding[];
  onResolve: (id: number) => void;
  onRowClick?: (finding: Finding) => void;
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
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="text-left border-b bg-gray-50 text-sm">
            <th className="p-3">Service</th>
            <th className="p-3">Severity</th>
            <th className="p-3">Type</th>
            <th className="p-3">Resource</th>
            <th className="p-3">Savings</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {findings.map((f) => (
            <tr
              key={f.id}
              className="border-b hover:bg-gray-50 cursor-pointer transition"
              onClick={() => onRowClick?.(f)}
            >
              <td className="p-3 text-sm font-medium">
                {f.resource_type}
              </td>

              <td className="p-3">
                <SeverityBadge severity={f.severity} />
              </td>

              <td className="p-3 text-sm">
                {f.finding_type}
              </td>

              <td className="p-3 text-sm text-gray-600">
                {f.resource_id}
              </td>

              <td className="p-3 text-sm">
                ${f.estimated_monthly_savings}
              </td>

              <td className="p-3 text-sm">
                {f.resolved ? (
                  <span className="text-green-600 font-medium">
                    Resolved
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Active
                  </span>
                )}
              </td>

              <td className="p-3 text-sm">
                {isFinopsAdmin && !f.resolved ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve(f.id);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Mark as resolved
                  </button>
                ) : (
                  <span className="text-gray-400">🔍</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}