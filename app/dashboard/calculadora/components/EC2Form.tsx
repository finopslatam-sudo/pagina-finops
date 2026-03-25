'use client';

import { useState } from 'react';
import { EC2_INSTANCES, HOURS_MONTH, calcEC2 } from '../pricing';
import type { EC2Config } from '../types';

interface Props { onAdd: (name: string, data: EC2Config) => void; }

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function EC2Form({ onAdd }: Props) {
  const [name,  setName]  = useState('Servidor EC2');
  const [type,  setType]  = useState('t3.medium');
  const [qty,   setQty]   = useState(1);
  const [hours, setHours] = useState(HOURS_MONTH);

  const inst     = EC2_INSTANCES[type];
  const monthly  = calcEC2({ instanceType: type, quantity: qty, hoursPerMonth: hours });

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipo de instancia</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {Object.entries(EC2_INSTANCES).map(([k, v]) => (
              <option key={k} value={k}>
                {k} — {v.vcpu} vCPU · {v.ram} GB RAM · {fmt(v.price)}/hr
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cantidad de instancias</label>
          <input
            type="number" min={1} max={500}
            value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Horas/mes <span className="normal-case font-normal text-slate-400">(730 = 24/7)</span>
          </label>
          <input
            type="number" min={1} max={744}
            value={hours}
            onChange={e => setHours(Math.min(744, Math.max(1, Number(e.target.value))))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      {inst && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <p className="text-xs text-orange-500 font-semibold">Precio/hora</p>
            <p className="font-bold text-orange-700 mt-0.5">{fmt(inst.price)}</p>
          </div>
          <div>
            <p className="text-xs text-orange-500 font-semibold">vCPU</p>
            <p className="font-bold text-orange-700 mt-0.5">{inst.vcpu}</p>
          </div>
          <div>
            <p className="text-xs text-orange-500 font-semibold">RAM</p>
            <p className="font-bold text-orange-700 mt-0.5">{inst.ram} GB</p>
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
          onClick={() => { if (name.trim()) onAdd(name.trim(), { instanceType: type, quantity: qty, hoursPerMonth: hours }); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
