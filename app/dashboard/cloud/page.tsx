'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useCloud } from "../context/CloudContext";
import AwsIntegrationFlow from "../aws/components/AwsIntegrationFlow";
import AzureIntegrationFlow from "../azure/components/AzureIntegrationFlow";
import GcpIntegrationFlow from "../gcp/components/GcpIntegrationFlow";

type Provider = "aws" | "azure" | "gcp";

interface ProviderMeta {
  key: Provider;
  name: string;
  fullName: string;
  icon: string;
  authModel: string;
  themeColor: string;
  badgeBg: string;
}

const PROVIDERS_META: ProviderMeta[] = [
  {
    key: "aws",
    name: "AWS",
    fullName: "Amazon Web Services",
    icon: "🟠",
    authModel: "IAM Role con ExternalId seguro",
    themeColor: "from-orange-500/10 to-amber-500/5 border-orange-200",
    badgeBg: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    key: "azure",
    name: "Azure",
    fullName: "Microsoft Azure",
    icon: "🔷",
    authModel: "Service Principal (Rol Reader)",
    themeColor: "from-blue-500/10 to-sky-500/5 border-blue-200",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    key: "gcp",
    name: "GCP",
    fullName: "Google Cloud Platform",
    icon: "🔴",
    authModel: "Service Account (Rol Viewer)",
    themeColor: "from-red-500/10 to-rose-500/5 border-red-200",
    badgeBg: "bg-red-100 text-red-800 border-red-200",
  },
];

export default function CloudIntegrationsPage() {
  const { isOwner, isAuthReady } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clouds, loading } = useCloud();

  const initialParam = searchParams.get("provider") as Provider | null;
  const validInitial: Provider =
    initialParam === "aws" || initialParam === "azure" || initialParam === "gcp"
      ? initialParam
      : "aws";

  const [activeProvider, setActiveProvider] = useState<Provider>(validInitial);

  useEffect(() => {
    if (isAuthReady && !isOwner) {
      router.replace("/dashboard");
    }
  }, [isAuthReady, isOwner, router]);

  useEffect(() => {
    const p = searchParams.get("provider") as Provider | null;
    if (p === "aws" || p === "azure" || p === "gcp") {
      setActiveProvider(p);
    }
  }, [searchParams]);

  if (!isAuthReady || !isOwner) return null;

  const totalConnected =
    (clouds.aws.isConfigured ? 1 : 0) +
    (clouds.azure.isConfigured ? 1 : 0) +
    (clouds.gcp.isConfigured ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-12">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         1. HERO MULTI-CLOUD CENTRALIZADO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 lg:p-10 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-slate-300 mb-3 border border-white/10">
              <span>☁️</span>
              <span>Centro de Conectividad Multi-Cloud</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Integraciones Cloud
            </h1>
            <p className="text-slate-300 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Conecta y centraliza tus cuentas de AWS, Microsoft Azure y Google Cloud Platform.
              Todas las integraciones operan con acceso de solo lectura (mínimo privilegio),
              sin permisos de escritura ni modificación de tu infraestructura.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center shrink-0 self-start md:self-auto">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Nubes Conectadas
            </span>
            <span className="text-3xl font-bold text-white mt-1 block">
              {loading ? "..." : `${totalConnected} de 3`}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium block mt-0.5">
              ● Monitoreo activo
            </span>
          </div>
        </div>

        {/* Pilares de seguridad */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="text-emerald-400 text-sm">🔒</span>
            <span>Acceso 100% de solo lectura</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="text-sky-400 text-sm">🛡️</span>
            <span>Credenciales cifradas con Fernet</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="text-amber-400 text-sm">🔄</span>
            <span>Auditorías automáticas periódicas</span>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         2. 3 CARDS EQUITATIVAS DE NUBES (AWS, AZURE, GCP)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {PROVIDERS_META.map((meta) => {
          const info = clouds[meta.key];
          const isSelected = activeProvider === meta.key;
          const isConfigured = info?.isConfigured ?? false;
          const count = info?.accountsCount ?? 0;
          const limit = info?.accountsLimit ?? 10;
          const label = info?.accountLabel ?? "cuentas";

          return (
            <div
              key={meta.key}
              onClick={() => setActiveProvider(meta.key)}
              className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "bg-white border-blue-600 shadow-lg ring-4 ring-blue-500/10"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{meta.name}</h3>
                      <p className="text-xs text-slate-500">{meta.fullName}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      isConfigured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {isConfigured ? "● Conectada" : "○ Sin conectar"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {meta.authModel}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {count} de {limit} {label}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProvider(meta.key);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? "Configurando" : "Configurar →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         3. PANEL ACTIVO DEL PROVEEDOR SELECCIONADO
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl">
              {activeProvider === "aws" ? "🟠" : activeProvider === "azure" ? "🔷" : "🔴"}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Integración con {activeProvider.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-500">
                Sigue los pasos a continuación para conectar o administrar tus cuentas.
              </p>
            </div>
          </div>
        </div>

        {activeProvider === "aws" && <AwsIntegrationFlow hideHero={true} />}
        {activeProvider === "azure" && <AzureIntegrationFlow hideHero={true} />}
        {activeProvider === "gcp" && <GcpIntegrationFlow hideHero={true} />}
      </div>
    </div>
  );
}
