'use client';

interface Props {
  awsAccounts: number;
  awsAccountsLimit: number;
}

export default function AwsAccountsCard({ awsAccounts, awsAccountsLimit }: Props) {
  const percentage =
    awsAccountsLimit > 0 ? Math.min((awsAccounts / awsAccountsLimit) * 100, 100) : 0;

  const isNearLimit = percentage >= 80;

  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      <h2 className="text-xl font-semibold">Cuentas AWS conectadas</h2>

      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-emerald-600">{awsAccounts}</span>
        <span className="text-gray-400 text-lg pb-1">/ {awsAccountsLimit}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${
            isNearLimit ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-500">
        {awsAccountsLimit > 0
          ? `${awsAccounts} de ${awsAccountsLimit} cuentas utilizadas`
          : "Sin límite de cuentas"}
      </p>

      {isNearLimit && awsAccountsLimit > 0 && (
        <p className="text-xs text-amber-600 font-medium">
          ⚠️ Estás cerca del límite de cuentas AWS de tu plan.
        </p>
      )}
    </div>
  );
}
