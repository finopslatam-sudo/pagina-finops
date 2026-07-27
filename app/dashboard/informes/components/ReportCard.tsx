'use client';

import { FORMAT_CONFIG, type ExportFormat, type ReportDef } from '../constants';
import type { AwsAccount } from '@/app/dashboard/hooks/useAwsAccounts';

interface ReportCardProps {
  report: ReportDef;
  accounts: AwsAccount[];
  loadingAccounts: boolean;
  selectedAccount: number | null;
  loadingKey: string | null;
  onSelectAccount: (reportId: string, value: number | null) => void;
  onExport: (report: ReportDef, format: ExportFormat) => void;
}

export default function ReportCard({
  report,
  accounts,
  loadingAccounts,
  selectedAccount,
  loadingKey,
  onSelectAccount,
  onExport,
}: ReportCardProps) {
  const selectedAccountName = accounts.find(a => a.id === selectedAccount)?.account_name;

  return (
    <div className={`border rounded-3xl overflow-hidden shadow-sm ${report.available ? '' : 'opacity-75'}`}>
      <div className={`${report.headerColor} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3 text-white">
          <span className="text-2xl">{report.icon}</span>
          <div>
            <h2 className="font-bold text-base">{report.title}</h2>
            <p className="text-xs text-white/70">{report.subtitle}</p>
          </div>
        </div>
        {report.available ? (
          <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
            Disponible
          </span>
        ) : (
          <span className="text-xs bg-black/20 text-white/80 px-2.5 py-1 rounded-full font-medium">
            Próximamente
          </span>
        )}
      </div>

      <div className={`${report.color} border-t-0 p-6 space-y-5`}>
        <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>

        <div className="bg-white/70 border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-base">☁️</span>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Cuenta AWS
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Selecciona para qué cuenta deseas generar este informe.
          </p>
          {loadingAccounts ? (
            <div className="h-9 bg-slate-100 rounded-xl animate-pulse" />
          ) : (
            <select
              value={selectedAccount ?? ''}
              onChange={e => onSelectAccount(report.id, e.target.value === '' ? null : Number(e.target.value))}
              disabled={!report.available}
              className={`w-full border rounded-xl px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
                !report.available ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-400'
              }`}
            >
              <option value="">🌐 Todas las cuentas</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.account_name}
                </option>
              ))}
            </select>
          )}
          {selectedAccount && (
            <p className="text-xs text-blue-600 font-medium">
              ✓ Informe filtrado para: <span className="font-semibold">{selectedAccountName}</span>
            </p>
          )}
          {!selectedAccount && (
            <p className="text-xs text-slate-400">
              El informe incluirá datos consolidados de todas las cuentas conectadas.
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Contenido del informe
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {report.includes.map((item, i) => (
              <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                <span className="text-slate-400 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t border-white/60">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Formatos de descarga
          </p>
          <div className="flex flex-wrap gap-2">
            {report.formats.map(fmt => {
              const cfg = FORMAT_CONFIG[fmt];
              const key = `${report.id}-${fmt}`;
              const isLoading = loadingKey === key;
              return (
                <button
                  key={fmt}
                  onClick={() => report.available && onExport(report, fmt)}
                  disabled={!report.available || isLoading}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    report.available
                      ? cfg.color
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  } ${isLoading ? 'opacity-60 cursor-wait' : ''}`}
                >
                  {isLoading ? <span className="animate-spin">⏳</span> : <span>{cfg.icon}</span>}
                  {isLoading ? 'Generando...' : `Descargar ${cfg.label}`}
                </button>
              );
            })}
          </div>
          {!report.available && (
            <p className="text-xs text-slate-400 mt-2">
              Este informe estará disponible en la próxima versión de la plataforma.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
