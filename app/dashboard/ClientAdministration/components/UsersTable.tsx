'use client';

import { ClientUser } from '../types';
import { UserTable, UserTableColumn, UserTableAction } from '@/app/components/shared/UserManagement';

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
    owner: 'bg-purple-100 text-purple-700',
    finops_admin: 'bg-blue-100 text-blue-700',
    viewer: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[role] ?? 'bg-gray-100 text-gray-700'}`}>
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
  const columns: UserTableColumn<ClientUser>[] = [
    { key: 'contact_name', header: 'Nombre', render: (u) => u.contact_name || '—' },
    { key: 'email', header: 'Email', render: (u) => u.email },
    { key: 'client_role', header: 'Rol', render: (u) => <RoleBadge role={u.client_role} /> },
    {
      key: 'is_active',
      header: 'Estado',
      render: (u) =>
        u.is_active ? (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">Activo</span>
        ) : (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Inactivo</span>
        ),
    },
  ];

  const actions: UserTableAction<ClientUser>[] = [
    { label: 'Editar', onClick: onOpenEditUser },
    {
      label: 'Desactivar',
      variant: 'danger',
      onClick: (u) => onDeleteUser(u.id),
      show: (u) => u.client_role !== 'owner' && u.is_active,
    },
    {
      label: 'Activar',
      variant: 'success',
      onClick: (u) => onActivateUser(u.id),
      show: (u) => !u.is_active,
    },
  ];

  return (
    <div className="bg-white p-5 lg:p-8 rounded-3xl border shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
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
            ${userLimitReached ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {userLimitReached ? 'Límite alcanzado' : '+ Añadir usuario'}
        </button>
      </div>

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

      <UserTable rows={users} columns={columns} actions={actions} />
    </div>
  );
}
