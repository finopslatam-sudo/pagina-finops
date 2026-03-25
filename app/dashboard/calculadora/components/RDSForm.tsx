'use client';

import { useState } from 'react';
import { RDS_INSTANCES, HOURS_MONTH, calcRDS } from '../pricing';
import type { RDSConfig } from '../types';

interface Props { onAdd: (name: string, data: RDSConfig) => void; }

const fmt  = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function RDSForm({ onAdd }: Props) {
  const [name,    setName]    = useState('Base de Datos RDS');
  const [type,    setType]    = useState('db.t3.medium');
  const [qty,     setQty]     = useState(1);
  const [multiAZ, setMultiAZ] = useState(false);
  const [storage, setStorage] = useState(100);

  const cfg: RDSConfig = { instanceType: type, quantity: qty, multiAZ, storageGB: storage };
  const monthly = calcRDS(cfg);
  const inst = RDS_INSTANCES[type];

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Clase de instancia</label>
          <select
            value={type} onChange={e => setType(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.entries(RDS_INSTANCES).map(([k, v]) => (
              <option key={k} value={k}>
                {k} — {v.vcpu} vCPU · {v.ram} GB RAM · {fmt(v.price)}/hr
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cantidad</label>
          <input
            type="number" min={1} max={100} value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Almacenamiento (GB)</label>
          <input
            type="number" min={20} max={65536} value={storage}
            onChange={e => setStorage(Math.max(20, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <input
          type="checkbox" checked={multiAZ} onChange={e => setMultiAZ(e.target.checked)}
          className="w-4 h-4 rounded accent-blue-600"
        />
        <div>
          <p className="text-sm font-semibold text-slate-700">Multi-AZ</p>
          <p className="text-xs text-slate-500">Alta disponibilidad con réplica en segunda zona — duplica el costo de cómputo</p>
        </div>
      </label>

      {inst && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <p className="text-xs text-blue-500 font-semibold">Precio/hora</p>
            <p className="font-bold text-blue-700 mt-0.5">{fmt(inst.price)}{multiAZ ? ' ×2' : ''}</p>
          </div>
          <div>
            <p className="text-xs text-blue-500 font-semibold">vCPU</p>
            <p className="font-bold text-blue-700 mt-0.5">{inst.vcpu}</p>
          </div>
          <div>
            <p className="text-xs text-blue-500 font-semibold">RAM</p>
            <p className="font-bold text-blue-700 mt-0.5">{inst.ram} GB</p>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">
        * Precio base MySQL/PostgreSQL us-east-1. Storage: $0.115/GB gp2. Horas: {HOURS_MONTH}/mes.
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500">Costo mensual estimado</p>
          <p className="text-2xl font-bold text-slate-800">{fmtM(monthly)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Anual: {fmtM(monthly * 12)}</p>
        </div>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), cfg); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
