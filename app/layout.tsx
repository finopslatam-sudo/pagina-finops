import './globals.css';
import PublicNavbar from './components/layout/PublicNavbar';
import { AuthProvider } from './context/AuthContext';

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
      <body className="min-h-screen bg-white">
        {/* PROVIDER GLOBAL DE AUTENTICACIÓN */}
        <AuthProvider>
          {/* NAVBAR GLOBAL */}
          <PublicNavbar />

          {/* CONTENIDO DE LAS PÁGINAS */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
