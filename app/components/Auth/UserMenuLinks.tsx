import Link from 'next/link';
import { hasFeature } from '@/app/lib/hasFeature';

type User = {
  plan_code?: string | null;
  client_role?: string | null;
};

export function StaffMenuLinks({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Link href="/dashboard/users" className="block px-4 py-3 hover:bg-blue-50 border-t" onClick={onClose}>
        👥 Panel de Usuarios
      </Link>
      <Link href="/dashboard/clients" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        🏢 Panel de Clientes
      </Link>
      <Link href="/dashboard/admin/upgrades" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        📈 Aprobaciones de Upgrade
      </Link>
      <Link href="/dashboard/admin/soporte" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        🎫 Tickets de Soporte
      </Link>
    </>
  );
}

export function ClientMenuLinks({ user, isFoundation, onClose }: {
  user: User;
  isFoundation: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <Link href="/dashboard/findings" className="block px-4 py-3 hover:bg-blue-50 border-t" onClick={onClose}>
        🔎 Findings & Optimization
      </Link>
      <Link href="/dashboard/assets" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        📦 Risk & Assets
      </Link>
      <Link href="/dashboard/costos" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        💰 Cost & Financials
      </Link>
      {!isFoundation && (
        <Link href="/dashboard/optimization" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
          🚀 RI & Savings Plans
        </Link>
      )}
      {!isFoundation && (
        <Link href="/dashboard/gobernanza" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
          🏛 Governance
        </Link>
      )}
      <Link href="/dashboard/informes" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        📑 Executive Reports
      </Link>
      {hasFeature(user?.plan_code, 'alertas') && (
        <Link href="/dashboard/alertas" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
          🔔 Policies & Alerts
        </Link>
      )}
      {hasFeature(user?.plan_code, 'calculadora') && (
        <Link href="/dashboard/calculadora" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
          🧮 Project Calculator
        </Link>
      )}
      {user.client_role === 'owner' && (
        <Link href="/dashboard/aws" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
          ☁️ AWS Integration
        </Link>
      )}
      {user.client_role === 'owner' && (
        <Link href="/dashboard/ClientAdministration" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
          ⚙️ Organization Settings
        </Link>
      )}
      <Link href="/dashboard/soporte" className="block px-4 py-3 hover:bg-blue-50" onClick={onClose}>
        🎫 FinOpsLatam Support
      </Link>
      <Link href="/perfil" className="block px-4 py-3 hover:bg-blue-50 border-t" onClick={onClose}>
        👤 Account
      </Link>
    </>
  );
}
