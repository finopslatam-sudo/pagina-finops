import './globals.css'
import { AuthProvider } from './context/AuthContext'

export const metadata = {
  title: 'FinOpsLatam - Optimización de Costos en la Nube',
  description:
    'Expertos en FinOps, optimización de costos AWS y automatización cloud para empresas latinoamericanas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
