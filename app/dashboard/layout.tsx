'use client';

import SessionExpiredModal from "@/app/components/Auth/SessionExpiredModal";
import { AwsAccountProvider } from "./context/AwsAccountContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <AwsAccountProvider>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ================= HEADER GLOBAL ================= */}

        <div className="flex items-center" />

        {/* ================= CONTENIDO ================= */}

        {children}

      </div>

      {/* ================= SESSION MODAL ================= */}

      <SessionExpiredModal />

      {/* ================= FOOTER PLATAFORMA ================= */}

      <footer className="mt-16 bg-slate-900 text-slate-400">

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1 — Marca */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo2.png"
                alt="FinOpsLatam"
                className="h-9 w-9 rounded-lg object-contain bg-white/10 p-1"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-white font-semibold text-sm">FinOpsLatam</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Plataforma de optimización financiera para AWS. Monitoreo continuo,
              detección de hallazgos y reducción de costos en la nube.
            </p>
            <p className="text-xs text-slate-600">Versión 1.0 · Plataforma FinOps</p>
          </div>

          {/* Col 2 — Soporte */}
          <div className="space-y-3">
            <p className="text-white text-sm font-semibold">Soporte</p>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:contacto@finopslatam.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <span>✉️</span>
                <span>contacto@finopslatam.com</span>
              </a>
              <a
                href="mailto:soporte@finopslatam.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <span>🛠️</span>
                <span>soporte@finopslatam.com</span>
              </a>
              <a
                href="https://wa.me/56965090121"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <span>💬</span>
                <span>WhatsApp: +56 9 65090121</span>
              </a>
              <a
                href="https://www.linkedin.com/company/finopslatam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <span>🔗</span>
                <span>LinkedIn: FinOpsLatam</span>
              </a>
            </div>
          </div>

          {/* Col 3 — Legal */}
          <div className="space-y-3">
            <p className="text-white text-sm font-semibold">Legal & Plataforma</p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <span>🔒</span>
                <span>Tus datos están protegidos y cifrados</span>
              </p>
              <p className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Altos estándares de seguridad y privacidad</span>
              </p>
              <p className="flex items-center gap-2">
                <span>🔄</span>
                <span>Escaneos automáticos cada 24 horas</span>
              </p>
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados</span>
            <span className="hidden sm:block">·</span>
            <span>Plataforma FinOps para AWS · Chile</span>
          </div>
        </div>

      </footer>

    </AwsAccountProvider>

  );

}
