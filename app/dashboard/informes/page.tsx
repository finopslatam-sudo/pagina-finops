'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useAwsAccounts } from '@/app/dashboard/hooks/useAwsAccounts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/* ─── tipos ─────────────────────────────────────────────── */

type ExportFormat = 'pdf' | 'csv' | 'xlsx';

interface ReportDef {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  formats: ExportFormat[];
  endpoint: string | null;
  color: string;
  headerColor: string;
  available: boolean;
}

/* ─── definición de informes ─────────────────────────────── */

const REPORTS: ReportDef[] = [
  {
    id: 'findings',
    icon: '🔎',
    title: 'Findings & Rightsizing',
    subtitle: 'Reporte técnico-ejecutivo',
    description:
      'Informe completo de todos los hallazgos detectados en tu entorno cloud: ineficiencias, riesgos, recursos sobre-aprovisionados y oportunidades de ahorro con su resolución recomendada.',
    includes: [
      'Resumen ejecutivo con KPIs de ahorro',
      'Listado de hallazgos activos y resueltos',
      'Clasificación por severidad (HIGH / MEDIUM / LOW)',
      'Recomendaciones de resolución por tipo de finding',
      'Ahorro estimado mensual acumulado',
      'Distribución por servicio y cuenta AWS',
    ],
    formats: ['pdf', 'csv', 'xlsx'],
    endpoint: '/api/client/reports',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-600',
    available: true,
  },
  {
    id: 'executive',
    icon: '📊',
    title: 'Resumen Ejecutivo',
    subtitle: 'Para dirección y stakeholders',
    description:
      'Informe de alto nivel orientado a la dirección: visión consolidada del gasto cloud, cumplimiento, riesgo y ROI de las iniciativas FinOps. Diseñado para presentaciones ejecutivas.',
    includes: [
      'Dashboard de gasto mensual vs año anterior',
      'Score de cumplimiento y nivel de riesgo',
      'Top 5 oportunidades de ahorro identificadas',
      'Tendencia histórica de costos (últimos 6 meses)',
      'Distribución de costos por servicio',
      'Estado de hallazgos: activos, resueltos, alta severidad',
    ],
    formats: ['pdf'],
    endpoint: '/api/client/reports/executive',
    color: 'bg-indigo-50 border-indigo-200',
    headerColor: 'bg-indigo-600',
    available: true,
  },
  {
    id: 'costs',
    icon: '💰',
    title: 'Reporte de Costos',
    subtitle: 'Análisis financiero detallado',
    description:
      'Análisis financiero completo del gasto cloud por servicio, cuenta y región. Incluye comparativas mensuales y anuales, distribución de gastos y tendencia histórica.',
    includes: [
      'Gasto mensual y anual por cuenta AWS',
      'Distribución de costos por servicio',
      'Comparativa mes actual vs mes anterior',
      'Gasto año actual vs año anterior',
      'Tendencia de costos últimos 6 meses',
      'Top servicios por mayor costo',
    ],
    formats: ['pdf', 'xlsx'],
    endpoint: '/api/client/reports/costs',
    color: 'bg-emerald-50 border-emerald-200',
    headerColor: 'bg-emerald-600',
    available: true,
  },
  {
    id: 'risk',
    icon: '🛡️',
    title: 'Reporte de Riesgo & Compliance',
    subtitle: 'Gobernanza y cumplimiento',
    description:
      'Evaluación completa del posicionamiento de riesgo de tu entorno cloud: score de compliance, hallazgos críticos, riesgo por servicio y recomendaciones de remediación.',
    includes: [
      'Score de compliance y nivel de riesgo global',
      'Distribución de riesgo: CRITICAL / HIGH / MEDIUM / LOW',
      'Hallazgos de alta severidad con ahorro potencial',
      'Riesgo desglosado por servicio AWS',
      'Total findings activos, resueltos y pendientes',
      'Recomendaciones prioritarias de remediación',
    ],
    formats: ['pdf', 'xlsx'],
    endpoint: '/api/client/reports/risk',
    color: 'bg-rose-50 border-rose-200',
    headerColor: 'bg-rose-600',
    available: true,
  },
  {
    id: 'assets',
    icon: '📦',
    title: 'Inventario de Recursos',
    subtitle: 'Inventario cloud completo',
    description:
      'Inventario detallado de todos los recursos activos en tus cuentas AWS: instancias, bases de datos, almacenamiento, funciones serverless y más, con estado y costo asociado.',
    includes: [
      'Listado completo de recursos activos por cuenta',
      'Clasificación por tipo y servicio AWS',
      'Estado de cada recurso (running, stopped, idle)',
      'Costo estimado por recurso',
      'Recursos sin hallazgos vs con hallazgos',
      'Inventario por región geográfica',
    ],
    formats: ['csv', 'xlsx'],
    endpoint: '/api/client/reports/inventory',
    color: 'bg-amber-50 border-amber-200',
    headerColor: 'bg-amber-600',
    available: true,
  },
];

/* ─── formato labels ─────────────────────────────────────── */

