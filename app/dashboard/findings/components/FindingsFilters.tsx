"use client";

interface Props {
  severity: string;
  status: string;
  search: string;
  service: string;

  onChange: (filters: {
    severity?: string;
    status?: string;
    search?: string;
    service?: string;
  }) => void;
}

export default function FindingsFilters({
  severity,
  status,
  search,
  service,
  onChange,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* Service */}
      <select
        value={service}
        onChange={(e) => onChange({ service: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">All Services</option>
        <option value="EC2">EC2</option>
        <option value="S3">S3</option>
        <option value="EBS">EBS</option>
        <option value="RDS">RDS</option>
        <option value="Lambda">Lambda</option>
      </select>

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
        className="border p-2 rounded"
      />
    </div>
  );
}