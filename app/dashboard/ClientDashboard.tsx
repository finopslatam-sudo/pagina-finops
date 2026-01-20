'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  /* ============================
     ROLE GUARD
  ============================ */
  useEffect(() => {
    if (!user) return;

    if (user.global_role === 'root' || user.global_role === 'support') {
      router.replace('/admin');
    }
  }, [user, router]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Gasto Mensual Cloud
        </h3>
        <img src="/ima1.png" className="rounded-lg mb-4 border" />
        <img src="/ima2.png" className="rounded-lg border" />
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Ahorro Potencial
        </h3>
        <img src="/ima3.png" className="rounded-lg mb-4 border" />
        <img src="/ima4.png" className="rounded-lg border" />
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Proyecciones FinOps
        </h3>
        <img src="/ima5.png" className="rounded-lg mb-4 border" />
        <img src="/ima6.png" className="rounded-lg border" />
      </div>

    </div>
  );
}
