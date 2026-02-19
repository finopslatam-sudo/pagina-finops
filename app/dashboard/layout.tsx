"use client";

import SessionExpiredModal from "@/app/components/Auth/SessionExpiredModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionExpiredModal />
      {children}
    </>
  );
}
