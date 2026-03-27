'use client';

import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import AwsAccountSelector from '../components/AwsAccountSelector';
import { useSnapshots } from '../hooks/useSnapshots';

import GobernanzaHero from './components/GobernanzaHero';
import GobernanzaKPIs from './components/GobernanzaKPIs';
import ComplianceCard from './components/ComplianceCard';
import SeverityDonut from './components/SeverityDonut';
import RemediationCard from './components/RemediationCard';
import ExecutiveSummaryCard from './components/ExecutiveSummaryCard';
import RoiProjection from './components/RoiProjection';
import PriorityServicesCard from './components/PriorityServicesCard';
import GobernanzaSkeleton from './components/GobernanzaSkeleton';

export default function GobernanzaPage() {
  const { data, loading } = useDashboard();
  const { user } = useAuth();
  const { latest, trend } = useSnapshots();

  if (!hasFeature(user?.plan_code, 'gobernanza')) {
    return <div className="p-6 text-red-500">Este módulo requiere plan Professional o Enterprise</div>;
  }

  if (loading || !data) return <GobernanzaSkeleton />;

  const gov  = data.governance;
  const risk = data.risk;
  const exec = data.executive_summary;
  const roi  = data.roi_projection;
  const f    = data.findings;

  const resolvedPct      = f.total > 0 ? Math.round((f.resolved / f.total) * 100) : 0;
  const priorityServices = Array.isArray(data.priority_services) ? data.priority_services : [];
  const severityData     = [
    { name: 'HIGH',   value: f.high },
    { name: 'MEDIUM', value: f.medium },
    { name: 'LOW',    value: f.low },
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-10">

      <GobernanzaHero data={data} latest={latest} trend={trend} />

      <div className="flex items-center gap-4">
        <AwsAccountSelector />
      </div>

      <GobernanzaKPIs gov={gov} risk={risk} exec={exec} f={f} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ComplianceCard gov={gov} />
        <SeverityDonut f={f} severityData={severityData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RemediationCard f={f} risk={risk} resolvedPct={resolvedPct} />
        <ExecutiveSummaryCard exec={exec} resourcesAffected={data.resources_affected} />
      </div>

      <RoiProjection roi={roi} risk={risk} gov={gov} />

      <PriorityServicesCard services={priorityServices} />

    </div>
  );
}
