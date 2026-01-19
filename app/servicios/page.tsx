'use client';

import { useState } from "react";

/* =========================
   COMPONENTE PLAN
========================= */
function Plan({
  title,
  description,
  features,
  color,
  highlight,
  onClick,
}: {
  title: string;
  description: string;
  features: string[];
  color: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`bg-white border rounded-2xl shadow-lg p-8 flex flex-col relative ${highlight ? "border-blue-600" : ""}`}>
      {highlight && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
          Más elegido
        </span>
      )}

      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <ul className="space-y-2 text-gray-700 flex-1 mb-6">
        {features.map((f) => (
          <li key={f}>✔ {f}</li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className={`${color} hover:opacity-90 text-white font-semibold py-3 rounded-lg transition`}
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

    const res = await fetch("https://api.finopslatam.com/api/contact", {
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

        <p className="text-gray-600 mb-6">
          Completa el formulario y te contactaremos a la brevedad.
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg">
            ✅ Solicitud enviada correctamente.  
            Nuestro equipo se pondrá en contacto contigo.
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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 text-center px-6">
        <h1 className="text-5xl font-bold mb-6">
          Planes FinOps para cada etapa de crecimiento
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Gobierno financiero cloud, optimización continua y decisiones
          estratégicas basadas en datos e inteligencia artificial.
        </p>
      </section>

      {/* PLANES */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          <Plan
            title="FinOps Foundation"
            description="Visibilidad y control financiero cloud."
            features={[
              "Cloud Assessment inicial",
              "Inventario completo de recursos",
              "Costos por servicio y proyecto",
              "Dashboards básicos",
              "Alertas simples",
              "Línea base FinOps",
            ]}
            color="bg-slate-700"
            onClick={() => setSelectedPlan("FinOps Foundation")}
          />

          <Plan
            title="FinOps Professional"
            description="Optimización activa y decisiones basadas en datos."
            features={[
              "Todo Foundation",
              "Forecasting y budget tracking",
              "Cost allocation por tags",
              "Savings Plans & RI analysis",
              "Optimización técnica recomendada",
              "IA FinOps asistida",
            ]}
            color="bg-blue-600"
            highlight
            onClick={() => setSelectedPlan("FinOps Professional")}
          />

          <Plan
            title="FinOps Enterprise"
            description="Gobierno completo y automatización avanzada."
            features={[
              "Todo Professional",
              "Optimización automatizada",
              "Anomaly Detection avanzado",
              "IA FinOps predictiva",
              "Operating Model FinOps",
              "Compliance y gobierno cloud",
            ]}
            color="bg-purple-700"
            onClick={() => setSelectedPlan("FinOps Enterprise")}
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