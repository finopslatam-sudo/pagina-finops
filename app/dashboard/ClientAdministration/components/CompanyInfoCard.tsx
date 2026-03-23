'use client';

import { ClientInfo } from "../types";

interface Props {
  client: ClientInfo | null;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export default function CompanyInfoCard({ client }: Props) {
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      <h2 className="text-xl font-semibold">Información de la organización</h2>
      <Info label="Empresa" value={client?.company_name || "—"} />
      <Info label="Email" value={client?.email || "—"} />
      <Info label="Contacto" value={client?.contact_name || "—"} />
      <Info label="Teléfono" value={client?.phone || "—"} />
    </div>
  );
}
