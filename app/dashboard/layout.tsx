'use client';

import SessionExpiredModal from "@/app/components/Auth/SessionExpiredModal";
import { AwsAccountProvider } from "./context/AwsAccountContext";
import { useT } from "@/app/lib/useT";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useT();

  return (

    <AwsAccountProvider>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-8">

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
              {t.footer.description}
            </p>
            <p className="text-xs text-slate-600">{t.footer.version}</p>
          </div>

          {/* Col 2 — Soporte */}
          <div className="space-y-3">
            <p className="text-white text-sm font-semibold">{t.footer.supportTitle}</p>
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
            <p className="text-white text-sm font-semibold">{t.footer.legal}</p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <span>🔒</span>
                <span>{t.footer.dataProtected}</span>
              </p>
              <p className="flex items-center gap-2">
                <span>🛡️</span>
                <span>{t.footer.highSecurity}</span>
              </p>
              <p className="flex items-center gap-2">
                <span>🔄</span>
                <span>{t.footer.autoScan}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} FinOpsLatam — {t.footer.rights}</span>
            <span className="hidden sm:block">·</span>
            <span>{t.footer.tagline}</span>
          </div>
        </div>

      </footer>

    </AwsAccountProvider>

  );

}
