import './globals.css';

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
        <main>{children}</main>
      </body>
    </html>
  );
}
