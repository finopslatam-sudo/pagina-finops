'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useAzureConnection } from "./hooks/useAzureConnection";
import ConnectionStatus from "./components/ConnectionStatus";
import ConnectionForm from "./components/ConnectionForm";

export default function AzureIntegrationPage() {
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
    form,
    error,
    accountLimitReached,
    setShowConnectionFlow,
    setForm,
    handleValidateConnection,
    runAudit,
    deleteAccount,
  } = useAzureConnection();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-10 lg:space-y-14">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-3xl p-6 lg:p-10 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Azure Integration</h1>
        <p className="text-gray-600 mt-4 max-w-4xl leading-relaxed text-base lg:text-lg">
          Conecta tu suscripción de Azure de forma segura mediante un Service Principal
          de solo lectura (rol <span className="font-mono">Reader</span>). Esta integración
          permite analizar recursos, detectar riesgos FinOps y descubrir oportunidades de
          optimización de costos en tu infraestructura Azure.
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
          form={form}
          loading={loading}
          error={error}
          onChange={setForm}
          onValidate={handleValidateConnection}
        />
      )}

    </div>
  );
}
