'use client';

import { useDashboard } from '../hooks/useDashboard';
import MonthlyCostChart from '../components/finance/MonthlyCostChart';
import ServiceBreakdownChart from '../components/finance/ServiceBreakdownChart';
import AwsAccountSelector from "../components/AwsAccountSelector";
import { formatUSD, formatPercentage } from "@/app/lib/finopsFormat";

export default function CostosPage() {

  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 space-y-12 animate-pulse">
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 space-y-4">
          <div className="h-8 w-56 bg-slate-200 rounded-xl" />
          <div className="h-4 w-full max-w-xl bg-slate-200 rounded-lg" />
        </div>
        <div className="h-10 w-48 bg-slate-100 rounded-xl" />
        {[...Array(3)].map((_, row) => (
          <div key={row} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, col) => (
              <div key={col} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="h-3 w-40 bg-slate-200 rounded" />
                <div className="h-8 w-32 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        ))}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl">
          <div className="h-6 w-44 bg-slate-200 rounded mb-6" />
          <div className="h-48 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">No se pudieron cargar los costos</p>;
  }

  const cost = data.cost;
  const dl = cost.date_labels ?? {} as NonNullable<typeof cost.date_labels>;

  const fmt = (iso: string) => {
    if (!iso) return iso;
    const [y, m, d] = iso.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">

      {/* ================= HERO FINANCIAL CARD ================= */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Costs & Financials
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
          Análisis financiero consolidado del consumo cloud, exposición proyectada
          y oportunidades estratégicas de optimización.
        </p>
      </div>

      {/* ================= ACCOUNT FILTER ================= */}
      <div className="flex items-center gap-4 pt-2">
        <AwsAccountSelector />
      </div>

      {/* ================= FILA 1: GASTOS MENSUALES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <KpiCard
          title="Gasto Mes Anterior"
          value={formatUSD(cost.previous_month_cost ?? cost.current_month_cost ?? 0)}
          variant="blue"
          tooltip={
            dl.previous_month_start && dl.previous_month_end
              ? `Período de facturación: ${fmt(dl.previous_month_start)} al ${fmt(dl.previous_month_end)}`
              : 'Gasto total del mes cerrado anterior.'
          }
        />

        <KpiCard
          title="Gasto del Mes Actual"
          value={formatUSD(cost.current_month_partial ?? 0)}
          variant="sky"
          tooltip={
            dl.current_month_end
              ? `Gastos acumulados hasta el ${fmt(dl.current_month_end)}`
              : 'Gastos acumulados hasta el día de hoy.'
          }
        />

        <KpiCard
          title="Ahorro Mensual Acumulado"
          value={formatUSD(cost.potential_savings ?? 0)}
          variant="green"
          tooltip="Corresponde a los ahorros ya aplicados en meses anteriores más los ahorros identificados en el mes actual. Incluye recursos históricos escaneados aunque ya no estén activos en el inventario."
        />

      </div>

      {/* ================= FILA 2: GASTOS ANUALES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <KpiCard
          title="Gasto Año Anterior"
          value={formatUSD(cost.previous_year_cost ?? 0)}
          variant="indigo"
          tooltip={
            dl.previous_year_start && dl.previous_year_end
              ? `Período: ${fmt(dl.previous_year_start)} al ${fmt(dl.previous_year_end)}`
              : 'Gasto total del año anterior.'
          }
        />

        <KpiCard
          title="Gasto Año Actual"
          value={formatUSD(cost.current_year_ytd ?? 0)}
          variant="purple"
          tooltip={
            dl.current_year_start && dl.current_year_end
              ? `Suma de gastos del ${fmt(dl.current_year_start)} al ${fmt(dl.current_year_end)}`
              : 'Gastos acumulados del año en curso hasta hoy.'
          }
        />

        <KpiCard
          title="Ahorro Estimado Anual"
          value={formatUSD(cost.annual_estimated_savings ?? 0)}
          variant="green"
          tooltip={
            dl.current_year_end
              ? `Proyección de ahorro anualizada al ${fmt(dl.current_year_end)}, basada en hallazgos activos.`
              : 'Proyección de ahorro anualizada basada en hallazgos activos.'
          }
        />

      </div>

      {/* ================= FILA 3: PORCENTAJES DE AHORRO ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <KpiCard
          title="Porcentaje de Ahorro Mensual"
          value={formatPercentage(cost.monthly_savings_percentage ?? cost.savings_percentage ?? 0)}
          variant="amber"
        />

        <KpiCard
          title="Porcentaje de Ahorro Anual"
          value={formatPercentage(cost.annual_savings_percentage ?? 0)}
          variant="rose"
        />

        <KpiCard
          title="Porcentaje de Ahorro Actual"
          value={formatPercentage(cost.current_month_savings_percentage ?? 0)}
          variant="sky"
        />

      </div>

      {/* ================= TENDENCIA MENSUAL ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Tendencia mensual
        </h2>
        <MonthlyCostChart data={cost.monthly_cost ?? []} />
      </div>

      {/* ================= DISTRIBUCIÓN POR SERVICIO ================= */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          Distribución por servicio
        </h2>
        <ServiceBreakdownChart data={cost.service_breakdown ?? []} />
      </div>

    </div>
  );
}

/* =====================================================
   KPI CARD
===================================================== */

function KpiCard({
  title,
  value,
  variant,
  tooltip,
}: {
  title: string;
  value: string;
  variant: 'blue' | 'sky' | 'green' | 'indigo' | 'purple' | 'amber' | 'rose';
  tooltip?: string;
}) {

  const bg: Record<string, string> = {
    blue:   "bg-blue-50 border-blue-200",
    sky:    "bg-sky-50 border-sky-200",
    green:  "bg-emerald-50 border-emerald-200",
    indigo: "bg-indigo-50 border-indigo-200",
    purple: "bg-purple-50 border-purple-200",
    amber:  "bg-amber-50 border-amber-200",
    rose:   "bg-rose-50 border-rose-200",
  };

  return (
    <div className={`${bg[variant]} border rounded-2xl p-6 shadow-sm`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm uppercase text-slate-600">{title}</p>

        {tooltip ? (
          <div className="group relative shrink-0">
            <button
              type="button"
              aria-label={`Información sobre ${title}`}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-white"
            >
              i
            </button>
            <div className="pointer-events-none absolute right-0 top-8 z-10 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs normal-case text-slate-600 opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
              {tooltip}
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-3xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}
