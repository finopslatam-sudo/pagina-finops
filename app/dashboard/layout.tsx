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

        <div className="flex items-center">

          <h1 className="text-xl font-semibold text-gray-800">
            Dashboard
          </h1>

        </div>

        {/* ================= CONTENIDO ================= */}

        {children}

      </div>

      {/* ================= SESSION MODAL ================= */}

      <SessionExpiredModal />

    </AwsAccountProvider>

  );

}
