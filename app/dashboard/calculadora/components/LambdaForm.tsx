'use client';

import { useState } from 'react';
import { calcLambda } from '../pricing';
import type { LambdaConfig } from '../types';

interface Props { onAdd: (name: string, data: LambdaConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

const MEMORY_SIZES = [128, 256, 512, 1024, 2048, 3008, 4096, 6144, 8192, 10240];

export default function LambdaForm({ onAdd }: Props) {
  const [name,     setName]     = useState('Función Lambda');
  const [reqM,     setReqM]     = useState(10);
  const [duration, setDuration] = useState(200);
  const [memory,   setMemory]   = useState(512);

  const cfg: LambdaConfig = { requestsMillions: reqM, avgDurationMs: duration, memorySizeMB: memory };
  const monthly = calcLambda(cfg);

  const gbSec = reqM * 1_000_000 * (duration / 1000) * (memory / 1024);

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
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Invocaciones/mes (M)</label>
          <input
            type="number" min={0.1} step={0.1} value={reqM}
            onChange={e => setReqM(Math.max(0.1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <p className="text-xs text-slate-400 mt-1">{(reqM * 1_000_000).toLocaleString()} invocaciones</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Duración promedio (ms)</label>
          <input
            type="number" min={1} max={900000} value={duration}
            onChange={e => setDuration(Math.max(1, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Memoria (MB)</label>
          <select
            value={memory} onChange={e => setMemory(Number(e.target.value))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            {MEMORY_SIZES.map(m => <option key={m} value={m}>{m} MB</option>)}
          </select>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-amber-600 font-semibold">GB-segundos/mes</p>
          <p className="font-bold text-amber-700 mt-0.5">{gbSec.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
        </div>
        <div>
          <p className="text-xs text-amber-600 font-semibold">Free tier incluido</p>
          <p className="font-bold text-amber-700 mt-0.5">1M req + 400K GB-s</p>
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
          className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
