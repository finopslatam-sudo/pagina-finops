'use client';

import { useState } from 'react';
import { S3_CLASSES, calcS3 } from '../pricing';
import type { S3Config } from '../types';

interface Props { onAdd: (name: string, data: S3Config) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function S3Form({ onAdd }: Props) {
  const [name,     setName]     = useState('Bucket S3');
  const [storage,  setStorage]  = useState(500);
  const [cls,      setCls]      = useState<S3Config['storageClass']>('standard');
  const [getReqK,  setGetReqK]  = useState(100);
  const [putReqK,  setPutReqK]  = useState(10);

  const cfg: S3Config = { storageGB: storage, storageClass: cls, getRequestsK: getReqK, putRequestsK: putReqK };
  const monthly = calcS3(cfg);
  const clsInfo = S3_CLASSES[cls];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Clase de almacenamiento</label>
          <select
            value={cls} onChange={e => setCls(e.target.value as S3Config['storageClass'])}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {Object.entries(S3_CLASSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label} — ${v.perGB}/GB</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Almacenamiento (GB)</label>
          <input
            type="number" min={1} value={storage}
            onChange={e => setStorage(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Solicitudes GET/mes (miles)</label>
          <input
            type="number" min={0} value={getReqK}
            onChange={e => setGetReqK(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Solicitudes PUT/mes (miles)</label>
          <input
            type="number" min={0} value={putReqK}
            onChange={e => setPutReqK(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div>
          <p className="text-xs text-green-600 font-semibold">Clase</p>
          <p className="font-bold text-green-700 mt-0.5">{clsInfo.label}</p>
        </div>
        <div>
          <p className="text-xs text-green-600 font-semibold">Precio/GB</p>
          <p className="font-bold text-green-700 mt-0.5">${clsInfo.perGB}</p>
        </div>
        <div>
          <p className="text-xs text-green-600 font-semibold">Almacenamiento</p>
          <p className="font-bold text-green-700 mt-0.5">{storage.toLocaleString()} GB</p>
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
          className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
