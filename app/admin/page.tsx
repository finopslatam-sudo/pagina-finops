'use client';

import { useAuth } from '@/app/context/AuthContext';
import AdminUsersTable from './AdminUsersTable';
import AdminClientsTable from './AdminClientsTable';
import AdminClientUsersTable from './AdminClientUsersTable';

export function AdminPanel() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <p>Cargando…</p>;
  }

  if (
    !user ||
    !user.global_role ||
    !['root', 'admin'].includes(user.global_role)
  ) {
    return <p className="text-red-500">Acceso no autorizado</p>;
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios de plataforma
        </h2>
        <AdminUsersTable />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Empresas
        </h2>
        <AdminClientsTable />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Usuarios por empresa
        </h2>
        <AdminClientUsersTable />
      </section>
    </div>
  );
}

/**
 * Ruta /admin sigue funcionando normal
 */
export default function AdminPage() {
  return <AdminPanel />;
}
