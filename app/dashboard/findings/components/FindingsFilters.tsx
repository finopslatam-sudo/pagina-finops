"use client";

import { useFindingServices } from "../hooks/useFindingServices";

interface Props {
  severity: string;
  status: string;
  search: string;
  service: string;
  account: string;
  region: string;

  onChange: (filters: {
    severity?: string;
    status?: string;
    search?: string;
    service?: string;
    account?: string;
    region?: string;
  }) => void;
}

export default function FindingsFilters({
  severity,
  status,
  search,
  service,
  account,
  region,
  onChange,
}: Props) {

  const services = useFindingServices();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">

      {/* Service */}
      <select
        value={service}
        onChange={(e) => onChange({ service: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">All Services</option>

        {services.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}

      </select>

      {/* Account */}
      <input
        type="text"
        placeholder="Account name..."
        value={account}
        onChange={(e) => onChange({ account: e.target.value })}
        className="border p-2 rounded"
      />

      {/* Severity */}
      <select
        value={severity}
        onChange={(e) => onChange({ severity: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">All Severities</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => onChange({ status: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="resolved">Resolved</option>
      </select>

      {/* Region */}
      <input
        type="text"
        placeholder="Region (ex: us-east-1)"
        value={region}
        onChange={(e) => onChange({ region: e.target.value })}
        className="border p-2 rounded"
      />

      {/* Search */}
      <input
        type="text"
        placeholder="Search resource or message..."
        value={search}
        onChange={(e) => onChange({ search: e.target.value })}
        className="border p-2 rounded"
      />

    </div>
  );
}