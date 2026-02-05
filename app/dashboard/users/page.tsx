'use client';

/* =====================================================
   PANEL DE USUARIOS — FINOPSLATAM
   Gestión de usuarios del sistema y clientes
===================================================== */

import AdminUsers from '@/app/dashboard/admin/AdminUsers';

export default function UsersPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">
          Panel de Usuarios
        </h1>

        <p className="text-sm text-gray-500">
          Administra usuarios del sistema y usuarios asociados a clientes.
        </p>
      </header>

      <AdminUsers />
    </section>
  );
}
