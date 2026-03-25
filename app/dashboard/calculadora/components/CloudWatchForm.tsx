'use client';

import { useState } from 'react';
import { calcCloudWatch } from '../pricing';
import type { CloudWatchConfig } from '../types';

interface Props { onAdd: (name: string, data: CloudWatchConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function CloudWatchForm({ onAdd }: Props) {
  const [name,    setName]    = useState('CloudWatch Logs');
  const [ingest,  setIngest]  = useState(10);
  const [storage, setStorage] = useState(50);

  const cfg: CloudWatchConfig = { ingestGB: ingest, storageGB: storage };
  const monthly = calcCloudWatch(cfg);
  const ingestCost  = ingest * 0.50;
  const storageCost = storage * 0.03;

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Logs ingestados/mes (GB)</label>
          <input
            type="number" min={0} value={ingest}
            onChange={e => setIngest(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <p className="text-xs text-slate-400 mt-1">$0.50/GB ingestado</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Logs almacenados (GB)</label>
          <input
            type="number" min={0} value={storage}
            onChange={e => setStorage(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <p className="text-xs text-slate-400 mt-1">$0.03/GB almacenado</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-center text-sm">
        <div>
          <p className="text-xs text-purple-600 font-semibold">Costo ingestión</p>
          <p className="font-bold text-purple-700 mt-0.5">{fmtM(ingestCost)}</p>
        </div>
        <div>
          <p className="text-xs text-purple-600 font-semibold">Costo almacenamiento</p>
          <p className="font-bold text-purple-700 mt-0.5">{fmtM(storageCost)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500">Costo mensual estimado</p>
          <p className="text-2xl font-bold text-slate-800">{fmtM(monthly)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Anual: {fmtM(monthly * 12)}</p>
        </div>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), cfg); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
