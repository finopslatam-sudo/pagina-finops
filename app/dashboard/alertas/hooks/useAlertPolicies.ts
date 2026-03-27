import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { toHistoryEntry, getPolicyDefinition } from '../utils';
import type { HistoryEntry, AlertPoliciesResponse, AlertPolicyMutationResponse, SavePayload } from '../types';
import type { PolicyCard } from '../policies';

export function useAlertPolicies() {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyCard | undefined>();
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | undefined>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiFetch<AlertPoliciesResponse>('/api/client/alert-policies/', { token })
      .then(res => setHistory((res.data || res.policies || []).map(toHistoryEntry)))
      .catch(err => console.error('No se pudo cargar el historial de políticas', err));
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
      await apiFetch(`/api/client/alert-policies/${entry.dbId}`, { method: 'DELETE', token });
    } catch (err) {
      console.error('No se pudo eliminar la política', err);
      setHistory(previous);
    }
  };

  const handleSave = async (data: SavePayload) => {
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
      const nextEntry: HistoryEntry = savedItem
        ? toHistoryEntry(savedItem)
        : {
            dbId: data.dbId,
            policyId: data.policyId,
            title: data.title,
            account: data.account,
            channel: (data.channel === 'slack' || data.channel === 'teams' ? data.channel : 'email') as HistoryEntry['channel'],
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
          if (exists) return prev.map(item => (item.dbId === nextEntry.dbId ? nextEntry : item));
        }
        return [nextEntry, ...prev].slice(0, 20);
      });
      handleClose();
    } catch (err) {
      console.error('No se pudo persistir la política', err);
    }
  };

  const openNew = (policy: PolicyCard) => {
    setSelectedPolicy(policy);
    setEditingEntry(undefined);
    setShowModal(true);
  };

  return { history, selectedPolicy, editingEntry, showModal, handleClose, handleEdit, handleDelete, handleSave, openNew };
}
