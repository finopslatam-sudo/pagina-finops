"use client";

import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  policy?: {
    title: string;
    category: string;
    description: string;
  };
}

type Channel = "email" | "slack" | "teams";

export default function PolicyModal({ open, onClose, policy }: Props) {
  const [channel, setChannel] = useState<Channel>("email");
  const [email, setEmail] = useState("");
  const [accountScope, setAccountScope] = useState<"all" | "one">("all");
  const [accountId, setAccountId] = useState("");
  const [thresholdType, setThresholdType] = useState<"usd" | "pct">("pct");
  const [thresholdValue, setThresholdValue] = useState("");
  const [windowSize, setWindowSize] = useState<"daily" | "weekly" | "monthly" | "annual">("monthly");

  useEffect(() => {
    if (open) {
      setChannel("email");
      setEmail("");
      setAccountScope("all");
      setAccountId("");
      setThresholdType("pct");
      setThresholdValue("");
      setWindowSize("monthly");
    }
  }, [open]);

  if (!open || !policy) return null;

  const disabled = (ch: Channel) => ch !== "email";

  const renderBudgetFields = (period: "monthly" | "annual") => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Cuenta</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ id: "all", label: "Todas las cuentas" }, { id: "one", label: "Filtrar por cuenta" }].map(opt => (
            <button
              key={opt.id}
              onClick={() => setAccountScope(opt.id as "all" | "one")}
              className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
                ${accountScope === opt.id ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {accountScope === "one" && (
          <input
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
            placeholder="ID o nombre de la cuenta AWS"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
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
        <div className="grid grid-cols-2 gap-3">
          {[{ id: "all", label: "Todas las cuentas" }, { id: "one", label: "Filtrar por cuenta" }].map(opt => (
            <button
              key={opt.id}
              onClick={() => setAccountScope(opt.id as "all" | "one")}
              className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
                ${accountScope === opt.id ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {accountScope === "one" && (
          <input
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
            placeholder="ID o nombre de la cuenta AWS"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
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
        Configuración detallada próximamente para "{policy.title}".
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 space-y-4">
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
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
