'use client';

import { useState } from 'react';
import { AZURE_SQL_TIERS, calcAzureSQL } from '../../azure-pricing';
import type { AzureSQLConfig } from '../../azure-types';

interface Props { onAdd: (name: string, data: AzureSQLConfig) => void; }

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function SQLForm({ onAdd }: Props) {
  const [name, setName] = useState('Azure SQL Database');
  const [tier, setTier] = useState('GP_Gen5_2');
  const [qty, setQty] = useState(1);
  const [storageGB, setStorageGB] = useState(100);

  const cfg: AzureSQLConfig = { tier, quantity: qty, storageGB };
  const monthly = calcAzureSQL(cfg);
  const tierInfo = AZURE_SQL_TIERS[tier];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tier (General Purpose)</label>
          <select
            value={tier} onChange={e => setTier(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {Object.entries(AZURE_SQL_TIERS).map(([k, v]) => (
              <option key={k} value={k}>{k} — {v.vcpu} vCore · {fmt(v.price)}/hr</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cantidad de bases</label>
          <input
            type="number" min={1} max={100} value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Almacenamiento (GB)</label>
          <input
            type="number" min={1} value={storageGB}
            onChange={e => setStorageGB(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {tierInfo && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-center text-sm">
          <div>
            <p className="text-xs text-indigo-500 font-semibold">Precio/hora</p>
            <p className="font-bold text-indigo-700 mt-0.5">{fmt(tierInfo.price)}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-500 font-semibold">vCore</p>
            <p className="font-bold text-indigo-700 mt-0.5">{tierInfo.vcpu}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500">Costo mensual estimado</p>
          <p className="text-2xl font-bold text-slate-800">{fmtM(monthly)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Anual: {fmtM(monthly * 12)}</p>
        </div>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), cfg); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
