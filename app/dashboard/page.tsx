'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';

// Tipo seguro para el usuario
interface User {
  contact_name?: string;
  company_name?: string;
  email?: string;
}

// Genera número aleatorio dentro de un rango
const randomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Gráfico de barras animado
function AnimatedBar({ value, colorFrom = 'blue-500', colorTo = 'indigo-600' }: { value: number; colorFrom?: string; colorTo?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);
  return (
    <div className="bg-gray-200 h-6 rounded-lg overflow-hidden">
      <div
        style={{ width: `${width}%` }}
        className={`h-6 rounded-lg transition-all duration-1000 bg-gradient-to-r from-${colorFrom} to-${colorTo}`}
      />
    </div>
  );
}

// Gráfico de líneas animado
function AnimatedLineChart() {
  const [heights, setHeights] = useState([16, 24, 12, 20, 28]);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(heights.map(() => randomValue(10, 30)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative h-36 w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex items-end justify-between px-4 py-2">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-3 rounded bg-gradient-to-t from-blue-500 to-indigo-600 transition-all duration-1000"
          style={{ height: `${h}rem` }}
        />
      ))}
    </div>
  );
}

// Gráfico tipo torta simulado
function AnimatedPieChart() {
  const [percent, setPercent] = useState(randomValue(20, 80));
  useEffect(() => {
    const interval = setInterval(() => setPercent(randomValue(20, 80)), 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative flex items-center justify-center h-32 w-32 mx-auto">
      <svg className="h-32 w-32 transform -rotate-90">
        <circle cx="50%" cy="50%" r="50%" fill="transparent" stroke="#e5e7eb" strokeWidth="32" />
        <circle
          cx="50%"
          cy="50%"
          r="50%"
          fill="transparent"
          stroke="url(#gradient)"
          strokeWidth="32"
          strokeDasharray={`${percent} ${100 - percent}`}
          strokeDashoffset="25"
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-gray-900 font-bold text-lg">{percent}%</span>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    window.location.href = '/';
  };

  const safeUser: User = user || {};

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-white text-gray-900">

        {/* CABECERA BLANCA */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium text-lg">
              Estás en tu sesión: {safeUser.contact_name || safeUser.company_name || safeUser.email}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* SECCIÓN HERO AZUL */}
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

        {/* DASHBOARD PRINCIPAL */}
        <section className="px-6 max-w-7xl mx-auto space-y-12">

          {/* GRÁFICOS PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Gasto Mensual */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gasto Mensual</h3>
              <AnimatedBar value={randomValue(40, 90)} />
              <div className="mt-4">
                <AnimatedPieChart />
              </div>
            </div>

            {/* Ahorro Potencial */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ahorro Potencial</h3>
              <AnimatedLineChart />
              <div className="mt-4">
                <AnimatedPieChart />
              </div>
            </div>

            {/* Proyectos Activos */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyectos Activos</h3>
              <AnimatedBar value={randomValue(20, 70)} />
              <div className="mt-4">
                <AnimatedLineChart />
              </div>
              <div className="mt-4">
                <AnimatedPieChart />
              </div>
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

        {/* PIE DE PÁGINA */}
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