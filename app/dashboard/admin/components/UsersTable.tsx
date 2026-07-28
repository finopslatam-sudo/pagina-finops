'use client';

import { AdminUser } from '../hooks/useAdminUsers';
import { useAuth } from '@/app/context/AuthContext';
import { UserTable, UserTableColumn, UserTableAction } from '@/app/components/shared/UserManagement';

interface Props {
  users: AdminUser[];
  onEdit?: (user: AdminUser) => void;
}

export function UsersTable({ users, onEdit }: Props) {
  const { user: currentUser } = useAuth();

  const columns: UserTableColumn<AdminUser>[] = [
    { key: 'email', header: 'Email', render: (u) => u.email },
    {
      key: 'contact_name',
      header: 'Contacto',
      render: (u) =>
        u.contact_name || <span className="text-gray-400 italic">Sin nombre</span>,
    },
    {
      key: 'role',
      header: 'Rol',
      render: (u) => <span className="capitalize">{u.global_role ?? u.client_role ?? '—'}</span>,
    },
    {
      key: 'is_active',
      header: 'Estado',
      render: (u) =>
        u.is_active ? (
          <span className="text-green-600">Activo</span>
        ) : (
          <span className="text-red-600">Inactivo</span>
        ),
    },
  ];

  const actions: UserTableAction<AdminUser>[] = onEdit
    ? [
        {
          label: 'Editar',
          onClick: onEdit,
          show: (u) =>
            currentUser?.global_role === 'root' ||
            (currentUser?.global_role === 'admin' && u.global_role !== 'root') ||
            (currentUser?.global_role === 'support' && u.global_role === null),
        },
      ]
    : [];

  return <UserTable rows={users} columns={columns} actions={actions} emptyMessage="No hay usuarios" />;
}
