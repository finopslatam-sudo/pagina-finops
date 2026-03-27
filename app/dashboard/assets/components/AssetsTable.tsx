type Resource = {
  resource_id:    string;
  service_name:   string;
  region:         string;
  severity:       'HIGH' | 'MEDIUM' | 'LOW' | null | undefined;
  findings_count: number;
  state?:         { label: string; category: string };
  resource_type:  string;
};

interface Props {
  paginatedResources:  Resource[];
  filteredResources:   Resource[];
  page:                number;
  setPage:             (p: number) => void;
  totalPages:          number;
}

function StateBadge({ state }: { state: Resource['state'] }) {
  if (!state) return null;
  const cls = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    waste:   'bg-red-100 text-red-700',
  }[state.category] ?? 'bg-gray-100 text-gray-600';
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{state.label}</span>;
}

function RiskBadge({ severity, findings_count }: Pick<Resource, 'severity' | 'findings_count'>) {
  const base = 'px-3 py-1 rounded-full text-xs font-semibold';
  if (severity === 'HIGH')   return <span className={`${base} bg-red-100 text-red-700`}>🔴 Alto ({findings_count})</span>;
  if (severity === 'MEDIUM') return <span className={`${base} bg-yellow-100 text-yellow-700`}>🟡 Medio ({findings_count})</span>;
  if (severity === 'LOW')    return <span className={`${base} bg-blue-100 text-blue-700`}>🔵 Bajo ({findings_count})</span>;
  return <span className={`${base} bg-green-100 text-green-700`}>🟢 Sin riesgos</span>;
}

export default function AssetsTable({ paginatedResources, filteredResources, page, setPage, totalPages }: Props) {
  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl">
      <h2 className="text-xl font-semibold mb-6">Recursos detectados</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">Servicio</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Recurso</th>
              <th className="p-4 text-left">Región</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-left">Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {paginatedResources.map(r => (
              <tr key={r.resource_id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-semibold">{r.service_name}</td>
                <td className="p-4 text-gray-600">{r.resource_type}</td>
                <td className="p-4 font-mono text-xs">{r.resource_id}</td>
                <td className="p-4">{r.region}</td>
                <td className="p-4"><StateBadge state={r.state} /></td>
                <td className="p-4"><RiskBadge severity={r.severity} findings_count={r.findings_count} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResources.length === 0 ? (
        <div className="py-10 text-center text-gray-400">No se encontraron recursos con los filtros aplicados.</div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-500">
            Mostrando {paginatedResources.length} de {filteredResources.length} recursos
          </p>
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >Anterior</button>
                <button
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >Siguiente</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
