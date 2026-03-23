'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';

/* ─── tipos ─────────────────────────────────────────────── */

type PolicyStatus = 'active' | 'inactive' | 'draft';

interface PolicyCard {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  examples: string[];
  status: PolicyStatus;
  color: string;
  borderColor: string;
  badgeColor: string;
}

/* ─── datos estáticos de políticas ──────────────────────── */

const POLICIES: PolicyCard[] = [
  {
    id: 'budget-monthly',
    category: 'Presupuesto',
    icon: '💰',
    title: 'Alerta de Presupuesto Mensual',
    description: 'Recibe una notificación cuando el gasto mensual supere un umbral definido en USD o porcentaje del presupuesto asignado.',
    examples: ['Alertar al 80% del presupuesto mensual', 'Alertar si gasto supera USD $500/mes', 'Notificar al alcanzar el 100% del límite'],
    status: 'draft',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'budget-annual',
    category: 'Presupuesto',
    icon: '📅',
    title: 'Alerta de Presupuesto Anual',
    description: 'Monitoreo continuo del gasto acumulado anual versus el presupuesto aprobado para el año fiscal.',
    examples: ['Alertar al superar el 50% del presupuesto anual en el primer semestre', 'Proyección de sobre-gasto a fin de año', 'Alerta si el ritmo de gasto supera la proyección'],
    status: 'draft',
    color: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'anomaly-spike',
    category: 'Anomalías',
    icon: '📈',
    title: 'Detección de Pico de Gasto',
    description: 'Alerta automática cuando el gasto diario o semanal aumenta de forma anormal respecto al promedio histórico.',
    examples: ['Alerta si el gasto diario sube más de 30% vs promedio', 'Notificar picos por encima de 2x el gasto típico', 'Detección de cargos inusuales en servicios específicos'],
    status: 'draft',
    color: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'off-hours',
    category: 'Uso No Hábil',
    icon: '🌙',
    title: 'Consumo en Horario No Hábil',
    description: 'Detecta y alerta cuando recursos cloud están activos fuera del horario laboral definido, identificando costos evitables.',
    examples: ['Alertar por instancias EC2 activas entre 22:00 y 06:00', 'Detectar bases de datos RDS corriendo fines de semana', 'Notificar clusters EKS sin carga en horario nocturno'],
    status: 'draft',
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'service-cost',
    category: 'Servicios',
    icon: '⚙️',
    title: 'Alerta por Servicio AWS',
    description: 'Define umbrales de costo específicos por servicio. Recibe alertas si EC2, RDS, S3 u otro servicio supera el límite configurado.',
    examples: ['Alerta si EC2 supera USD $200 en el mes', 'Notificar si S3 supera USD $50 de almacenamiento', 'Alerta si CloudWatch excede USD $30 en logs'],
    status: 'draft',
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'tagging-policy',
    category: 'Gobernanza',
    icon: '🏷️',
    title: 'Política de Etiquetado (Tagging)',
    description: 'Garantiza que todos los recursos cloud estén etiquetados correctamente según los estándares organizacionales para control de costos.',
    examples: ['Alertar por recursos sin tag "Environment"', 'Detectar recursos sin tag "CostCenter"', 'Notificar recursos sin propietario definido'],
    status: 'draft',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'idle-resources',
    category: 'Optimización',
    icon: '💤',
    title: 'Recursos Inactivos o Subutilizados',
    description: 'Alerta periódica sobre recursos con utilización por debajo del umbral definido que representan gasto sin valor.',
    examples: ['Alertar instancias EC2 con CPU < 5% por 7 días', 'Detectar volumes EBS sin snapshots en 30+ días', 'Notificar Elastic IPs no asociadas a instancias activas'],
    status: 'draft',
    color: 'bg-slate-50',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'lifecycle',
    category: 'Ciclo de Vida',
    icon: '♻️',
    title: 'Política de Ciclo de Vida de Recursos',
    description: 'Define reglas automáticas para el ciclo de vida de recursos: apagado programado, eliminación de snapshots antiguos, archivado de datos.',
    examples: ['Eliminar snapshots de más de 90 días automáticamente', 'Apagar instancias de desarrollo a las 20:00', 'Archivar objetos S3 sin acceso en 60+ días'],
    status: 'draft',
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    badgeColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 'forecast',
    category: 'Proyección',
    icon: '🔮',
    title: 'Alerta de Proyección de Gasto',
    description: 'Análisis predictivo que alerta si la proyección de gasto al cierre del mes o año supera el presupuesto aprobado.',
    examples: ['Alertar si proyección mensual supera el 110% del presupuesto', 'Notificar variación mayor a 20% respecto al mes anterior', 'Alerta de tendencia alcista sostenida por 3+ semanas'],
    status: 'draft',
    color: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-200',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-700',
  },
];

