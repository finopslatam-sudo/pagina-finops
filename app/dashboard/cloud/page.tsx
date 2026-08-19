'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AwsIntegrationPage from "../aws/page";
import AzureIntegrationPage from "../azure/page";
import GcpIntegrationPage from "../gcp/page";

type Provider = "aws" | "azure" | "gcp";

const PROVIDERS: { key: Provider; label: string; icon: string }[] = [
  { key: "aws", label: "AWS", icon: "🟠" },
  { key: "azure", label: "Azure", icon: "🔷" },
  { key: "gcp", label: "GCP", icon: "🔴" },
];

export default function CloudIntegrationsPage() {
  const { isOwner, isAuthReady } = useAuth();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider>("aws");

  useEffect(() => {
    if (isAuthReady && !isOwner) {
      router.replace("/dashboard");
    }
  }, [isAuthReady, isOwner, router]);

  if (!isAuthReady || !isOwner) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8">

      {/* HERO + PROVIDER TABS */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-3xl p-6 lg:p-10 shadow-lg">
        <h1 className="text-2xl lg:text-3xl font-bold">☁️ Integraciones Cloud</h1>
        <p className="text-slate-300 mt-2 max-w-2xl text-sm leading-relaxed">
          Conecta tus cuentas de AWS, Azure y GCP en un solo lugar. Cada proveedor usa acceso
          de solo lectura — nunca se otorgan permisos de escritura sobre tu infraestructura.
        </p>

        <div className="flex gap-2 mt-6">
          {PROVIDERS.map((p) => (
            <button
              key={p.key}
              onClick={() => setProvider(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                provider === p.key
                  ? "bg-white text-slate-900 border-white"
                  : "bg-white/10 text-slate-200 border-white/20 hover:bg-white/20"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE PROVIDER PANEL */}
      {provider === "aws" && <AwsIntegrationPage />}
      {provider === "azure" && <AzureIntegrationPage />}
      {provider === "gcp" && <GcpIntegrationPage />}

    </div>
  );
}
