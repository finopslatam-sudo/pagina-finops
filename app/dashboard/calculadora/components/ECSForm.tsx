'use client';

import { useState } from 'react';
import { calcECS, HOURS_MONTH } from '../pricing';
import type { ECSConfig } from '../types';

interface Props { onAdd: (name: string, data: ECSConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

const VCPU_OPTIONS  = [0.25, 0.5, 1, 2, 4, 8, 16];
const MEM_OPTIONS: Record<number, number[]> = {
  0.25: [0.5, 1, 2],
  0.5:  [1, 2, 3, 4],
  1:    [2, 3, 4, 5, 6, 7, 8],
  2:    [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  4:    [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  8:    [16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
  16:   [32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120],
};

export default function ECSForm({ onAdd }: Props) {
  const [name,   setName]   = useState('Servicio ECS Fargate');
  const [tasks,  setTasks]  = useState(2);
  const [vcpu,   setVcpu]   = useState(1);
  const [memGB,  setMemGB]  = useState(2);
  const [hours,  setHours]  = useState(HOURS_MONTH);

  const validMem = MEM_OPTIONS[vcpu] ?? [memGB];
  const safeMemGB = validMem.includes(memGB) ? memGB : validMem[0];

  const cfg: ECSConfig = { tasks, vcpu, memoryGB: safeMemGB, hoursPerMonth: hours };
  const monthly = calcECS(cfg);

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
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Número de tareas</label>
          <input
            type="number" min={1} value={tasks}
            onChange={e => setTasks(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">vCPU por tarea</label>
          <select
            value={vcpu} onChange={e => { setVcpu(Number(e.target.value)); setMemGB(MEM_OPTIONS[Number(e.target.value)]?.[0] ?? 2); }}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {VCPU_OPTIONS.map(v => <option key={v} value={v}>{v} vCPU</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Memoria por tarea (GB)</label>
          <select
            value={safeMemGB} onChange={e => setMemGB(Number(e.target.value))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {validMem.map(m => <option key={m} value={m}>{m} GB</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Horas/mes</label>
          <input
            type="number" min={1} max={744} value={hours}
            onChange={e => setHours(Math.min(744, Math.max(1, Number(e.target.value))))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-xs text-cyan-700">
        ECS Fargate us-east-1: $0.04048/vCPU-hr + $0.004445/GB-hr. Linux/x86.
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500">Costo mensual estimado</p>
          <p className="text-2xl font-bold text-slate-800">{fmtM(monthly)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Anual: {fmtM(monthly * 12)}</p>
        </div>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), { ...cfg, memoryGB: safeMemGB }); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