/* ─── badge de status ───────────────────────────────────── */

const STATUS_CONFIG: Record<PolicyStatus, { label: string; color: string }> = {
  active:   { label: 'Activa',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactiva',  color: 'bg-slate-100 text-slate-500 border-slate-200' },
  draft:    { label: 'Disponible', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

/* ─── categorías únicas ─────────────────────────────────── */

const CATEGORIES = ['Todas', ...Array.from(new Set(POLICIES.map(p => p.category)))];

/* ─── page ──────────────────────────────────────────────── */

export default function AlertasPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [showComingSoon, setShowComingSoon] = useState(false);

  /* plan check */
  if (!hasFeature(user?.plan_code, 'alertas')) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center gap-6 text-center">
        <div className="text-6xl">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800">Módulo exclusivo Plan Enterprise</h2>
        <p className="text-slate-500 max-w-md leading-relaxed">
          Las Políticas & Alertas avanzadas de presupuesto, consumo y gobernanza están disponibles
          únicamente en el plan <span className="font-semibold text-slate-700">FinOps Enterprise</span>.
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

  const filtered = activeCategory === 'Todas'
    ? POLICIES
    : POLICIES.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50 rounded-3xl p-10 shadow-md text-slate-900 border border-white/60">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold">Políticas & Alertas</h1>
            <p className="text-slate-700 mt-3 max-w-3xl leading-relaxed">
              Define reglas de presupuesto, alertas de consumo, detección de anomalías y políticas de gobernanza
              para mantener control total sobre el gasto cloud de tu organización. Comparable a las capacidades
              de CloudHealth y AWS Budgets, pero integrado en tu plataforma FinOps.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => setShowComingSoon(true)}
              className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition text-sm shadow"
            >
              + Nueva Política
            </button>
            <span className="text-xs text-slate-500">9 tipos de políticas disponibles</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Políticas configuradas', value: '0', icon: '📋' },
            { label: 'Alertas activas',         value: '0', icon: '🔔' },
            { label: 'Alertas disparadas hoy',  value: '0', icon: '⚡' },
            { label: 'Canales de notificación', value: '0', icon: '📨' },
          ].map(s => (
            <div key={s.label} className="bg-white/80 border border-white/70 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-slate-800">{s.icon} {s.value}</div>
              <div className="text-xs text-slate-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NOTIFICACIÓN COMING SOON ── */}
      {showComingSoon && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl">🚧</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Configuración de políticas en desarrollo</p>
            <p className="text-sm text-amber-700 mt-1">
              El módulo de creación y gestión de alertas estará disponible en la próxima versión de la plataforma.
              Mientras tanto, puedes revisar todos los tipos de alertas disponibles y preparar tu estrategia de gobernanza.
            </p>
          </div>
          <button onClick={() => setShowComingSoon(false)} className="text-amber-600 hover:text-amber-800 font-bold text-lg">×</button>
        </div>
      )}

      {/* ── FILTRO POR CATEGORÍA ── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              activeCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── GRID DE POLÍTICAS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(policy => {
          const statusCfg = STATUS_CONFIG[policy.status];
          return (
            <div
              key={policy.id}
              className={`${policy.color} ${policy.borderColor} border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition`}
            >
              {/* header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{policy.icon}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${policy.badgeColor}`}>
                    {policy.category}
                  </span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>

              {/* title + desc */}
              <div>
                <h3 className="font-semibold text-slate-800 text-base">{policy.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{policy.description}</p>
              </div>

              {/* ejemplos */}
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

              {/* CTA */}
              <button
                onClick={() => setShowComingSoon(true)}
                className="mt-2 w-full py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition"
              >
                Configurar política
              </button>
            </div>
          );
        })}
      </div>

      {/* ── CANALES DE NOTIFICACIÓN ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Canales de Notificación</h2>
        <p className="text-sm text-slate-500 mb-6">
          Configura los destinos donde se enviarán las alertas cuando se dispare una política.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '📧', label: 'Email', desc: 'Notificación directa por correo' },
            { icon: '💬', label: 'Slack', desc: 'Alertas en canales de Slack' },
            { icon: '🪝', label: 'Webhook', desc: 'Integración con sistemas propios' },
            { icon: '📱', label: 'WhatsApp', desc: 'Alertas críticas por WhatsApp' },
          ].map(ch => (
            <div
              key={ch.label}
              className="border border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center text-center gap-2 hover:border-slate-500 hover:bg-slate-50 transition cursor-pointer"
              onClick={() => setShowComingSoon(true)}
            >
              <span className="text-3xl">{ch.icon}</span>
              <span className="font-semibold text-slate-700 text-sm">{ch.label}</span>
              <span className="text-xs text-slate-400">{ch.desc}</span>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Próximamente</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
