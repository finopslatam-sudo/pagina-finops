'use client';

import { useState } from 'react';
import { AZURE_VM_SIZES, calcAzureVM } from '../../azure-pricing';
import { HOURS_MONTH } from '../../pricing';
import type { AzureVMConfig } from '../../azure-types';

interface Props { onAdd: (name: string, data: AzureVMConfig) => void; }

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });
const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function VMForm({ onAdd }: Props) {
  const [name,  setName]  = useState('Virtual Machine');
  const [type,  setType]  = useState('D2s_v5');
  const [qty,   setQty]   = useState(1);
  const [hours, setHours] = useState(HOURS_MONTH);

  const inst    = AZURE_VM_SIZES[type];
  const monthly = calcAzureVM({ instanceType: type, quantity: qty, hoursPerMonth: hours });

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
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tamaño de VM</label>
          <select
            value={type} onChange={e => setType(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.entries(AZURE_VM_SIZES).map(([k, v]) => (
              <option key={k} value={k}>{k} — {v.vcpu} vCPU · {v.ram} GB RAM · {fmt(v.price)}/hr</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cantidad de VMs</label>
          <input
            type="number" min={1} max={500} value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Horas/mes <span className="normal-case font-normal text-slate-400">(730 = 24/7)</span>
          </label>
          <input
            type="number" min={1} max={744} value={hours}
            onChange={e => setHours(Math.min(744, Math.max(1, Number(e.target.value))))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {inst && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <p className="text-xs text-blue-500 font-semibold">Precio/hora</p>
            <p className="font-bold text-blue-700 mt-0.5">{fmt(inst.price)}</p>
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500">Costo mensual estimado</p>
          <p className="text-2xl font-bold text-slate-800">{fmtM(monthly)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Anual: {fmtM(monthly * 12)}</p>
        </div>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), { instanceType: type, quantity: qty, hoursPerMonth: hours }); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
