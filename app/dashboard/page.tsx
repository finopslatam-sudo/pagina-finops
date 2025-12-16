'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';

interface User {
  contact_name?: string;
  company_name?: string;
  email?: string;
}

const randomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function AnimatedBar({ value, colorFrom = 'blue-500', colorTo = 'indigo-600' }: { value: number; colorFrom?: string; colorTo?: string }) {
  const [width, setWidth] = useState(0);
  useState(() => setTimeout(() => setWidth(value), 100));
  return (
    <div className="bg-gray-200 h-6 rounded-lg overflow-hidden">
      <div
        style={{ width: `${width}%` }}
        className={`h-6 rounded-lg transition-all duration-1000 bg-gradient-to-r from-${colorFrom} to-${colorTo}`}
      />
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const safeUser: User = user || {};

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-white text-gray-900">
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

        <section className="px-6 max-w-7xl mx-auto space-y-12">
          {/* Aquí puedes colocar tus gráficos */}
        </section>
      </main>
    </PrivateRoute>
  );
}
