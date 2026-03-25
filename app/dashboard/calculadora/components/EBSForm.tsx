'use client';

import { useState } from 'react';
import { EBS_TYPES, calcEBS } from '../pricing';
import type { EBSConfig } from '../types';

interface Props { onAdd: (name: string, data: EBSConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function EBSForm({ onAdd }: Props) {
  const [name,    setName]    = useState('Volumen EBS');
  const [volType, setVolType] = useState<EBSConfig['volumeType']>('gp3');
  const [sizeGB,  setSizeGB]  = useState(100);
  const [qty,     setQty]     = useState(1);
  const [iops,    setIops]    = useState(3000);

  const cfg: EBSConfig = { volumeType: volType, sizeGB, quantity: qty, iops };
  const monthly = calcEBS(cfg);
  const volInfo = EBS_TYPES[volType];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipo de volumen</label>
          <select
            value={volType} onChange={e => setVolType(e.target.value as EBSConfig['volumeType'])}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {Object.entries(EBS_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label} — ${v.perGB}/GB-mes</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tamaño (GB)</label>
          <input
            type="number" min={1} max={65536} value={sizeGB}
            onChange={e => setSizeGB(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cantidad de volúmenes</label>
          <input
            type="number" min={1} max={1000} value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {volType === 'io1' && (
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">IOPS provisionadas</label>
            <input
              type="number" min={100} max={64000} value={iops}
              onChange={e => setIops(Math.max(100, Number(e.target.value)))}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <p className="text-xs text-slate-400 mt-1">$0.065 por IOPS provisionada/mes</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-center text-sm">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Precio/GB-mes</p>
          <p className="font-bold text-slate-700 mt-0.5">${volInfo.perGB}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-semibold">Almacenamiento total</p>
          <p className="font-bold text-slate-700 mt-0.5">{sizeGB * qty} GB</p>
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
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
