import { AdminUser } from '../hooks/useAdminUsers';

interface Props {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
}

export function UsersTable({ users, onEdit }: Props) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Email</th>
          <th>Empresa</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => {
          const role =
            user.global_role ??
            user.client_role ??
            '—';

          return (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.client?.company_name ?? '—'}</td>
              <td>{role}</td>
              <td>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </td>
              <td>
                {user.global_role === 'root' ? (
                  '—'
                ) : (
                  <button
                    className="text-blue-600"
                    onClick={() => onEdit(user)}
                  >
                    Editar
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
