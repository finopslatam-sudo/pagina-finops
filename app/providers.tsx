"use client";

import { AuthProvider } from "./context/AuthContext";
import SessionExpiredModal from "./components/Auth/SessionExpiredModal";
import PublicNavbar from "./components/layout/PublicNavbar";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionExpiredModal />
      <PublicNavbar />
      {children}
    </AuthProvider>
  );
}