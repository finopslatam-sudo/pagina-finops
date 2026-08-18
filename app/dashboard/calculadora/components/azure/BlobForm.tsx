'use client';

import { useState } from 'react';
import { AZURE_BLOB_TIERS, calcAzureBlob } from '../../azure-pricing';
import type { AzureBlobConfig } from '../../azure-types';

interface Props { onAdd: (name: string, data: AzureBlobConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function BlobForm({ onAdd }: Props) {
  const [name, setName] = useState('Blob Container');
  const [tier, setTier] = useState<AzureBlobConfig['tier']>('hot');
  const [storageGB, setStorageGB] = useState(500);
  const [writeK, setWriteK] = useState(100);
  const [readK, setReadK] = useState(500);

  const cfg: AzureBlobConfig = { storageGB, tier, writeOperationsK: writeK, readOperationsK: readK };
  const monthly = calcAzureBlob(cfg);
  const tierInfo = AZURE_BLOB_TIERS[tier];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Access Tier</label>
          <select
            value={tier} onChange={e => setTier(e.target.value as AzureBlobConfig['tier'])}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {Object.entries(AZURE_BLOB_TIERS).map(([k, v]) => (
              <option key={k} value={k}>{v.label} — ${v.perGB}/GB-mes</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Almacenamiento (GB)</label>
          <input
            type="number" min={1} value={storageGB}
            onChange={e => setStorageGB(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Escrituras (miles/mes)</label>
          <input
            type="number" min={0} value={writeK}
            onChange={e => setWriteK(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Lecturas (miles/mes)</label>
          <input
            type="number" min={0} value={readK}
            onChange={e => setReadK(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center text-sm">
        <p className="text-xs text-cyan-600 font-semibold">Precio/GB-mes ({tierInfo.label})</p>
        <p className="font-bold text-cyan-700 mt-0.5">${tierInfo.perGB}</p>
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
          className="w-full sm:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
