'use client';

import PrivateRoute from '@/app/components/Auth/PrivateRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
}
