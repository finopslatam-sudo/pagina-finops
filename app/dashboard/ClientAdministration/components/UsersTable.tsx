'use client';

import { ClientUser } from "../types";

interface Props {
  users: ClientUser[];
  userLimit: number;
  userLimitReached: boolean;
  onOpenCreateUser: () => void;
  onOpenEditUser: (user: ClientUser) => void;
  onDeleteUser: (userId: number) => void;
  onActivateUser: (userId: number) => void;
  onOpenUpgradeModal: () => void;
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    owner: "bg-purple-100 text-purple-700",
    finops_admin: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[role] ?? "bg-gray-100 text-gray-700"}`}>
      {role}
    </span>
  );
}

export default function UsersTable({
  users,
  userLimit,
  userLimitReached,
  onOpenCreateUser,
  onOpenEditUser,
  onDeleteUser,
  onActivateUser,
  onOpenUpgradeModal,
}: Props) {
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Usuarios de la organización</h2>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {users.length} / {userLimit}
          </span>
        </div>

        <button
          onClick={onOpenCreateUser}
          disabled={userLimitReached}
          className={`px-4 py-2 rounded text-white
            ${userLimitReached ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {userLimitReached ? "Límite alcanzado" : "+ Añadir usuario"}
        </button>
      </div>

      {/* Limit warning banner */}
      {userLimitReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="text-sm text-amber-800">
            <p className="font-semibold">⚠️ Has alcanzado el límite de usuarios de tu plan.</p>
            <p>Actualiza tu suscripción para agregar más usuarios y cuentas AWS.</p>
          </div>
          <button
            onClick={onOpenUpgradeModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2 text-left w-1/5">Nombre</th>
              <th className="py-2 text-left w-2/5">Email</th>
              <th className="py-2 text-left w-1/5">Rol</th>
              <th className="py-2 text-left w-1/5">Estado</th>
              <th className="py-2 text-left w-1/5">Acción</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-3">{u.contact_name || "—"}</td>
                <td className="py-3">{u.email}</td>
                <td className="py-3">
                  <RoleBadge role={u.client_role} />
                </td>
                <td className="py-3">
                  {u.is_active ? (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                      Activo
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="py-3 flex items-center gap-4">
                  <button
                    onClick={() => onOpenEditUser(u)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>

                  {u.client_role !== "owner" && u.is_active && (
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Desactivar
                    </button>
                  )}

                  {!u.is_active && (
                    <button
                      onClick={() => onActivateUser(u.id)}
                      className="text-emerald-600 hover:underline text-sm"
                    >
                      Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
