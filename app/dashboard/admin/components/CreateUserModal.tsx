'use client';

import { useCreateUserFormAdmin } from '../hooks/useCreateUserFormAdmin';

interface Props { onClose: () => void; onCreated: () => void }

function PasswordInput({ show, value, placeholder, onChange, onToggle }: {
  show: boolean; value: string; placeholder: string;
  onChange: (v: string) => void; onToggle: () => void;
}) {
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className="w-full border rounded px-3 py-2 pr-10" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      <button type="button" onClick={onToggle} className="absolute right-2 top-2">{show ? '🙈' : '👁️'}</button>
    </div>
  );
}

export default function CreateUserModal({ onClose, onCreated }: Props) {
  const f = useCreateUserFormAdmin(onCreated, onClose);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">Crear Usuario</h2>

        {f.error   && <div className="text-red-600 text-sm">{f.error}</div>}
        {f.success && <div className="text-green-600 text-sm">{f.success}</div>}

        <select className="w-full border rounded px-3 py-2" value={f.type} onChange={e => f.setType(e.target.value as 'global' | 'client')}>
          <option value="client">Comercial</option>
          {(f.isRoot || f.isAdmin) && <option value="global">Sistema</option>}
        </select>

        {f.type === 'global' && (
          <select className="w-full border rounded px-3 py-2" value={f.globalRole} onChange={e => f.setGlobalRole(e.target.value as 'root' | 'admin' | 'support')}>
            {f.isRoot && <option value="root">Root</option>}
            {(f.isRoot || f.isAdmin) && <option value="admin">Admin</option>}
            {(f.isRoot || f.isAdmin) && <option value="support">Support</option>}
          </select>
        )}

        {f.type === 'client' && (
          <>
            <select className="w-full border rounded px-3 py-2" value={f.clientId ?? ''} onChange={e => f.setClientId(Number(e.target.value))}>
              <option value="">Seleccionar cliente</option>
              {f.clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
            <select className="w-full border rounded px-3 py-2" value={f.clientRole} onChange={e => f.setClientRole(e.target.value as 'owner' | 'finops_admin' | 'viewer')}>
              <option value="owner">Owner</option>
              <option value="finops_admin">FinOps Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </>
        )}

        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={f.email} onChange={e => f.setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Nombre contacto" value={f.contactName} onChange={e => f.setContactName(e.target.value)} />

        <PasswordInput show={f.showPass} value={f.password} placeholder="Contraseña" onChange={f.setPassword} onToggle={() => f.setShowPass(!f.showPass)} />
        <PasswordInput show={f.showPass2} value={f.passwordConfirm} placeholder="Confirmar contraseña" onChange={f.setPasswordConfirm} onToggle={() => f.setShowPass2(!f.showPass2)} />

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-gray-600">Cancelar</button>
          <button onClick={f.submit} disabled={f.loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
            {f.loading ? 'Creando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
