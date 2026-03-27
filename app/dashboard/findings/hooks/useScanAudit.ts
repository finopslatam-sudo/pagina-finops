import { useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuditStatus } from '../../hooks/useAuditStatus';

type Options = {
  token: string | null;
  onScanComplete: () => Promise<void>;
  onLastScanUpdate: (date: string) => void;
};

export function useScanAudit({ token, onScanComplete, onLastScanUpdate }: Options) {
  const { fetchStatus } = useAuditStatus();
  const [scanModal, setScanModal] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);

  const runAudit = async () => {
    try {
      setRunningAudit(true);
      setScanModal(true);
      await apiFetch('/api/client/audit/run', { method: 'POST', token });

      const poll = async () => {
        const accounts = await fetchStatus();
        const stillRunning = accounts?.some((a: { status: string }) => a.status === 'running');
        if (stillRunning) {
          setTimeout(poll, 5000);
        } else {
          await onScanComplete();
          setScanModal(false);
          setScanSuccess(true);
          onLastScanUpdate(new Date().toISOString());
          setRunningAudit(false);
        }
      };
      setTimeout(poll, 4000);
    } catch (err) {
      console.error(err);
      alert('Error ejecutando auditoría');
      setScanModal(false);
      setRunningAudit(false);
    }
  };

  return { scanModal, scanSuccess, runningAudit, runAudit, closeScanSuccess: () => setScanSuccess(false) };
}
