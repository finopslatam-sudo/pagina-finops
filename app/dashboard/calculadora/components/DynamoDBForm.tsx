'use client';

import { useState } from 'react';
import { calcDynamoDB } from '../pricing';
import type { DynamoDBConfig } from '../types';

interface Props { onAdd: (name: string, data: DynamoDBConfig) => void; }

const fmtM = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function DynamoDBForm({ onAdd }: Props) {
  const [name,   setName]   = useState('Tabla DynamoDB');
  const [writes, setWrites] = useState(1);
  const [reads,  setReads]  = useState(5);
  const [store,  setStore]  = useState(10);

  const cfg: DynamoDBConfig = { writeMillions: writes, readMillions: reads, storageGB: store };
  const monthly = calcDynamoDB(cfg);

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre del recurso</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Escrituras/mes (M)</label>
          <input
            type="number" min={0} step={0.1} value={writes}
            onChange={e => setWrites(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <p className="text-xs text-slate-400 mt-1">$1.25/millón</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Lecturas/mes (M)</label>
          <input
            type="number" min={0} step={0.1} value={reads}
            onChange={e => setReads(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <p className="text-xs text-slate-400 mt-1">$0.25/millón</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Almacenamiento (GB)</label>
          <input
            type="number" min={0} step={1} value={store}
            onChange={e => setStore(Math.max(0, Number(e.target.value)))}
            className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <p className="text-xs text-slate-400 mt-1">$0.25/GB</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-700">
        Precio On-Demand us-east-1. Primeros 25 GB de almacenamiento y 25 WCU/RCU son gratuitos (no descontados aquí).
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
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
        >
          + Agregar al proyecto
        </button>
      </div>
    </div>
  );
}
