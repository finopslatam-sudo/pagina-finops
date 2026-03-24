"use client";

import { useMemo, useState } from "react";
import { PolicyCard } from "./policies";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    dbId?: string;
    policyId: string;
    title: string;
    account: string;
    channel: string;
    destination: string;
    threshold: string;
    thresholdType: string;
    period?: string;
    email?: string;
    aws_account_id?: string;
  }) => void;
  policy?: PolicyCard;
  initialValues?: {
    dbId?: string;
    channel?: string;
    email?: string;
    threshold?: string;
    thresholdType?: string;
    period?: string;
    aws_account_id?: string;
  };
  accounts: { id: string; label: string }[];
  loadingAccounts?: boolean;
}

type Channel = "email" | "slack" | "teams";

export default function PolicyModal({
  open,
  onClose,
  onSave,
  policy,
  initialValues,
  accounts,
  loadingAccounts = false,
}: Props) {
  const initialChannel = initialValues?.channel === "slack" || initialValues?.channel === "teams"
    ? initialValues.channel
    : "email";
  const initialThresholdType = initialValues?.thresholdType === "USD" ? "usd" : "pct";
  const initialPeriod = initialValues?.period === "daily" || initialValues?.period === "weekly"
    ? initialValues.period
    : policy?.id === "budget-annual"
      ? "annual"
      : "monthly";

  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [email, setEmail] = useState(initialValues?.email || "");
  const [accountId, setAccountId] = useState(initialValues?.aws_account_id || "all");
  const [thresholdType, setThresholdType] = useState<"usd" | "pct">(initialThresholdType);
  const [thresholdValue, setThresholdValue] = useState(initialValues?.threshold || "");
  const [windowSize, setWindowSize] = useState<"daily" | "weekly" | "monthly" | "annual">(initialPeriod);
  const accountOptions = useMemo(
    () => [{ id: "all", label: "Todas las cuentas" }, ...accounts],
    [accounts]
  );

  if (!open || !policy) return null;

  const disabled = (ch: Channel) => ch !== "email";
  const resolvedAccountId = accountOptions.some(a => a.id === accountId)
    ? accountId
    : "all";

  const renderBudgetFields = (period: "monthly" | "annual") => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Cuenta</p>
        <select
          value={resolvedAccountId}
          onChange={e => setAccountId(e.target.value)}
          disabled={loadingAccounts}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
        >
          {accountOptions.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.label}</option>
          ))}
        </select>
        {!loadingAccounts && accountOptions.length === 1 && (
          <p className="text-xs text-amber-600">No hay cuentas disponibles. Conecta una cuenta AWS primero.</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Umbral de alerta ({period === "monthly" ? "mensual" : "anual"})</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ id: "usd", label: "USD" }, { id: "pct", label: "% del presupuesto" }].map(opt => (
            <button
              key={opt.id}
              onClick={() => setThresholdType(opt.id as "usd" | "pct")}
              className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
                ${thresholdType === opt.id ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={0}
          value={thresholdValue}
          onChange={e => setThresholdValue(e.target.value)}
          placeholder={thresholdType === "usd" ? "Ej: 500" : "Ej: 80"}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <p className="text-xs text-slate-500">
          {thresholdType === "usd"
            ? "Se disparará cuando el gasto supere este monto en USD."
            : "Se disparará al superar este % del presupuesto definido."}
        </p>
      </div>
    </div>
  );

  const renderAnomalyFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Cuenta</p>
        <select
          value={resolvedAccountId}
          onChange={e => setAccountId(e.target.value)}
          disabled={loadingAccounts}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
        >
          {accountOptions.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.label}</option>
          ))}
        </select>
        {!loadingAccounts && accountOptions.length === 1 && (
          <p className="text-xs text-amber-600">No hay cuentas disponibles. Conecta una cuenta AWS primero.</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Variación anómala</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ id: "daily", label: "Diaria" }, { id: "weekly", label: "Semanal" }].map(opt => (
            <button
              key={opt.id}
              onClick={() => setWindowSize(opt.id as "daily" | "weekly" | "monthly" | "annual")}
              className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
                ${windowSize === opt.id ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="number"
          min={0}
          value={thresholdValue}
          onChange={e => setThresholdValue(e.target.value)}
          placeholder="Ej: 30 (% sobre promedio)"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <p className="text-xs text-slate-500">
          Se disparará si el gasto {windowSize === "daily" ? "diario" : "semanal"} supera este porcentaje sobre el promedio histórico.
        </p>
      </div>
    </div>
  );

  const renderFields = () => {
    if (!policy) return null;
    if (policy.id === "budget-monthly") return renderBudgetFields("monthly");
    if (policy.id === "budget-annual") return renderBudgetFields("annual");
    if (policy.id === "anomaly-spike") return renderAnomalyFields();
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Configuración detallada próximamente para &quot;{policy.title}&quot;.
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Configurar política</p>
            <h3 className="text-xl font-bold text-slate-900">{policy.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{policy.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Notificar vía</p>
          <div className="grid grid-cols-3 gap-3">
            {["email", "slack", "teams"].map((ch) => {
              const isDisabled = disabled(ch as Channel) && ch !== "email";
              const labels: Record<Channel, string> = {
                email: "Correo",
                slack: "Slack (Próximamente)",
                teams: "Teams (Próximamente)",
              };
              return (
                <button
                  key={ch}
                  disabled={isDisabled}
                  onClick={() => setChannel(ch as Channel)}
                  className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
                    ${channel === ch ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700"}
                    ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:border-slate-400"}`}
                >
                  {labels[ch as Channel]}
                </button>
              );
            })}
          </div>
        </div>

        {channel === "email" && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Correo de notificación</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: alertas@empresa.com"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            <p className="text-xs text-slate-500">Recibirás un correo cuando la alerta se dispare con el estado y detalles.</p>
          </div>
        )}

        {renderFields()}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!policy) return;
              const accountLabel = resolvedAccountId === "all"
                ? "Todas las cuentas"
                : accountOptions.find(a => a.id === resolvedAccountId)?.label || "Cuenta seleccionada";
              const destination = channel === "email"
                ? (email || "Sin correo configurado")
                : channel === "slack"
                  ? "Grupo o canal de Slack"
                  : "Grupo o canal de Teams";
              const thresholdLabel = thresholdValue || "-";
              onSave({
                dbId: initialValues?.dbId,
                policyId: policy.id,
                title: policy.title,
                account: accountLabel,
                channel,
                destination,
                threshold: thresholdLabel,
                thresholdType: thresholdType === "usd" ? "USD" : "%",
                period: policy.id === "budget-monthly"
                  ? "monthly"
                  : policy.id === "budget-annual"
                    ? "annual"
                    : windowSize,
                email: email || undefined,
                aws_account_id: resolvedAccountId === "all" ? undefined : resolvedAccountId,
              });
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
