'use client';

import './globals.css';

/* =====================================================
   ROOT LAYOUT — FINOPSLATAM
   Punto de entrada global del frontend
===================================================== */

import { AuthProvider } from './context/AuthContext';
import PublicNavbar from './components/layout/PublicNavbar';
import SessionExpiredModal from './components/Auth/SessionExpiredModal';

/* =====================================================
   METADATA
===================================================== */

export const metadata = {
  title: 'FinOpsLatam',
  description: 'Optimización de costos en la nube',
};

/* =====================================================
   ROOT LAYOUT
===================================================== */

/**
 * RootLayout
 *
 * Responsabilidades:
 * - Definir estructura HTML base
 * - Cargar providers globales (Auth)
 * - Renderizar layout público común
 *
 * Importante:
 * - NO contiene lógica de negocio
 * - NO decide permisos
 * - La seguridad se delega a:
 *   - AuthContext
 *   - PrivateRoute
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">

        {/* =========================
           PROVIDER GLOBAL DE AUTH
           - Maneja sesión
           - Maneja permisos derivados
           - Maneja rehidratación
        ========================== */}
        <AuthProvider>

          {/* =========================
             MODAL GLOBAL DE SESIÓN EXPIRADA
             - Se activa desde AuthContext
             - No contiene lógica de negocio
          ========================== */}
          <SessionExpiredModal />

          {/* =========================
             NAVBAR PÚBLICO / GLOBAL
          ========================== */}
          <PublicNavbar />

          {/* =========================
             CONTENIDO DE LA APP
          ========================== */}
          <main>{children}</main>

        </AuthProvider>
      </body>
    </html>
  );
}