const FORMAT_CONFIG: Record<ExportFormat, { label: string; color: string; icon: string }> = {
  pdf:  { label: 'PDF',  color: 'bg-blue-600 hover:bg-blue-700 text-white',       icon: '📄' },
  csv:  { label: 'CSV',  color: 'bg-emerald-600 hover:bg-emerald-700 text-white', icon: '📊' },
  xlsx: { label: 'XLSX', color: 'bg-indigo-600 hover:bg-indigo-700 text-white',   icon: '📋' },
};

/* ─── page ──────────────────────────────────────────────── */

export default function InformesPage() {
  const { token, isAuthReady } = useAuth();
  const { accounts, loading: loadingAccounts } = useAwsAccounts();

  /* estado de carga/error global */
  const [loadingKey, setLoadingKey]   = useState<string | null>(null);
  const [error,      setError]        = useState<string | null>(null);
  const [success,    setSuccess]      = useState<string | null>(null);

  /* cuenta seleccionada por informe: { [reportId]: accountId | null } */
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, number | null>>({});

  const setAccount = (reportId: string, value: number | null) =>
    setSelectedAccounts(prev => ({ ...prev, [reportId]: value }));

  /* descarga */
  const handleExport = async (report: ReportDef, format: ExportFormat) => {
    if (!isAuthReady || !token) { setError('Inicia sesión para exportar informes.'); return; }
    if (!report.endpoint) return;

    const key = `${report.id}-${format}`;
    setLoadingKey(key);
    setError(null);
    setSuccess(null);

    try {
      const accountId = selectedAccounts[report.id] ?? null;
      const qs = accountId ? `?account_id=${accountId}` : '';
      const res = await fetch(`${API_URL}${report.endpoint}/${format}${qs}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `informe-${report.id}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(`Informe "${report.title}" descargado correctamente.`);
    } catch {
      setError('No se pudo generar el informe. Intenta nuevamente.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-100 border border-indigo-100 rounded-3xl p-10 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📑</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Informes Ejecutivos</h1>
            <p className="text-slate-500 mt-3 max-w-3xl leading-relaxed">
              Genera y descarga informes formales de tu entorno cloud: hallazgos, costos, riesgos e inventario.
              Diseñados para dirección, equipos técnicos y auditorías internas. Disponibles en múltiples formatos.
            </p>
          </div>
          <div className="flex flex-col items-end justify-center">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{REPORTS.filter(r => r.available).length}/{REPORTS.length}</div>
              <div className="text-xs text-slate-400">informes disponibles</div>
            </div>
          </div>
        </div>

        {/* stat row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Formatos disponibles', value: 'PDF · CSV · XLSX', icon: '📄' },
            { label: 'Generación',            value: 'Tiempo real',      icon: '⚡' },
            { label: 'Datos actualizados',    value: 'Cada 24 horas',    icon: '🔄' },
            { label: 'Idioma',                value: 'Español',           icon: '🌎' },
          ].map(s => (
            <div key={s.label} className="bg-white/80 border border-indigo-100 rounded-2xl p-4">
              <div className="text-lg font-bold text-slate-700">{s.icon} {s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENSAJES ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="font-bold">×</button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-3 text-sm flex justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="font-bold">×</button>
        </div>
      )}

      {/* ── GRID DE INFORMES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {REPORTS.map(report => {
          const currentAccount = selectedAccounts[report.id] ?? null;
          const selectedAccountName = accounts.find(a => a.id === currentAccount)?.account_name;

          return (
            <div
              key={report.id}
              className={`border rounded-3xl overflow-hidden shadow-sm ${report.available ? '' : 'opacity-75'}`}
            >
              {/* ── header ── */}
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

              {/* ── cuerpo ── */}
              <div className={`${report.color} border-t-0 p-6 space-y-5`}>

                <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>

                {/* ── SELECTOR DE CUENTA AWS ── */}
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
                      value={currentAccount ?? ''}
                      onChange={e => setAccount(report.id, e.target.value === '' ? null : Number(e.target.value))}
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
                  {currentAccount && (
                    <p className="text-xs text-blue-600 font-medium">
                      ✓ Informe filtrado para: <span className="font-semibold">{selectedAccountName}</span>
                    </p>
                  )}
                  {!currentAccount && (
                    <p className="text-xs text-slate-400">
                      El informe incluirá datos consolidados de todas las cuentas conectadas.
                    </p>
                  )}
                </div>

                {/* ── contenido del informe ── */}
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

                {/* ── botones de descarga ── */}
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
                          onClick={() => report.available && handleExport(report, fmt)}
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
        })}
      </div>

      {/* ── NOTA LEGAL ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">📌 Nota sobre los informes</p>
        <p>
          Todos los informes se generan en tiempo real con los datos más recientes de tu entorno cloud.
          Los datos de costos provienen directamente de AWS Cost Explorer y son actualizados cada 24 horas.
          Los informes en formato PDF son adecuados para presentaciones ejecutivas y auditorías.
          Para análisis de datos, utiliza los formatos CSV o XLSX.
        </p>
      </div>

    </div>
  );
}
