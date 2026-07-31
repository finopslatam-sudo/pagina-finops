'use client';

import { Subscription } from "../types";

interface Props {
  subscription: Subscription | null;
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
      <span>{text}</span>
    </div>
  );
}

export default function SubscriptionCard({ subscription }: Props) {
  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <h2 className="text-xl font-semibold">Plan de suscripción</h2>

      {subscription ? (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-gray-500">Plan actual</p>
            <p className="text-2xl font-bold text-blue-700">{subscription.plan_name}</p>
          </div>

          <div className="space-y-2 text-sm">
            <Feature text="Findings & Optimization" />
            <Feature text="Risk & Assets" />
            <Feature text="Cost & Financials" />
            <Feature text="RI & Savings Plans" />
            <Feature text="Governance" />
            <Feature text="Informes Ejecutivos" />
            <Feature text="Políticas & Alertas" />
            <Feature text="AWS Integration" />
            <Feature text="Organization Settings" />
            <Feature text="Hasta 10 cuentas AWS" />
            <Feature text="Hasta 12 usuarios" />
          </div>
        </>
      ) : (
        <p className="text-gray-400">No hay plan activo</p>
      )}
    </div>
  );
}
