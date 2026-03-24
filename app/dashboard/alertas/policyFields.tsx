"use client";
import { type ReactNode } from "react";
import { PolicyCard } from "./policies";

export interface FieldProps {
  policy: PolicyCard;
  accountOptions: { id: string; label: string }[];
  resolvedAccountId: string;
  setAccountId: (v: string) => void;
  loadingAccounts: boolean;
  thresholdType: "usd" | "pct";
  setThresholdType: (v: "usd" | "pct") => void;
  thresholdValue: string;
  setThresholdValue: (v: string) => void;
  windowSize: "daily" | "weekly" | "monthly" | "annual";
  setWindowSize: (v: "daily" | "weekly" | "monthly" | "annual") => void;
}

const INPUT_CLS =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200";
const SELECT_CLS =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white";

function AccountSelect({
  accountOptions,
  resolvedAccountId,
  setAccountId,
  loadingAccounts,
}: Pick<FieldProps, "accountOptions" | "resolvedAccountId" | "setAccountId" | "loadingAccounts">) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">Cuenta</p>
      <select
        value={resolvedAccountId}
        onChange={(e) => setAccountId(e.target.value)}
        disabled={loadingAccounts}
        className={SELECT_CLS}
      >
        {accountOptions.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.label}
          </option>
        ))}
      </select>
      {!loadingAccounts && accountOptions.length === 1 && (
        <p className="text-xs text-amber-600">
          No hay cuentas disponibles. Conecta una cuenta AWS primero.
        </p>
      )}
    </div>
  );
}

function Toggle({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
            ${value === opt.id
              ? "border-sky-500 bg-sky-50 text-sky-800"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function BudgetFields(p: FieldProps & { period: "monthly" | "annual" }) {
  return (
    <div className="space-y-4">
      <AccountSelect {...p} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          Umbral ({p.period === "monthly" ? "mensual" : "anual"})
        </p>
        <Toggle
          value={p.thresholdType}
          onChange={(v) => p.setThresholdType(v as "usd" | "pct")}
          options={[{ id: "usd", label: "USD" }, { id: "pct", label: "% del presupuesto" }]}
        />
        <input
          type="number"
          min={0}
          value={p.thresholdValue}
          onChange={(e) => p.setThresholdValue(e.target.value)}
          placeholder={p.thresholdType === "usd" ? "Ej: 500" : "Ej: 80"}
          className={INPUT_CLS}
        />
        <p className="text-xs text-slate-500">
          {p.thresholdType === "usd"
            ? "Se disparará cuando el gasto supere este monto en USD."
            : "Se disparará al superar este % del presupuesto definido."}
        </p>
      </div>
    </div>
  );
}

function AnomalyFields(p: FieldProps) {
  return (
    <div className="space-y-4">
      <AccountSelect {...p} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Variación anómala</p>
        <Toggle
          value={p.windowSize}
          onChange={(v) => p.setWindowSize(v as "daily" | "weekly")}
          options={[{ id: "daily", label: "Diaria" }, { id: "weekly", label: "Semanal" }]}
        />
        <input
          type="number"
          min={0}
          value={p.thresholdValue}
          onChange={(e) => p.setThresholdValue(e.target.value)}
          placeholder="Ej: 50 (USD impacto mínimo)"
          className={INPUT_CLS}
        />
        <p className="text-xs text-slate-500">
          Usa AWS Cost Anomaly Detection (ML nativo). Se dispara si hay anomalías con impacto superior a este monto en USD.
        </p>
      </div>
    </div>
  );
}

function ServiceCostFields(p: FieldProps) {
  return (
    <div className="space-y-4">
      <AccountSelect {...p} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Umbral por servicio (USD)</p>
        <input
          type="number"
          min={0}
          value={p.thresholdValue}
          onChange={(e) => p.setThresholdValue(e.target.value)}
          placeholder="Ej: 200"
          className={INPUT_CLS}
        />
        <p className="text-xs text-slate-500">
          Alerta si EC2, RDS, S3 u otro servicio supera este monto en el mes actual.
        </p>
      </div>
    </div>
  );
}

function ForecastFields(p: FieldProps) {
  return (
    <div className="space-y-4">
      <AccountSelect {...p} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Umbral de proyección</p>
        <Toggle
          value={p.thresholdType}
          onChange={(v) => p.setThresholdType(v as "usd" | "pct")}
          options={[{ id: "usd", label: "USD" }, { id: "pct", label: "%" }]}
        />
        <input
          type="number"
          min={0}
          value={p.thresholdValue}
          onChange={(e) => p.setThresholdValue(e.target.value)}
          placeholder={p.thresholdType === "usd" ? "Ej: 1000" : "Ej: 110"}
          className={INPUT_CLS}
        />
        <p className="text-xs text-slate-500">
          {p.thresholdType === "usd"
            ? "Alerta si la proyección al cierre del mes supera este monto en USD."
            : "Alerta si la proyección supera el promedio histórico en este porcentaje."}
        </p>
      </div>
    </div>
  );
}

function CountFields(
  p: FieldProps & {
    label: string;
    hint: string;
    fixedPeriod?: string;
  }
) {
  const showToggle = !p.fixedPeriod;
  return (
    <div className="space-y-4">
      <AccountSelect {...p} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">{p.label}</p>
        {showToggle && (
          <Toggle
            value={p.windowSize}
            onChange={(v) => p.setWindowSize(v as "daily" | "weekly")}
            options={[{ id: "daily", label: "Diaria" }, { id: "weekly", label: "Semanal" }]}
          />
        )}
        {p.fixedPeriod && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
            <span>⏱</span> {p.fixedPeriod}
          </div>
        )}
        <input
          type="number"
          min={1}
          value={p.thresholdValue}
          onChange={(e) => p.setThresholdValue(e.target.value)}
          placeholder="Ej: 1"
          className={INPUT_CLS}
        />
        <p className="text-xs text-slate-500">{p.hint}</p>
      </div>
    </div>
  );
}

export function renderPolicyFields(p: FieldProps): ReactNode {
  switch (p.policy.id) {
    case "budget-monthly":
      return <BudgetFields {...p} period="monthly" />;
    case "budget-annual":
      return <BudgetFields {...p} period="annual" />;
    case "anomaly-spike":
      return <AnomalyFields {...p} />;
    case "service-cost":
      return <ServiceCostFields {...p} />;
    case "forecast":
      return <ForecastFields {...p} />;
    case "off-hours":
      return (
        <CountFields
          {...p}
          label="Recursos activos para alertar"
          hint="Detecta instancias EC2 y bases de datos RDS activas entre 22:00 y 08:00 hora Chile."
          fixedPeriod="Evaluación diaria (fuera de horario hábil)"
        />
      );
    case "tagging-policy":
      return (
        <CountFields
          {...p}
          label="Recursos sin etiquetas para alertar"
          hint="Alerta cuando haya al menos N recursos sin etiquetas en tu inventario cloud."
        />
      );
    case "idle-resources":
      return (
        <CountFields
          {...p}
          label="Recursos inactivos para alertar"
          hint="Alerta cuando detecte recursos con baja utilización, subutilizados o sin uso activo."
        />
      );
    case "lifecycle":
      return (
        <CountFields
          {...p}
          label="Findings de ciclo de vida para alertar"
          hint="Detecta snapshots antiguos, volúmenes EBS sin usar, Elastic IPs no asociadas y objetos S3 sin acceso."
        />
      );
    default:
      return (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Configuración no disponible para esta política.
        </div>
      );
  }
}
