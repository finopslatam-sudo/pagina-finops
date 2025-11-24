import './globals.css'
import { AuthProvider } from './context/AuthContext'  // ← Ruta ajustada

export const metadata = {
  title: 'FinOpsLatam - Optimización de Costos en la Nube',
  description: 'Expertos en FinOps, optimización de costos AWS y automatización cloud para empresas latinoamericanas.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>  {/* ← ENVOLVER CON AUTH PROVIDER */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}