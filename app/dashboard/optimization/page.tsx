'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import { useAwsAccount } from "../context/AwsAccountContext";
import AwsAccountSelector from "../components/AwsAccountSelector";

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
  const { token, user } = useAuth();
  const { selectedAccount } = useAwsAccount();
  const [ri, setRI] = useState<RIResponse | null>(null);
  const [sp, setSP] = useState<SPResponse | null>(null);
  const [loadingFinops, setLoadingFinops] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoadingFinops(false);
      return;
    }

    const fetchFinops = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const accountQuery = selectedAccount
        ? `?aws_account_id=${selectedAccount}`
        : '';
      
        const [r2, r3] = await Promise.all([
          fetch(`/api/client/finops/ri-coverage${accountQuery}`, { headers }),
          fetch(`/api/client/finops/sp-coverage${accountQuery}`, { headers }),
        ]);

        const d2 = await r2.json();
        const d3 = await r3.json();

        setRI(d2);
        setSP(d3);
      } catch (e) {
        console.error('FinOps API error', e);
      } finally {
        setLoadingFinops(false);
      }
    };

    fetchFinops();
  }, [token, selectedAccount]);

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

  if (loadingFinops) {
    return <div className="p-6 text-gray-400">Cargando optimización...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Estrategia de Compromisos (RI & Savings Plans)
        </h1>
        <p className="text-gray-600 mt-3 max-w-3xl">
        Cobertura y uso de compromisos (Reserved Instances y Savings Plans) para maximizar el valor de tus workloads en la nube.
        </p>
      </div>

      {/* ================= ACCOUNT FILTER ================= */}
      <div className="flex items-center gap-4 pt-2">
        <AwsAccountSelector />
      </div>

      {/* ================= RI ================= */}
      <SectionCard title="Cobertura de Reserved Instances">
        {!ri?.has_reserved_instances ? (
          <EmptyState message="No se detectaron Reserved Instances en los últimos 30 días." />
        ) : (
          <CoverageDisplay percentage={ri.coverage_percentage} />
        )}
      </SectionCard>

      {/* ================= SP ================= */}
      <SectionCard title="Cobertura de Savings Plans">
        {!sp?.has_savings_plans ? (
          <EmptyState message="No hay Savings Plans activos en esta cuenta." />
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
