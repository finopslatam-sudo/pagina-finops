'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useAwsAccounts } from '@/app/dashboard/hooks/useAwsAccounts';
import { hasFeature } from '@/app/lib/hasFeature';
import { useAlertPolicies } from './hooks/useAlertPolicies';
import PolicyModal from './policyModal';
import AlertasHero from './components/AlertasHero';
import AlertasPolicyGrid from './components/AlertasPolicyGrid';
import AlertasChannels from './components/AlertasChannels';
import AlertasHistoryTable from './components/AlertasHistoryTable';
import type { PolicyCard } from './policies';

export default function AlertasPage() {
  const { user } = useAuth();
  const { accounts: awsAccounts, loading: loadingAccounts } = useAwsAccounts();
  const [activeCategory, setActiveCategory] = useState('Todas');

  const {
    history,
    selectedPolicy,
    editingEntry,
    showModal,
    handleClose,
    handleEdit,
    handleDelete,
    handleSave,
    openNew,
  } = useAlertPolicies();

  if (!hasFeature(user?.plan_code, 'alertas')) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center gap-6 text-center">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800">Módulo no disponible en tu plan actual</h2>
        <p className="text-slate-500 max-w-md leading-relaxed">
          Las Políticas &amp; Alertas avanzadas de presupuesto, consumo y gobernanza no están habilitadas para tu suscripción actual.
        </p>
        <a
          href="/dashboard/ClientAdministration"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-700 transition"
        >
          Ver planes disponibles →
        </a>
      </div>
    );
  }

  const configuredChannels = new Set(history.map(item => item.channel)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-10">
      <AlertasHero historyCount={history.length} configuredChannels={configuredChannels} />

      <AlertasPolicyGrid
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onConfigure={(policy: PolicyCard) => openNew(policy)}
      />

      <AlertasChannels />

      <AlertasHistoryTable history={history} onEdit={handleEdit} onDelete={handleDelete} />

      <PolicyModal
        key={`${editingEntry?.dbId ?? selectedPolicy?.id ?? 'policy-modal'}-${showModal ? 'open' : 'closed'}`}
        open={showModal}
        policy={selectedPolicy}
        initialValues={editingEntry ? {
          dbId: editingEntry.dbId,
          channel: editingEntry.channel,
          email: editingEntry.email,
          threshold: editingEntry.threshold,
          thresholdType: editingEntry.thresholdType,
          period: editingEntry.period,
          aws_account_id: editingEntry.aws_account_id,
        } : undefined}
        onClose={handleClose}
        onSave={handleSave}
        accounts={awsAccounts.map(acc => ({
          id: String(acc.id),
          label: acc.account_name || acc.account_id || `Cuenta ${acc.id}`,
        }))}
        loadingAccounts={loadingAccounts}
      />
    </div>
  );
}
