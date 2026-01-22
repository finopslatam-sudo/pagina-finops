'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';

export default function AdminUsers() {
  const { user } = useAuth();

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (u: any) => {
    setEditingUser(u);
    setShowUserForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Gestión de Usuarios
        </h1>

        <div className="flex gap-3">
          <button
            onClick={handleCreateUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Nuevo Usuario
          </button>

          {user?.global_role === 'root' && (
            <button
              onClick={() => alert('Crear cliente')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              🏢 Nuevo Cliente
            </button>
          )}
        </div>
      </div>

      {/* TABLA */}
      <UsersTable onEdit={handleEditUser} />

      {/* MODAL */}
      {showUserForm && (
        <UserFormModal
          user={editingUser}
          onClose={() => setShowUserForm(false)}
        />
      )}
    </div>
  );
}
