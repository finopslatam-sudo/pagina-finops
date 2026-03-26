'use client';

import { useState } from "react";
import { API_URL } from "@/app/lib/api";

/* =========================
   COMPONENTE PLAN
========================= */
function Plan({
  title,
  description,
  features,
  bg,
  border,
  button,
  highlight,
  onClick,
}: {
  title: string;
  description: string;
  features: string[];
  bg: string;
  border: string;
  button: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`
        relative rounded-3xl p-8 flex flex-col shadow-xl
        ${bg} ${border}
        transition-transform hover:-translate-y-1
      `}
    >
      {/* DESCUENTO */}
      <span className="
        absolute -top-6 left-1/2 -translate-x-1/2
        bg-green-600 text-white
        text-base font-bold
        px-6 py-2
        rounded-full
        shadow-lg
        tracking-wide
      ">
        🎉 20% DCTO
      </span>

      {/* MÁS ELEGIDO */}
      {highlight && (
        <span className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Más elegido
        </span>
      )}

      <h2 className="text-2xl font-bold mb-2 text-gray-900">{title}</h2>
      <p className="text-gray-700 mb-6">{description}</p>

      <ul className="space-y-2 text-gray-800 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✔</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className={`${button} text-white font-semibold py-3 rounded-xl transition hover:opacity-90`}
      >
        Contratar Plan
      </button>
    </div>
  );
}

/* =========================
   MODAL CONTRATACIÓN
========================= */
function ContractModal({
  plan,
  onClose,
}: {
  plan: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        servicio: plan,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Error al enviar solicitud");
      return;
    }

    setSuccess(true);
    setForm({
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
      mensaje: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-2">
          Contratar {plan}
        </h3>

        {success ? (
          <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg">
            ✅ Solicitud enviada correctamente.  
            Alguien de nuestro equipo se contactará a la brevedad.

          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              required
              placeholder="Empresa"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              placeholder="Teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
            <textarea
              required
              rows={4}
              placeholder="Mensaje"
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* =========================
   PÁGINA SERVICIOS
========================= */
export default function Servicios() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-14 lg:py-20 text-center px-4 lg:px-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Planes FinOps para cada etapa de crecimiento
        </h1>
        <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto">
          Gobernanza financiera en la nube, optimización continua de recursos y decisiones estratégicas 
          basadas en análisis de costos.
        </p>
      </section>

      {/* PLANES */}
      <section className="px-4 lg:px-6 py-14 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <Plan
          title="FinOps Foundation"
          description="Visibilidad y control financiero cloud."
          features={[
            "Integración con AWS   (1 cuenta)",
            "Dashboard de costos y cuentas",
            "Findings básicos de optimización",
            "Inventario de recursos y análisis de riesgo",
            "Costos y financieros (visión general)",
            "Exportación de reportes (PDF, CSV, XLSX)",
            "Hasta 3 usuarios",
            "Soporte estándar",
          ]}
          bg="bg-gradient-to-br from-slate-200 via-slate-100 to-white"
          border="border border-slate-300"
          button="bg-slate-700"
          onClick={() => setSelectedPlan("FinOps Foundation")}
        />

        <Plan
          title="FinOps Professional"
          description="Optimización activa y decisiones basadas en datos."
          features={[
            "Todo Foundation",
            "Hasta 5 cuentas AWS",
            "Hasta 9 usuarios",
            "Optimización avanzada (Findings & Rightsizing)",
            "Análisis de Savings Plans y Reserved Instances",
            "Reportes detallados: Cost, Risk y Resource",
            "Proyección financiera (ROI & Savings)",
            "Forecast y control presupuestario",
            "Governance FinOps",
            "Planes de ahorro (RI & Savings Plans)",
            "Soporte prioritario",
          ]}
          bg="bg-gradient-to-br from-blue-50 to-blue-100"
          border="border-2 border-blue-600"
          button="bg-blue-600"
          highlight
          onClick={() => setSelectedPlan("FinOps Professional")}
        />

        <Plan
          title="FinOps Enterprise"
          description="Gobierno completo y automatización avanzada."
          features={[
            "Todo Professional",
            "Hasta 10 cuentas AWS",
            "Hasta 12 usuarios",
            "Policies y alertas automáticas",
            "Gobernanza avanzada multi-account",
            "Reportes ejecutivos automatizados",
            "Project Calculator (proyección de costos)",
            "Asistente FinOps integrado",
            "Modelo operativo FinOps",
            "Acompañamiento estratégico continuo",
          ]}
          bg="bg-gradient-to-br from-purple-50 to-purple-100"
          border="border border-purple-300"
          button="bg-purple-700"
          onClick={() => setSelectedPlan("FinOps Enterprise")}
        />

        <Plan
          title="Consultoría FinOps Estratégica"
          description="Diagnóstico, implementación y acompañamiento especializado en optimización cloud."
          features={[
            "Consultoria FinOps completa",
            "Identificación de desperdicio y quick wins",
            "Diseño de estrategia de ahorro",
            "Implementación de políticas FinOps",
            "Definición de gobernanza cloud",
            "Presentación ejecutiva a dirección",
          ]}
          bg="bg-gradient-to-br from-emerald-50 to-emerald-100"
          border="border border-emerald-300"
          button="bg-emerald-700"
          onClick={() => setSelectedPlan("Consultoría FinOps Estratégica")}
        />

        </div>
      </section>

      {selectedPlan && (
        <ContractModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="flex justify-center gap-6 pb-6">
          <a 
            href="https://wa.me/56965090121"
            target="_blank" 
            className="hover:text-blue-400 transition text-2xl"
          >
            💬
          </a>
          <a 
            href="mailto:contacto@finopslatam.com" 
            className="hover:text-blue-400 transition text-2xl"
          >
            📧
          </a>
          <a 
            href="https://www.linkedin.com/company/finopslatam" 
            target="_blank" 
            className="hover:text-blue-400 transition text-2xl"
          >
            💼
          </a>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <a href="/" className="flex items-center">
                <img 
                  src="/logo2.png" 
                  alt="FinOpsLatam Logo" 
                  className="h-12 w-auto mb-4"
                />
              </a>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Expertos en Optimización de Costos en la Nube, 
                automatización FinOps y control financiero para AWS.
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Navegación</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-blue-400 transition-colors">Inicio</a></li>
                <li><a href="/servicios" className="hover:text-blue-400 transition-colors">Servicios</a></li>
                <li><a href="/quienes-somos" className="hover:text-blue-400 transition-colors">Quiénes Somos</a></li>
                <li><a href="/blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="/contacto" className="hover:text-blue-400 transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li>Email: <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400 transition-colors">contacto@finopslatam.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/56965090121" className="hover:text-blue-400 transition-colors">+56 9 65090121</a></li>
                <li>LinkedIn: <a href="https://www.linkedin.com/company/finopslatam" className="hover:text-blue-400 transition-colors">FinOpsLatam</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 py-6 border-t border-gray-800">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}
