import type { Filters } from '../hooks/useAssetsFilters';

interface Props {
  filters:        Filters;
  setFilters:     (f: Filters) => void;
  uniqueServices: string[];
  uniqueRegions:  string[];
  uniqueStates:   string[];
}

const SEVERITY_OPTIONS: Filters['severity'][] = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

export default function AssetsFilters({
  filters, setFilters, uniqueServices, uniqueRegions, uniqueStates,
}: Props) {
  const set = (key: keyof Filters) => (value: string) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <FilterSelect label="Servicio" value={filters.service}   options={['ALL', ...uniqueServices]} onChange={set('service')} />
        <FilterSelect label="Región"   value={filters.region}    options={['ALL', ...uniqueRegions]}  onChange={set('region')} />
        <FilterSelect label="Estado"   value={filters.state}     options={['ALL', ...uniqueStates]}   onChange={set('state')} />
        <FilterSelect label="Riesgo"   value={filters.severity}  options={SEVERITY_OPTIONS}           onChange={set('severity')} />
        <div className="flex flex-col text-sm w-full">
          <label className="text-gray-500 mb-1">Buscar recurso</label>
          <input
            type="text" placeholder="Search resource..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col text-sm w-full">
      <label className="text-gray-500 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full border rounded px-3 py-2">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
