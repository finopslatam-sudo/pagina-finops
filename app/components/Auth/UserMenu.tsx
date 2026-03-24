'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { hasFeature } from '@/app/lib/hasFeature';
import NotificationBell from '@/app/components/NotificationBell';
import { useT } from '@/app/lib/useT';

/* =====================================================
   COMPONENT
===================================================== */

export default function UserMenu() {

  const { user, logout, isStaff, isFoundation } = useAuth();
  const t = useT();

  const [open, setOpen] = useState(false);
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

    setTimeout(() => {

      logout();

    }, 1200);

  };

  return (

    <>

      <div className="flex items-center gap-2">

        <NotificationBell />

        <div className="relative">

          <button
            onClick={(e) => {

              e.stopPropagation();
              setOpen(!open);

            }}
            className="border-2 border-blue-500 text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {t.menu.myAccount}
          </button>

        {open && (

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border overflow-hidden z-40"
          >

            {/* =========================
              DASHBOARD — TODOS
            ========================== */}

            <Link
              href="/dashboard"
              className="block px-4 py-3 hover:bg-blue-50"
              onClick={() => setOpen(false)}
            >
              {t.menu.dashboard}
            </Link>


            {/* =========================
              STAFF MENU (SIN CAMBIOS)
            ========================== */}
            {isStaff && (

            <>

              <Link
                href="/dashboard/users"
                className="block px-4 py-3 hover:bg-blue-50 border-t"
                onClick={() => setOpen(false)}
              >
                {t.menu.usersPanel}
              </Link>

              <Link
                href="/dashboard/clients"
                className="block px-4 py-3 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                {t.menu.clientsPanel}
              </Link>

              {/* =========================
                  PLAN UPGRADE APPROVALS
              ========================== */}

              <Link
                href="/dashboard/admin/upgrades"
                className="block px-4 py-3 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                {t.menu.upgradeApprovals}
              </Link>

              <Link
                href="/dashboard/admin/soporte"
                className="block px-4 py-3 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                {t.menu.supportTickets}
              </Link>

            </>
            )}


            {/* =========================
              CLIENT MENU
            ========================== */}

            {!isStaff && (

              <>

                <Link
                  href="/dashboard/findings"
                  className="block px-4 py-3 hover:bg-blue-50 border-t"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.findings}
                </Link>

                <Link
                  href="/dashboard/assets"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.assets}
                </Link>

                <Link
                  href="/dashboard/costos"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.costs}
                </Link>

                {!isFoundation && (

                <Link
                  href="/dashboard/optimization"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.savings}
                </Link>
                )}

                {!isFoundation && (

                <Link
                  href="/dashboard/gobernanza"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.governance}
                </Link>
              )}


                {/* =========================
                  INFORMES — TODOS LOS PLANES
                ========================== */}

                <Link
                  href="/dashboard/informes"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.reports}
                </Link>

                {/* =========================
                  POLÍTICAS & ALERTAS — SOLO ENTERPRISE
                ========================== */}

                {hasFeature(user?.plan_code, 'alertas') && (
                  <Link
                    href="/dashboard/alertas"
                    className="block px-4 py-3 hover:bg-blue-50"
                    onClick={() => setOpen(false)}
                  >
                    {t.menu.alerts}
                  </Link>
                )}

                {/* =========================
                  AWS INTEGRATION
                  SOLO OWNER
                ========================== */}

                {user.client_role === "owner" && (

                  <Link
                    href="/dashboard/aws"
                    className="block px-4 py-3 hover:bg-blue-50"
                    onClick={() => setOpen(false)}
                  >
                    {t.menu.aws}
                  </Link>

                )}


                {/* =========================
                  CLIENT ADMINISTRATION
                  SOLO OWNER
                ========================== */}

                {user.client_role === "owner" && (

                  <Link
                    href="/dashboard/ClientAdministration"
                    className="block px-4 py-3 hover:bg-blue-50"
                    onClick={() => setOpen(false)}
                  >
                    {t.menu.orgSettings}
                  </Link>

                )}

                {/* =========================
                  SOPORTE — TODOS LOS PLANES
                ========================== */}

                <Link
                  href="/dashboard/soporte"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.support}
                </Link>


                {/* =========================
                  ACCOUNT
                ========================== */}

                <Link
                  href="/perfil"
                  className="block px-4 py-3 hover:bg-blue-50 border-t"
                  onClick={() => setOpen(false)}
                >
                  {t.menu.account}
                </Link>

              </>

            )}


            {/* =========================
              LOGOUT
            ========================== */}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
            >
              {t.menu.logout}
            </button>

          </div>

        )}

        </div>  {/* fin .relative (dropdown Mi cuenta) */}

      </div>  {/* fin .flex (campana + Mi cuenta) */}


      {/* =========================
        LOGOUT TOAST
      ========================== */}

      {showToast && (

        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-out">

          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">

            ✅ Sesión cerrada con éxito

          </div>

        </div>

      )}

    </>

  );

}
