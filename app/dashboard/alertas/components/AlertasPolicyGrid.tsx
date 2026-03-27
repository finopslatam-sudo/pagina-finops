import { POLICIES, STATUS_CONFIG, CATEGORIES } from '../policies';
import type { PolicyCard } from '../policies';

type Props = {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onConfigure: (policy: PolicyCard) => void;
};

export default function AlertasPolicyGrid({ activeCategory, onCategoryChange, onConfigure }: Props) {
  const filtered = activeCategory === 'Todas' ? POLICIES : POLICIES.filter(p => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              activeCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(policy => {
          const statusCfg = STATUS_CONFIG[policy.status];
          return (
            <div key={policy.id} className={`${policy.color} ${policy.borderColor} border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{policy.icon}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${policy.badgeColor}`}>{policy.category}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.color}`}>{statusCfg.label}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-base">{policy.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{policy.description}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Ejemplos de uso</p>
                <ul className="space-y-1">
                  {policy.examples.map((ex, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => onConfigure(policy)}
                className="mt-2 w-full py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition"
              >
                Configurar política
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
