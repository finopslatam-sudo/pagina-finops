'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { hasFeature } from '@/app/lib/hasFeature';
import { useAwsAccounts } from '@/app/dashboard/hooks/useAwsAccounts';
import PolicyModal from './policyModal';
import { POLICIES, STATUS_CONFIG, CATEGORIES, PolicyCard } from './policies';

type ChannelType = 'email' | 'slack' | 'teams';

type HistoryEntry = {
  dbId?: string;
  policyId: string;
  title: string;
  account: string;
  channel: ChannelType;
  destination: string;
  threshold: string;
  thresholdType: string;
  period?: string;
  email?: string;
  aws_account_id?: string;
  createdAt?: string;
};

type AlertPolicyApiItem = {
  id?: number | string;
  policy_id?: string;
  title: string;
  channel: string;
  threshold?: number | null;
  threshold_type?: string | null;
  period?: string;
  email?: string;
  aws_account_id?: number | string | null;
  created_at?: string | null;
  account?: {
    account_name?: string;
    account_id?: string;
  } | null;
  account_name?: string | null;
  aws_account_name?: string | null;
  aws_account_number?: string | null;
};

type AlertPoliciesResponse = {
  data?: AlertPolicyApiItem[];
  policies?: AlertPolicyApiItem[];
};

type AlertPolicyMutationResponse = {
  data?: AlertPolicyApiItem;
  policy?: AlertPolicyApiItem;
};

const CHANNEL_LABELS: Record<ChannelType, string> = {
  email: 'Correo',
  slack: 'Slack',
  teams: 'Teams',
};

const PERIOD_LABELS: Record<string, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  monthly: 'Mensual',
  annual: 'Anual',
};

function getDestination(channel: string, email?: string | null) {
  if (channel === 'email') return email || 'Sin correo configurado';
  if (channel === 'slack') return 'Grupo o canal de Slack';
  return 'Grupo o canal de Teams';
}

function toHistoryEntry(item: AlertPolicyApiItem): HistoryEntry {
  const channel = (item.channel === 'slack' || item.channel === 'teams' ? item.channel : 'email') as ChannelType;

  return {
    dbId: item.id != null ? String(item.id) : undefined,
    policyId: item.policy_id || String(item.id || ''),
    title: item.title,
    account: item.account?.account_name
      || item.account_name
      || item.aws_account_name
      || item.account?.account_id
      || item.aws_account_number
      || 'Todas las cuentas',
    channel,
    destination: getDestination(channel, item.email),
    threshold: item.threshold != null ? String(item.threshold) : '-',
    thresholdType: item.threshold_type || '',
    period: item.period,
    email: item.email,
    aws_account_id: item.aws_account_id ? String(item.aws_account_id) : undefined,
    createdAt: item.created_at || undefined,
  };
}

function getPolicyDefinition(policyId: string, title: string): PolicyCard {
  const existing = POLICIES.find(policy => policy.id === policyId);
  if (existing) return existing;

  return {
    id: policyId,
    category: 'Configurada',
    icon: '🔔',
    title,
    description: 'Edita la configuración de esta política creada anteriormente.',
    examples: [],
    status: 'active',
    color: 'bg-slate-50',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-700',
  };
}

