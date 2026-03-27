'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import NotificationBell from '@/app/components/NotificationBell';

function MenuItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return <Link href={href} className="block px-4 py-3 hover:bg-blue-50" onClick={onClick}>{children}</Link>;
}
function MenuDividerItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return <Link href={href} className="block px-4 py-3 hover:bg-blue-50 border-t" onClick={onClick}>{children}</Link>;
}

function StaffMenuItems({ onClose }: { onClose: () => void }) {
  return (
    <>
      <MenuDividerItem href="/dashboard/users" onClick={onClose}>👥 Panel de Usuarios</MenuDividerItem>
      <MenuItem href="/dashboard/clients" onClick={onClose}>🏢 Panel de Clientes</MenuItem>
      <MenuItem href="/dashboard/admin/upgrades" onClick={onClose}>📈 Aprobaciones de Upgrade</MenuItem>
      <MenuItem href="/dashboard/admin/soporte" onClick={onClose}>🎫 Tickets de Soporte</MenuItem>
    </>
  );
}

function ClientMenuItems({ onClose, user, isFoundation }: { onClose: () => void; user: ReturnType<typeof useAuth>['user']; isFoundation: boolean }) {
  return (
    <>
      <MenuDividerItem href="/dashboard/findings" onClick={onClose}>🔎 Findings &amp; Optimization</MenuDividerItem>
      <MenuItem href="/dashboard/assets" onClick={onClose}>📦 Risk &amp; Assets</MenuItem>
      <MenuItem href="/dashboard/costos" onClick={onClose}>💰 Cost &amp; Financials</MenuItem>
      {!isFoundation && <MenuItem href="/dashboard/optimization" onClick={onClose}>🚀 RI &amp; Savings Plans</MenuItem>}
      {!isFoundation && <MenuItem href="/dashboard/gobernanza" onClick={onClose}>🏛 Governance</MenuItem>}
      <MenuItem href="/dashboard/informes" onClick={onClose}>📑 Executive Reports</MenuItem>
      {hasFeature(user?.plan_code, 'alertas') && <MenuItem href="/dashboard/alertas" onClick={onClose}>🔔 Policies &amp; Alerts</MenuItem>}
      {hasFeature(user?.plan_code, 'calculadora') && <MenuItem href="/dashboard/calculadora" onClick={onClose}>🧮 Project Calculator</MenuItem>}
      {user?.client_role === 'owner' && <MenuItem href="/dashboard/aws" onClick={onClose}>☁️ AWS Integration</MenuItem>}
      {user?.client_role === 'owner' && <MenuItem href="/dashboard/ClientAdministration" onClick={onClose}>⚙️ Organization Settings</MenuItem>}
      <MenuItem href="/dashboard/soporte" onClick={onClose}>🎫 FinOpsLatam Support</MenuItem>
      <MenuDividerItem href="/perfil" onClick={onClose}>👤 Account</MenuDividerItem>
    </>
  );
}

export default function UserMenu() {
  const { user, logout, isStaff, isFoundation } = useAuth();
  const [open, setOpen]           = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    setOpen(false);
    setShowToast(true);
    setTimeout(logout, 1200);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="relative">
          <button onClick={e => { e.stopPropagation(); setOpen(!open); }} className="border-2 border-blue-500 text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition">
            Mi cuenta
          </button>
          {open && (
            <div onClick={e => e.stopPropagation()} className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border overflow-hidden z-40">
              <Link href="/dashboard" className="block px-4 py-3 hover:bg-blue-50" onClick={() => setOpen(false)}>📊 Dashboard</Link>
              {isStaff
                ? <StaffMenuItems onClose={() => setOpen(false)} />
                : <ClientMenuItems onClose={() => setOpen(false)} user={user} isFoundation={isFoundation} />
              }
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t">🚪 Logout</button>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-out">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">✅ Sesión cerrada con éxito</div>
        </div>
      )}
    </>
  );
}
