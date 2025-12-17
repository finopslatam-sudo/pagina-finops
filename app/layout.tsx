import './globals.css';
import PublicNavbar from './components/layout/PublicNavbar';

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
        {/* NAVBAR GLOBAL CON LOGIN */}
        <PublicNavbar />

        {/* CONTENIDO DE LAS PÁGINAS */}
        {children}
      </body>
    </html>
  );
}
