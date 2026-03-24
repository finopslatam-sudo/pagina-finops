"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { LanguageProvider } from "@/app/context/LanguageContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LanguageProvider>
  );
}
