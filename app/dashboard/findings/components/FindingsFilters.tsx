"use client";

interface Props {
  severity: string;
  status: string;
  search: string;
  onChange: (filters: {
    severity?: string;
    status?: string;
    search?: string;
  }) => void;
}

export default function FindingsFilters({
  severity,
  status,
  search,
  onChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-4">
      
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

      {/* Search */}
      <input
        type="text"
        placeholder="Search resource or message..."
        value={search}
        onChange={(e) => onChange({ search: e.target.value })}
        className="border p-2 rounded col-span-2"
      />
    </div>
  );
}
