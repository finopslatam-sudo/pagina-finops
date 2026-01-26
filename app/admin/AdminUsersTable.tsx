'use client';

/* =====================================================
   ADMIN USERS TABLE
   Usuarios de plataforma (NO clientes)
===================================================== */

export default function AdminUsersTable() {
  /* ===============================
     FUTURO:
     - Fetch /api/admin/users
     - Paginación
     - EditUserModal
  =============================== */

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">

      {/* ===== TITLE ===== */}
      <header className="mb-4">
        <h2 className="text-lg font-semibold">Usuarios de Plataforma</h2>
        <p className="text-sm text-gray-500">
          Root, administradores y soporte
        </p>
      </header>

      {/* ===== TABLE PLACEHOLDER ===== */}
      <div className="text-gray-400 text-sm">
        Tabla de usuarios de plataforma (en construcción)
      </div>

    </div>
  );
}
