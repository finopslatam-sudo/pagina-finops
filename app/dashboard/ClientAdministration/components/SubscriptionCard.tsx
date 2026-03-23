'use client';

import { Subscription } from "../types";

interface Props {
  subscription: Subscription | null;
  upgrading: boolean;
  upgradeSuccess: boolean;
  showUpgradeModal: boolean;
  showProcessingModal: boolean;
  onOpenUpgradeModal: () => void;
  onCloseUpgradeModal: () => void;
  onCloseUpgradeSuccess: () => void;
  onUpgradePlan: (planCode: string) => void;
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
      <span>{text}</span>
    </div>
  );
}

export default function SubscriptionCard({
  subscription,
  upgrading,
  upgradeSuccess,
  showUpgradeModal,
  showProcessingModal,
  onOpenUpgradeModal,
  onCloseUpgradeModal,
  onCloseUpgradeSuccess,
  onUpgradePlan,
}: Props) {
  return (
    <>
      {/* Plan card */}
      <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
        <h2 className="text-xl font-semibold">Plan de suscripción</h2>

        {subscription ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm text-gray-500">Plan actual</p>
              <p className="text-2xl font-bold text-blue-700">{subscription.plan_name}</p>
            </div>

            <div className="space-y-2 text-sm">
              <Feature text="Cost Optimization Insights" />
              <Feature text="Governance & Compliance" />
              <Feature text="FinOps Risk Analysis" />
              <Feature text="Multi-account AWS Support" />
              <Feature text="Panel avanzado de métricas" />
            </div>

            <button
              onClick={onOpenUpgradeModal}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
            >
              🚀 Upgrade Plan
            </button>
          </>
        ) : (
          <p className="text-gray-400">No hay plan activo</p>
        )}
      </div>

      {/* Upgrade selection modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[520px] max-h-[80vh] overflow-y-auto p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upgrade Plan</h2>
              <button
                onClick={onCloseUpgradeModal}
                className="text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 text-sm">
              Mejora tu plan para desbloquear funcionalidades avanzadas de FinOpsLatam.
            </p>

            {subscription?.plan_code === "FINOPS_FOUNDATION" && (
              <div className="border rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">FinOps Professional</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>✔ Governance & Compliance</li>
                  <li>✔ Optimization insights</li>
                  <li>✔ Advanced dashboards</li>
                  <li>✔ Multi-account support</li>
                </ul>
                <button
                  disabled={upgrading}
                  onClick={() => onUpgradePlan("FINOPS_PROFESSIONAL")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {upgrading ? "Procesando..." : "Upgrade"}
                </button>
              </div>
            )}

            {subscription?.plan_code !== "FINOPS_ENTERPRISE" && (
              <div className="border rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">FinOps Enterprise</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>✔ Todo lo incluido en Professional</li>
                  <li>✔ Escaneo completo FinOps</li>
                  <li>✔ Reporting avanzado</li>
                  <li>✔ Máximo nivel de optimización</li>
                </ul>
                <button
                  disabled={upgrading}
                  onClick={() => onUpgradePlan("FINOPS_ENTERPRISE")}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Upgrade
                </button>
              </div>
            )}

            {subscription?.plan_code === "FINOPS_ENTERPRISE" && (
              <div className="text-center text-gray-500">
                🎉 Ya estás utilizando el plan más avanzado. 🎉
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade success modal */}
      {upgradeSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8 text-center space-y-6">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-semibold">Upgrade solicitado con éxito</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Un administrador debe aprobar tu solicitud antes de que el cambio de plan sea
              aplicado.
              <br />
              <br />
              Recibirás un correo cuando el upgrade esté activo.
            </p>
            <button
              onClick={onCloseUpgradeSuccess}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Processing modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[360px] p-8 text-center space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-lg font-semibold">Procesando upgrade...</h2>
            <p className="text-gray-500 text-sm">
              Enviando solicitud de upgrade...
              Un administrador debe aprobar tu solicitud.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
