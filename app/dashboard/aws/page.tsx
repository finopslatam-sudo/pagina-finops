'use client';

import { useAwsConnection } from "./hooks/useAwsConnection";
import ConnectionStatus from "./components/ConnectionStatus";
import ConnectionSteps from "./components/ConnectionSteps";
import AccountForm from "./components/AccountForm";
import StepGuide from "./components/StepGuide";

export default function AwsIntegrationPage() {
  const {
    loading,
    cloudformationUrl,
    externalId,
    accountId,
    accounts,
    accountLimit,
    status,
    copied,
    showConnectionFlow,
    stepsRef,
    templateDownloadUrl,
    accountLimitReached,
    setAccountId,
    setShowConnectionFlow,
    setCopied,
    handleConnectAws,
    handleValidateConnection,
    runAudit,
  } = useAwsConnection();

  const handleAddAccount = () => {
    if (accountLimitReached) return;
    setShowConnectionFlow(true);
    setTimeout(() => {
      stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(externalId ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-10 lg:space-y-14">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-3xl p-6 lg:p-10 shadow-sm">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">AWS Integration</h1>
        <p className="text-gray-600 mt-4 max-w-4xl leading-relaxed text-base lg:text-lg">
          Conecta tu cuenta de AWS de forma segura mediante un rol de solo lectura.
          Esta integración permite analizar recursos, detectar riesgos FinOps y
          descubrir oportunidades de optimización de costos en tu infraestructura cloud.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50 text-sm text-blue-900">
            <p className="font-semibold">Permisos necesarios (Cost Explorer / CUR)</p>
            <p className="mt-2">
              Para calcular cobertura y uso de Reserved Instances y Savings Plans, se requieren permisos de lectura sobre
              Cost Explorer (CE) y/o Cost &amp; Usage Report (CUR), incluyendo acceso a datos de billing. Si no se otorgan estos permisos,
              las secciones de RI y SP se mostrarán vacías.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
            <p className="font-semibold">Cómo habilitarlo</p>
            <p className="mt-2">
              1) Crea o actualiza el rol de solo lectura para FinOpsLatam incluyendo las políticas de Cost Explorer y CUR.{" "}
              2) Asegura que el CUR se publique en S3 con acceso para el rol.{" "}
              3) Vuelve a validar la conexión. Sin estos pasos, los análisis de RI/SP no tendrán datos.
            </p>
          </div>
        </div>
      </div>

      {/* STATUS + ACCOUNTS TABLE */}
      <ConnectionStatus
        status={status}
        accounts={accounts}
        accountLimit={accountLimit}
        accountLimitReached={accountLimitReached}
        loading={loading}
        onRunAudit={runAudit}
        onAddAccount={handleAddAccount}
      />

      {/* CONNECTION FLOW */}
      {showConnectionFlow && (
        <div className="space-y-10">
          <ConnectionSteps stepsRef={stepsRef} />
          <AccountForm
            cloudformationUrl={cloudformationUrl}
            externalId={externalId}
            accountId={accountId}
            copied={copied}
            loading={loading}
            templateDownloadUrl={templateDownloadUrl}
            onAccountIdChange={setAccountId}
            onCopy={handleCopy}
            onConnectAws={handleConnectAws}
            onValidate={handleValidateConnection}
          />
          <StepGuide />
        </div>
      )}

    </div>
  );
}