export default function AlertasPage() {
  const { user, token } = useAuth();
  const { accounts: awsAccounts, loading: loadingAccounts } = useAwsAccounts();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyCard | undefined>();
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await apiFetch<AlertPoliciesResponse>('/api/client/alert-policies/', { token });
        const items = res.data || res.policies || [];
        setHistory(items.map(toHistoryEntry));
      } catch (err) {
        console.error('No se pudo cargar el historial de políticas', err);
      }
    };
    load();
  }, [token]);

  const handleClose = () => {
    setShowModal(false);
    setSelectedPolicy(undefined);
    setEditingEntry(undefined);
  };

  const handleEdit = (entry: HistoryEntry) => {
    setEditingEntry(entry);
    setSelectedPolicy(getPolicyDefinition(entry.policyId, entry.title));
    setShowModal(true);
  };

  const handleDelete = async (entry: HistoryEntry) => {
    if (!token) return;
    if (!window.confirm(`¿Deseas eliminar la política "${entry.title}"?`)) return;

    const previous = history;
    setHistory(prev => prev.filter(item => item.dbId !== entry.dbId));

    if (!entry.dbId) return;

    try {
      await apiFetch(`/api/client/alert-policies/${entry.dbId}`, {
        method: 'DELETE',
        token,
      });
    } catch (err) {
      console.error('No se pudo eliminar la política', err);
      setHistory(previous);
    }
  };

  const handleSave = async (data: {
    dbId?: string;
    policyId: string;
    title: string;
    account: string;
    channel: string;
    destination: string;
    threshold: string;
    thresholdType: string;
    period?: string;
    email?: string;
    aws_account_id?: string;
  }) => {
    if (!token) return;

    try {
      const res = await apiFetch<AlertPolicyMutationResponse>(
        data.dbId ? `/api/client/alert-policies/${data.dbId}` : '/api/client/alert-policies/',
        {
          method: data.dbId ? 'PUT' : 'POST',
          token,
          body: {
            policy_id: data.policyId,
            title: data.title,
            channel: data.channel,
            email: data.email,
            threshold: data.threshold,
            threshold_type: data.thresholdType,
            period: data.period,
            aws_account_id: data.aws_account_id,
          },
        }
      );

      const savedItem = res.data || res.policy;
      const nextEntry = savedItem
        ? toHistoryEntry(savedItem)
        : {
            dbId: data.dbId,
            policyId: data.policyId,
            title: data.title,
            account: data.account,
            channel: (data.channel === 'slack' || data.channel === 'teams' ? data.channel : 'email') as ChannelType,
            destination: data.destination,
            threshold: data.threshold,
            thresholdType: data.thresholdType,
            period: data.period,
            email: data.email,
            aws_account_id: data.aws_account_id,
          };

      setHistory(prev => {
        if (nextEntry.dbId) {
          const exists = prev.some(item => item.dbId === nextEntry.dbId);
          if (exists) {
            return prev.map(item => (item.dbId === nextEntry.dbId ? nextEntry : item));
          }
        }
        return [nextEntry, ...prev].slice(0, 20);
      });

      handleClose();
    } catch (err) {
      console.error('No se pudo persistir la política', err);
    }
  };

  if (!hasFeature(user?.plan_code, 'alertas')) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center gap-6 text-center">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800">Módulo no disponible en tu plan actual</h2>
        <p className="text-slate-500 max-w-md leading-relaxed">
          Las Políticas & Alertas avanzadas de presupuesto, consumo y gobernanza no están habilitadas para tu suscripción actual.
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

  const filtered = activeCategory === 'Todas' ? POLICIES : POLICIES.filter(p => p.category === activeCategory);
  const configuredChannels = new Set(history.map(item => item.channel)).size;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">
      <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-10 shadow-md text-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold">Políticas & Alertas</h1>
            <p className="text-slate-700 mt-3 max-w-3xl leading-relaxed">
              Define reglas de presupuesto, alertas de consumo, detección de anomalías y políticas de gobernanza para mantener control total sobre el gasto cloud de tu organización.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button onClick={() => setShowComingSoon(true)} className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition text-sm shadow">
              + Nueva Política
            </button>
            <span className="text-xs text-slate-500">9 tipos de políticas disponibles</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Políticas configuradas', value: String(history.length), icon: '📋' },
            { label: 'Alertas activas', value: String(history.length), icon: '🔔' },
            { label: 'Alertas disparadas hoy', value: '0', icon: '⚡' },
            { label: 'Canales de notificación', value: String(configuredChannels), icon: '📨' },
          ].map(s => (
            <div key={s.label} className="bg-white/80 border border-white/70 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-800">{s.icon} {s.value}</div>
              <div className="text-xs text-slate-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {showComingSoon && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl">🚧</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Configuración de políticas en desarrollo</p>
            <p className="text-sm text-amber-700 mt-1">El módulo de creación y gestión de alertas estará disponible en la próxima versión de la plataforma.</p>
          </div>
          <button onClick={() => setShowComingSoon(false)} className="text-amber-600 hover:text-amber-800 font-bold text-lg">×</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${activeCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(policy => {
          const statusCfg = STATUS_CONFIG[policy.status];
          return (
            <div key={policy.id} className={`${policy.color} ${policy.borderColor} border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{policy.icon}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${policy.badgeColor}`}>{policy.category}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.color}`}>{statusCfg.label}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-base">{policy.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{policy.description}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Ejemplos de uso</p>
                <ul className="space-y-1">
                  {policy.examples.map((ex, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => { setSelectedPolicy(policy); setEditingEntry(undefined); setShowModal(true); }} className="mt-2 w-full py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition">
                Configurar política
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Canales de Notificación</h2>
        <p className="text-sm text-slate-500 mb-6">Configura los destinos donde se enviarán las alertas cuando se dispare una política.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: '📧', label: 'Email', desc: 'Notificación directa por correo', status: null },
            { icon: '💬', label: 'Slack', desc: 'Alertas en canales de Slack', status: 'Próximamente' },
            { icon: '👥', label: 'Teams', desc: 'Alertas en Microsoft Teams', status: 'Próximamente' },
          ].map(ch => (
            <div key={ch.label} className="border border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center text-center gap-2 hover:border-slate-500 hover:bg-slate-50 transition cursor-pointer" onClick={() => setShowComingSoon(true)}>
              <span className="text-3xl">{ch.icon}</span>
              <span className="font-semibold text-slate-700 text-sm">{ch.label}</span>
              <span className="text-xs text-slate-400">{ch.desc}</span>
              {ch.status && (<span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{ch.status}</span>)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Historial de políticas creadas</h2>
            <p className="text-sm text-slate-500">Vista tabular para revisar y administrar políticas sin que la sección crezca demasiado.</p>
          </div>
          <span className="text-xs text-slate-500">{history.length} en total</span>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">Aún no has guardado ninguna política.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-[1100px] w-full border-collapse">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Política</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Cuenta</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Canal</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Destino</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Periodicidad</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Umbral</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Creada</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.dbId || `${item.policyId}-${item.createdAt || item.title}`} className="border-t border-slate-200 align-top hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.policyId}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{item.account}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {CHANNEL_LABELS[item.channel]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 break-all">{item.destination}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{item.period ? PERIOD_LABELS[item.period] || item.period : 'No definida'}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">{item.threshold} {item.thresholdType}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('es-CL') : 'Persistida'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
