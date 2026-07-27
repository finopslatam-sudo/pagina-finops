'use client';

import { formatUSD, formatPercentage } from "@/app/lib/finopsFormat";
import type { DashboardResponse } from '../../hooks/useDashboard';
import KpiCard from './KpiCard';

type Cost = DashboardResponse['cost'];

interface CostosKpiRowsProps {
  cost: Cost;
  dl: NonNullable<Cost['date_labels']>;
  fmt: (iso: string) => string;
}

export default function CostosKpiRows({ cost, dl, fmt }: CostosKpiRowsProps) {
  return (
    <>
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
          value={(cost.previous_year_cost ?? 0) > 0 ? formatUSD(cost.previous_year_cost!) : 'Sin datos'}
          variant="indigo"
          tooltip={
            (cost.previous_year_cost ?? 0) > 0
              ? (dl.previous_year_start && dl.previous_year_end
                  ? `Período: ${fmt(dl.previous_year_start)} al ${fmt(dl.previous_year_end)}`
                  : 'Gasto total del año anterior.')
              : 'Esta cuenta no tiene historial de costos en AWS para el año anterior.'
          }
        />

        <KpiCard
          title="Gasto Año Actual"
          value={(cost.current_year_ytd ?? 0) > 0 ? formatUSD(cost.current_year_ytd!) : 'Sin datos'}
          variant="purple"
          tooltip={
            (cost.current_year_ytd ?? 0) > 0
              ? (dl.current_year_start && dl.current_year_end
                  ? `Suma de gastos del ${fmt(dl.current_year_start)} al ${fmt(dl.current_year_end)}`
                  : 'Gastos acumulados del año en curso hasta hoy.')
              : 'Esta cuenta no tiene historial de costos en AWS para el año en curso.'
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
          value={(cost.previous_year_cost ?? 0) > 0 ? formatPercentage(cost.annual_savings_percentage ?? 0) : 'Sin datos'}
          variant="rose"
        />

        <KpiCard
          title="Porcentaje de Ahorro Actual"
          value={formatPercentage(cost.current_month_savings_percentage ?? 0)}
          variant="sky"
        />

      </div>
    </>
  );
}
