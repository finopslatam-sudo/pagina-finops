'use client';

import { useState } from 'react';
import { calcNAT, HOURS_MONTH } from '../pricing';
import type { NATConfig } from '../types';

interface Props { onAdd: (name: string, data: NATConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function NATForm({ onAdd }: Props) {
  const [name,   setName]   = useState('NAT Gateway');
  const [qty,    setQty]    = useState(1);
  const [dataGB, setDataGB] = useState(100);

  const cfg: NATConfig = { quantity: qty, dataGB };
  const monthly = calcNAT(cfg);
  const hoursMonthly = qty * 0.045 * HOURS_MONTH;
  const dataMonthly  = qty * dataGB * 0.045;

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cantidad de NAT Gateways</label>
          <input
            type="number" min={1} max={50} value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <p className="text-xs text-slate-400 mt-1">$0.045/hora por gateway</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Datos procesados/mes (GB)</label>
          <input
            type="number" min={0} value={dataGB}
            onChange={e => setDataGB(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <p className="text-xs text-slate-400 mt-1">$0.045/GB procesado</p>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-center text-sm">
        <div>
          <p className="text-xs text-teal-600 font-semibold">Costo por horas ({HOURS_MONTH}h)</p>
          <p className="font-bold text-teal-700 mt-0.5">{fmtM(hoursMonthly)}</p>
        </div>
        <div>
          <p className="text-xs text-teal-600 font-semibold">Costo por datos</p>
          <p className="font-bold text-teal-700 mt-0.5">{fmtM(dataMonthly)}</p>
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
          className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
