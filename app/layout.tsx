import './globals.css';
import ClientProviders from './ClientProviders';
import PublicNavbar from './components/layout/PublicNavbar';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: 'FinOpsLatam',
  description: 'Optimización de costos en la nube',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">
        <ClientProviders>

          {/* 🔵 NAVBAR GLOBAL */}
          <PublicNavbar />

          <main>{children}</main>

        </ClientProviders>
      </body>
    </html>
  );
}
