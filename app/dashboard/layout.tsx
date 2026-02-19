"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
