'use client';

import type { ProjectItem } from '../types';
import { SERVICE_LABELS } from '../types';

interface Props {
  items: ProjectItem[];
  onRemove: (id: string) => void;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function ItemList({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-sm">
          Recursos en el proyecto ({items.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Recurso</th>
              <th className="px-5 py-3 text-left">Servicio</th>
              <th className="px-5 py-3 text-right">Costo mensual</th>
              <th className="px-5 py-3 text-right">Costo anual</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const info = SERVICE_LABELS[item.config.type];
              return (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{item.name}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span>{info?.icon}</span>
                      <span>{info?.label}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-800 text-right">
                    {fmt(item.monthlyCost)}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 text-right">
                    {fmt(item.monthlyCost * 12)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 transition px-2 py-1 rounded hover:bg-rose-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
