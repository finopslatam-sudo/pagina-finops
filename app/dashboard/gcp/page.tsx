'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useGcpConnection } from "./hooks/useGcpConnection";
import ConnectionStatus from "./components/ConnectionStatus";
import ConnectionForm from "./components/ConnectionForm";

export default function GcpIntegrationPage() {
  const { isOwner, isAuthReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthReady && !isOwner) {
      router.replace("/dashboard");
    }
  }, [isAuthReady, isOwner, router]);

  if (!isAuthReady || !isOwner) return null;

  const {
    loading,
    accounts,
    accountLimit,
    status,
    showConnectionFlow,
    serviceAccountKey,
    error,
    accountLimitReached,
    setShowConnectionFlow,
    setServiceAccountKey,
    handleValidateConnection,
    runAudit,
    deleteAccount,
  } = useGcpConnection();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-10 lg:space-y-14">

      {/* HERO */}
      <div className="bg-gradient-to-r from-red-50 via-white to-white border border-red-200 rounded-3xl p-6 lg:p-10 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">GCP Integration</h1>
        <p className="text-gray-600 mt-4 max-w-4xl leading-relaxed text-base lg:text-lg">
          Conecta tu proyecto de Google Cloud de forma segura mediante una Service Account
          de solo lectura (rol <span className="font-mono">Viewer</span>). Esta integración
          permite analizar recursos, detectar riesgos FinOps y descubrir oportunidades de
          optimización de costos en tu infraestructura GCP.
        </p>
      </div>

      <ConnectionStatus
        status={status}
        accounts={accounts}
        accountLimit={accountLimit}
        accountLimitReached={accountLimitReached}
        loading={loading}
        onRunAudit={runAudit}
        onAddAccount={() => setShowConnectionFlow(true)}
        onDelete={deleteAccount}
      />

      {showConnectionFlow && (
        <ConnectionForm
          serviceAccountKey={serviceAccountKey}
          loading={loading}
          error={error}
          onChange={setServiceAccountKey}
          onValidate={handleValidateConnection}
        />
      )}

    </div>
  );
}
