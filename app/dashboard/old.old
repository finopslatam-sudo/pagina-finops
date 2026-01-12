'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import { hasFeature } from "@/app/lib/hasFeature";


// Tipo seguro para el usuario
interface User {
  contact_name?: string;
  company_name?: string;
  email?: string;
}

export default function Dashboard() {
  const { user, logout, planState } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    window.location.href = '/';
  };

  const safeUser: User = user || {};
  const planLabelMap: Record<string, string> = {
    assessment: "🔍 Cloud Assessment",
    intelligence: "📊 Cloud Intelligence",
    financial_ops: "💰 Cloud Financial Ops",
    optimization: "⚡ Cloud Optimization",
    governance: "🏷️ Cloud Governance",
  };
  
  return (
    <PrivateRoute>
      <main className="min-h-screen bg-white text-gray-900">

        {/* CABECERA BLANCA */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <span className="text-gray-700 font-medium text-lg block">
                Estás en tu sesión:{' '}
                {safeUser.contact_name
                  ? safeUser.contact_name.replace(/\s*Name\s*$/i, '')
                  : safeUser.company_name || safeUser.email}
              </span>

              <span className="text-sm text-blue-600 font-medium">
              Plan contratado:{" "}
              {planState.status === "loading" && (
                <span className="text-gray-400">Cargando plan…</span>
              )}

              {planState.status === "assigned" && (
                <span className="font-semibold">{planState.plan.name}</span>
              )}

              {planState.status === "none" && (
                <span className="text-red-500">Plan no asignado</span>
              )}
              </span>
            </div>
          </div>
        </header>

        {/* SECCIÓN HERO */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 mb-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Dashboard FinOps
            </h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Controla, visualiza y optimiza tus costos en la nube de manera eficiente
            </p>
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="px-6 max-w-7xl mx-auto space-y-12">

          {/* BLOQUES PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* GASTO MENSUAL */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gasto Mensual Cloud
              </h3>

              <img src="/ima1.png" alt="Gasto mensual AWS" className="rounded-lg mb-4 border" />
              <img src="/ima2.png" alt="Detalle consumo AWS" className="rounded-lg border" />

              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                Visualización centralizada del gasto mensual en AWS, permitiendo
                identificar rápidamente desviaciones y mejorar el control financiero
                mediante prácticas FinOps.
              </p>
            </div>

            {/* AHORRO POTENCIAL */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ahorro Potencial
              </h3>

              <img src="/ima3.png" alt="Ahorro potencial cloud" className="rounded-lg mb-4 border" />
              <img src="/ima4.png" alt="Optimización de recursos AWS" className="rounded-lg border" />

              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                Identificación de recursos sobredimensionados y servicios no utilizados,
                permitiendo reducir costos sin afectar la operación productiva.
              </p>
            </div>

            {/* PROYECCIONES FINOPS */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Proyecciones FinOps
              </h3>

              <img src="/ima5.png" alt="Proyección de costos AWS" className="rounded-lg mb-4 border" />
              <img src="/ima6.png" alt="Forecast financiero cloud" className="rounded-lg border" />

              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                Proyección del consumo futuro y eficiencia cloud, apoyando la toma de
                decisiones estratégicas y una gestión financiera sostenible.
              </p>
            </div>

          </div>

          {/* MÉTRICAS RÁPIDAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-md text-center">
              <p className="text-2xl font-bold">$4,340</p>
              <p className="text-blue-100 mt-1 text-sm">Ahorro mensual</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-md text-center">
              <p className="text-2xl font-bold">87%</p>
              <p className="text-green-100 mt-1 text-sm">Eficiencia</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-md text-center">
              <p className="text-2xl font-bold">24</p>
              <p className="text-purple-100 mt-1 text-sm">Proyectos</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-xl shadow-md text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-orange-100 mt-1 text-sm">Nuevos leads</p>
            </div>
          </div>

        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800 mt-12">
          <div className="flex justify-center gap-6 pb-6">
            <a href="https://wa.me/56965090121" target="_blank" className="hover:text-blue-400 transition text-2xl">💬</a>
            <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400 transition text-2xl">📧</a>
            <a href="https://www.linkedin.com/company/finopslatam" target="_blank" className="hover:text-blue-400 transition text-2xl">💼</a>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
          </div>
        </footer>

      </main>
    </PrivateRoute>
  );
}
