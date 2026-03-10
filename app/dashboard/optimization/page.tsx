'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';

type RightsizingResponse = {
  has_data: boolean;
  total_recommendations: number;
  total_estimated_monthly_savings: number;
  supported_services: string[];
  recommendations: any[];
};

type RIResponse = {
  coverage_percentage: number;
  has_reserved_instances: boolean;
  has_data: boolean;

  period_days: number;
};

type SPResponse = {
  has_savings_plans: boolean;
  has_data: boolean;
  period_days: number;
  services: { service: string; coverage_percentage: number }[];
};

export default function OptimizationPage() {
  const { data, loading, error } = useDashboard();
  const { token, user } = useAuth();

  const [rightsizing, setRightsizing] = useState<RightsizingResponse | null>(null);
  const [ri, setRI] = useState<RIResponse | null>(null);
  const [sp, setSP] = useState<SPResponse | null>(null);
  const [loadingFinops, setLoadingFinops] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchFinops = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [r1, r2, r3] = await Promise.all([
          fetch('/api/client/finops/rightsizing', { headers }),
          fetch('/api/client/finops/ri-coverage', { headers }),
          fetch('/api/client/finops/sp-coverage', { headers }),
        ]);

        const d1 = await r1.json();
        const d2 = await r2.json();
        const d3 = await r3.json();

        setRightsizing(d1);
        setRI(d2);
        setSP(d3);
      } catch (e) {
        console.error('FinOps API error', e);
      } finally {
        setLoadingFinops(false);
      }
    };

    fetchFinops();
  }, [token]);

  // =============================
  // PLAN FEATURE CHECK
  // =============================

  if (!hasFeature(user?.plan_code, "optimization")) {
    return (
      <div className="p-6 text-red-500">
        Este módulo requiere plan Professional o Enterprise
      </div>
    );
  }

  if (loading || loadingFinops) {
    return <div className="p-6 text-gray-400">Cargando optimización...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!data) return null;

  const roi = data.roi_projection;

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Optimization & Commitments Strategy
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
        Marco de optimización a nivel ejecutivo que consolida las oportunidades de dimensionamiento, 
        la cobertura de los compromisos (Instancias Reservadas y Planes de Ahorro) y el impacto financiero proyectado 
        en su entorno de nube. Esta sección permite tomar decisiones basadas en datos para mejorar la eficiencia, 
        reducir el desperdicio estructural y maximizar el retorno a largo plazo de las inversiones en la nube.
        </p>
      </div>

      {/* ================= ROI ================= */}
      {roi && (
        <SectionCard title="Strategic ROI Projection">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              label="Puntuación de riesgo proyectada"
              value={`${roi.projected_risk_score}%`}
              variant="orange"
            />

            <MetricCard
              label="Gobernanza proyectada"
              value={`${roi.projected_governance}%`}
              variant="blue"
            />

            <MetricCard
              label="Nivel de riesgo proyectado"
              value={roi.projected_risk_level}
              variant="purple"
            />

            <MetricCard
              label="Ahorro anual proyectado"
              value={`$${roi.high_savings_opportunity_annual}`}
              variant="green"
            />
          </div>
        </SectionCard>
      )}

      {/* ================= RIGHTSIZING ================= */}
      <SectionCard title="Rightsizing (EC2 & RDS)">
        {!rightsizing?.has_data ? (
          <EmptyState message="No rightsizing opportunities detected for EC2 or RDS." />
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Total Recommendations: {rightsizing.total_recommendations}
              </p>
              <p className="text-sm text-gray-600">
                Estimated Monthly Savings: ${rightsizing.total_estimated_monthly_savings}
              </p>
            </div>

            <div className="space-y-4">
              {rightsizing.recommendations.map((r: any) => (
                <div key={r.id} className="border rounded-2xl p-5 bg-gray-50">
                  <p className="font-semibold">{r.resource_id}</p>
                  <p className="text-sm text-gray-600">{r.message}</p>
                  <p className="text-sm text-emerald-600 mt-2">
                    ${r.estimated_monthly_savings} monthly
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </SectionCard>

      {/* ================= RI ================= */}
      <SectionCard title="Reserved Instances Coverage">
        {!ri?.has_reserved_instances ? (
          <EmptyState message="No Reserved Instances detected in the last 30 days." />
        ) : (
          <CoverageDisplay percentage={ri.coverage_percentage} />
        )}
      </SectionCard>

      {/* ================= SP ================= */}
      <SectionCard title="Savings Plans Coverage">
        {!sp?.has_savings_plans ? (
          <EmptyState message="No Savings Plans active in this account." />
        ) : (
          <div className="space-y-4">
            {sp.services.map((s, idx) => (
              <CoverageRow key={idx} label={s.service} value={s.coverage_percentage} />
            ))}
          </div>
        )}
      </SectionCard>

    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function SectionCard({ title, children }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 border rounded-2xl p-6 text-gray-500 text-sm">
      {message}
    </div>
  );
}

function CoverageDisplay({ percentage }: { percentage: number }) {
  return (
    <div>
      <p className="text-3xl font-bold text-indigo-600">{percentage}%</p>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div
          className="bg-indigo-500 h-4 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CoverageRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 border rounded-2xl p-4">
      <p className="font-medium">{label}</p>
      <p className="font-semibold text-indigo-600">{value}%</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string | number;
  variant?: "orange" | "blue" | "purple" | "green" | "default";
}) {

  let classes =
    "border rounded-2xl p-6 shadow-sm ";

  if (variant === "orange") {
    classes += "bg-orange-50 border-orange-200";
  } else if (variant === "blue") {
    classes += "bg-blue-50 border-blue-200";
  } else if (variant === "purple") {
    classes += "bg-purple-50 border-purple-200";
  } else if (variant === "green") {
    classes += "bg-emerald-50 border-emerald-200";
  } else {
    classes += "bg-gray-50 border-gray-200";
  }

  return (
    <div className={classes}>
      <p className="text-sm text-gray-600">
        {label}
      </p>
      <p className="text-3xl font-semibold mt-2 text-gray-900">
        {value}
      </p>
    </div>
  );
}