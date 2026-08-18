'use client';

import { useState } from 'react';
import { GCP_STORAGE_CLASSES, calcGCPStorage } from '../../gcp-pricing';
import type { GCPStorageConfig } from '../../gcp-types';

interface Props { onAdd: (name: string, data: GCPStorageConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function StorageForm({ onAdd }: Props) {
  const [name, setName] = useState('Cloud Storage Bucket');
  const [storageClass, setStorageClass] = useState<GCPStorageConfig['storageClass']>('standard');
  const [storageGB, setStorageGB] = useState(500);
  const [writeK, setWriteK] = useState(100);
  const [readK, setReadK] = useState(500);

  const cfg: GCPStorageConfig = { storageGB, storageClass, writeOperationsK: writeK, readOperationsK: readK };
  const monthly = calcGCPStorage(cfg);
  const classInfo = GCP_STORAGE_CLASSES[storageClass];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Clase de almacenamiento</label>
          <select
            value={storageClass} onChange={e => setStorageClass(e.target.value as GCPStorageConfig['storageClass'])}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            {Object.entries(GCP_STORAGE_CLASSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label} — ${v.perGB}/GB-mes</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Almacenamiento (GB)</label>
          <input
            type="number" min={1} value={storageGB}
            onChange={e => setStorageGB(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Escrituras (miles/mes)</label>
          <input
            type="number" min={0} value={writeK}
            onChange={e => setWriteK(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Lecturas (miles/mes)</label>
          <input
            type="number" min={0} value={readK}
            onChange={e => setReadK(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center text-sm">
        <p className="text-xs text-yellow-600 font-semibold">Precio/GB-mes ({classInfo.label})</p>
        <p className="font-bold text-yellow-700 mt-0.5">${classInfo.perGB}</p>
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
          className="w-full sm:w-auto px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
