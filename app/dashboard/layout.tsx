"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import SessionExpiredModal from "@/app/components/Auth/SessionExpiredModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionExpiredModal />
      {children}
    </AuthProvider>
  );
}
