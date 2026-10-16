"use client";

import { useMemo, useState } from "react";
import { useCloud } from "../context/CloudContext";
import { PolicyCard } from "./policies";
import { renderPolicyFields } from "./policyFields";

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
    provider?: string;
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
  accounts?: { id: string; label: string }[];
  loadingAccounts?: boolean;
}

type Channel = "email" | "slack" | "teams";

const FIXED_PERIODS: Record<string, string> = {
  "budget-monthly": "monthly",
  "budget-annual": "annual",
  "service-cost": "monthly",
  "forecast": "monthly",
  "off-hours": "daily",
};

export default function PolicyModal({
  open,
  onClose,
  onSave,
  policy,
  initialValues,
  loadingAccounts = false,
}: Props) {
  const { clouds, selectedProvider: globalProvider } = useCloud();

  const [provider, setProvider] = useState<"all" | "aws" | "azure" | "gcp">(
    globalProvider !== "all" ? globalProvider : "all"
  );

  const initialChannel =
    initialValues?.channel === "slack" || initialValues?.channel === "teams"
      ? initialValues.channel
      : "email";
  const initialThresholdType = initialValues?.thresholdType === "%" ? "pct" : "usd";
  const initialPeriod =
    initialValues?.period === "daily" ||
    initialValues?.period === "weekly" ||
    initialValues?.period === "monthly" ||
    initialValues?.period === "annual"
      ? initialValues.period
      : "daily";

  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [email, setEmail] = useState(initialValues?.email || "");
  const [accountId, setAccountId] = useState(initialValues?.aws_account_id || "all");
  const [thresholdType, setThresholdType] = useState<"usd" | "pct">(initialThresholdType);
  const [thresholdValue, setThresholdValue] = useState(initialValues?.threshold || "");
  const [windowSize, setWindowSize] = useState<"daily" | "weekly" | "monthly" | "annual">(
    initialPeriod
  );

  const accountOptions = useMemo(() => {
    let list: { id: string; label: string }[] = [];
    if (provider === "aws") {
      list = clouds.aws.accounts.map(a => ({ id: String(a.id), label: `${a.name} (${a.identifier})` }));
    } else if (provider === "azure") {
      list = clouds.azure.accounts.map(a => ({ id: String(a.id), label: `${a.name} (${a.identifier})` }));
    } else if (provider === "gcp") {
      list = clouds.gcp.accounts.map(a => ({ id: String(a.id), label: `${a.name} (${a.identifier})` }));
    } else {
      list = [
        ...clouds.aws.accounts.map(a => ({ id: String(a.id), label: `[AWS] ${a.name} (${a.identifier})` })),
        ...clouds.azure.accounts.map(a => ({ id: String(a.id), label: `[Azure] ${a.name} (${a.identifier})` })),
        ...clouds.gcp.accounts.map(a => ({ id: String(a.id), label: `[GCP] ${a.name} (${a.identifier})` })),
      ];
    }
    const defaultLabel =
      provider === "azure"
        ? "Todas las suscripciones Azure"
        : provider === "gcp"
        ? "Todos los proyectos GCP"
        : provider === "aws"
        ? "Todas las cuentas AWS"
        : "Todas las cuentas (Multi-cloud)";

    return [{ id: "all", label: defaultLabel }, ...list];
  }, [clouds, provider]);

  if (!open || !policy) return null;

  const resolvedAccountId = accountOptions.some((a) => a.id === accountId)
    ? accountId
    : "all";

  const handleSave = () => {
    if (!policy) return;
    const accountLabel =
      resolvedAccountId === "all"
        ? "Todas las cuentas"
        : accountOptions.find((a) => a.id === resolvedAccountId)?.label || "Cuenta seleccionada";
    const destination =
      channel === "email"
        ? email || "Sin correo configurado"
        : channel === "slack"
        ? "Grupo o canal de Slack"
        : "Grupo o canal de Teams";

    const period = FIXED_PERIODS[policy.id] ?? windowSize;

    onSave({
      dbId: initialValues?.dbId,
      policyId: policy.id,
      title: policy.title,
      account: accountLabel,
      channel,
      destination,
      threshold: thresholdValue || "-",
      thresholdType: thresholdType === "usd" ? "USD" : "%",
      period,
      email: email || undefined,
      aws_account_id: resolvedAccountId === "all" ? undefined : resolvedAccountId,
      provider: provider === "all" ? undefined : provider,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto flex flex-col">
        {/* Header */}
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

        {/* Cloud Provider Filter */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Proveedor Cloud</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "all", label: "Todas", icon: "🌐" },
              { id: "aws", label: "AWS", icon: "🟠" },
              { id: "azure", label: "Azure", icon: "🔷" },
              { id: "gcp", label: "GCP", icon: "🔴" },
            ].map((p) => {
              const isSelected = provider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProvider(p.id as any);
                    setAccountId("all");
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition ${
                    isSelected
                      ? "border-sky-500 bg-sky-50 text-sky-800 shadow-sm ring-1 ring-sky-400"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Channel selector */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">Notificar vía</p>
          <div className="grid grid-cols-3 gap-3">
            {(["email", "slack", "teams"] as Channel[]).map((ch) => {
              const isDisabled = ch !== "email";
              const labels: Record<Channel, string> = {
                email: "Correo",
                slack: "Slack (Próximamente)",
                teams: "Teams (Próximamente)",
              };
              return (
                <button
                  key={ch}
                  disabled={isDisabled}
                  onClick={() => setChannel(ch)}
                  className={`border rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300
                    ${channel === ch
                      ? "border-sky-500 bg-sky-50 text-sky-800"
                      : "border-slate-200 bg-white text-slate-700"}
                    ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:border-slate-400"}`}
                >
                  {labels[ch]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email input */}
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
            <p className="text-xs text-slate-500">
              Recibirás un correo cuando la alerta se dispare con el estado y detalles.
            </p>
          </div>
        )}

        {/* Policy-specific fields */}
        {renderPolicyFields({
          policy,
          accountOptions,
          resolvedAccountId,
          setAccountId,
          loadingAccounts,
          thresholdType,
          setThresholdType,
          thresholdValue,
          setThresholdValue,
          windowSize,
          setWindowSize,
        })}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
