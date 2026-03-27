import { CHANNEL_LABELS, PERIOD_LABELS } from '../constants';
import type { HistoryEntry } from '../types';

type Props = {
  history: HistoryEntry[];
  onEdit: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
};

export default function AlertasHistoryTable({ history, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Historial de políticas creadas</h2>
          <p className="text-sm text-slate-500">Vista tabular para revisar y gestionar las políticas.</p>
        </div>
        <span className="text-xs text-slate-500">{history.length} en total</span>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-slate-500">Aún no has guardado ninguna política.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-left">
                {['Política', 'Cuenta', 'Canal', 'Destino', 'Periodicidad', 'Umbral', 'Creada', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 last:text-right">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.dbId || `${item.policyId}-${item.createdAt || item.title}`} className="border-t border-slate-200 align-top hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.policyId}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{item.account}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {CHANNEL_LABELS[item.channel]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700 break-all">{item.destination}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {item.period ? PERIOD_LABELS[item.period] || item.period : 'No definida'}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-800">{item.threshold} {item.thresholdType}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('es-CL') : 'Persistida'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(item)} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50">
                        Editar
                      </button>
                      <button onClick={() => onDelete(item)} className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-50">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
