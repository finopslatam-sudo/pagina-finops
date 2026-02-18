import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "FinOpsLatam",
  description: "Optimización de costos en la nube",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
