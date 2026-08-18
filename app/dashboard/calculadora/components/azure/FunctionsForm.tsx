'use client';

import { useState } from 'react';
import { calcAzureFunctions } from '../../azure-pricing';
import type { AzureFunctionsConfig } from '../../azure-types';

interface Props { onAdd: (name: string, data: AzureFunctionsConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function FunctionsForm({ onAdd }: Props) {
  const [name, setName] = useState('Function App');
  const [executions, setExecutions] = useState(5);
  const [duration, setDuration] = useState(200);
  const [memory, setMemory] = useState(256);

  const cfg: AzureFunctionsConfig = {
    executionsMillions: executions,
    avgDurationMs: duration,
    memorySizeMB: memory,
  };
  const monthly = calcAzureFunctions(cfg);

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Ejecuciones (millones/mes)</label>
          <input
            type="number" min={0} step={0.1} value={executions}
            onChange={e => setExecutions(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Duración promedio (ms)</label>
          <input
            type="number" min={1} value={duration}
            onChange={e => setDuration(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Memoria (MB)</label>
          <input
            type="number" min={128} step={128} value={memory}
            onChange={e => setMemory(Math.max(128, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </div>

      <p className="text-xs text-slate-400">Incluye 1M de ejecuciones y 400,000 GB-s gratis por mes (Consumption plan).</p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500">Costo mensual estimado</p>
          <p className="text-2xl font-bold text-slate-800">{fmtM(monthly)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Anual: {fmtM(monthly * 12)}</p>
        </div>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), cfg); }}
          disabled={!name.trim()}
          className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
