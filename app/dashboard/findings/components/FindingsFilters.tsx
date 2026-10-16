"use client";

import { useFindingServices } from "../hooks/useFindingServices";
import { useCloud } from "@/app/dashboard/context/CloudContext";

interface Props {
  provider?: string;
  severity: string;
  status: string;
  search: string;
  service: string;
  account: number | string | "";
  region: string;
  availableRegions: string[];

  onChange: (filters: {
    provider?: string;
    severity?: string;
    status?: string;
    search?: string;
    service?: string;
    account?: number | string | "";
    region?: string;
  }) => void;
}

export default function FindingsFilters({
  provider = "",
  severity,
  status,
  search,
  service,
  account,
  region,
  availableRegions,
  onChange,
}: Props) {
  const services = useFindingServices();
  const { clouds } = useCloud();
  const regions = availableRegions || [];

  // Proveedores con su estado de configuración
  const providerOptions = [
    { key: "", label: "Todas las nubes", icon: "🌐" },
    {
      key: "aws",
      label: `AWS (${clouds.aws.isConfigured ? `${clouds.aws.accountsCount} ctas` : 'Sin configurar'})`,
      icon: "🟠",
    },
    {
      key: "azure",
      label: `Azure (${clouds.azure.isConfigured ? `${clouds.azure.accountsCount} subs` : 'Sin configurar'})`,
      icon: "🔷",
    },
    {
      key: "gcp",
      label: `GCP (${clouds.gcp.isConfigured ? `${clouds.gcp.accountsCount} projs` : 'Sin configurar'})`,
      icon: "🔴",
    },
  ];

  // Cuentas según el proveedor seleccionado
  const availableAccounts =
    provider === "aws"
      ? clouds.aws.accounts
      : provider === "azure"
      ? clouds.azure.accounts
      : provider === "gcp"
      ? clouds.gcp.accounts
      : [
          ...clouds.aws.accounts,
          ...clouds.azure.accounts,
          ...clouds.gcp.accounts,
        ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 space-y-4">
      {/* ── SELECTOR RÁPIDO DE NUBE CONFIGURADA ── */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">
          Nube:
        </span>
        {providerOptions.map((p) => {
          const isSelected = provider === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                onChange({ provider: p.key, account: "" });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── GRID DE FILTROS ESPECÍFICOS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Service */}
        <select
          value={service}
          onChange={(e) => onChange({ service: e.target.value })}
          className="border border-slate-300 p-2 rounded-lg text-sm bg-white"
        >
          <option value="">Todos los servicios</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Account / Subscription / Project */}
        <select
          value={account}
          onChange={(e) =>
            onChange({
              account: e.target.value === "" ? "" : e.target.value,
            })
          }
          className="border border-slate-300 p-2 rounded-lg text-sm bg-white"
        >
          <option value="">
            {provider === "aws"
              ? "Todas las cuentas AWS"
              : provider === "azure"
              ? "Todas las suscripciones Azure"
              : provider === "gcp"
              ? "Todos los proyectos GCP"
              : "Todas las cuentas"}
          </option>
          {availableAccounts.map((a) => (
            <option key={`${a.provider}-${a.id}`} value={a.id}>
              {a.provider.toUpperCase()} · {a.name}
            </option>
          ))}
        </select>

        {/* Severity */}
        <select
          value={severity}
          onChange={(e) => onChange({ severity: e.target.value })}
          className="border border-slate-300 p-2 rounded-lg text-sm bg-white"
        >
          <option value="">Todas las severidades</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Media</option>
          <option value="LOW">Baja</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="border border-slate-300 p-2 rounded-lg text-sm bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="resolved">Resuelto</option>
        </select>

        {/* Region */}
        <select
          value={region}
          onChange={(e) => onChange({ region: e.target.value })}
          className="border border-slate-300 p-2 rounded-lg text-sm bg-white"
        >
          <option value="">Todas las regiones</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar recurso o tipo..."
          value={search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="border border-slate-300 p-2 rounded-lg text-sm"
        />
      </div>
    </div>
  );
}