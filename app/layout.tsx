import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './ClientProviders';
import PublicNavbar from './components/layout/PublicNavbar';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.finopslatam.com';
const LOGO_URL = `${SITE_URL}/logo2.png`;

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FinOpsLatam',
  url: SITE_URL,
  logo: LOGO_URL,
  description:
    'Servicios FinOps para optimización de costos AWS en Chile y Latinoamérica.',
  sameAs: ['https://www.linkedin.com/company/finopslatam'],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+56-9-6509-0121',
      email: 'contacto@finopslatam.com',
      areaServed: ['CL', 'AR', 'PE', 'CO', 'MX', 'LATAM'],
      availableLanguage: ['es'],
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FinOpsLatam',
  url: SITE_URL,
  inLanguage: 'es-CL',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'FinOps Chile y Latinoamérica | FinOpsLatam',
    template: '%s | FinOpsLatam',
  },
  description:
    'Optimización de costos AWS para empresas de Chile y Latinoamérica. Implementamos FinOps, gobierno cloud y reducción de gasto con resultados medibles.',
  keywords: [
    'FinOps Chile',
    'FinOps Latinoamérica',
    'optimización de costos AWS Chile',
    'reducción de costos cloud',
    'gobierno financiero cloud',
    'Cloud Financial Management',
    'consultoría FinOps',
    'FinOpsLatam',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: '/',
    siteName: 'FinOpsLatam',
    title: 'FinOps Chile y Latinoamérica | FinOpsLatam',
    description:
      'Optimización de costos AWS para empresas de Chile y Latinoamérica con prácticas FinOps y gobierno cloud.',
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: 'FinOpsLatam - FinOps Chile y Latinoamérica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinOps Chile y Latinoamérica | FinOpsLatam',
    description:
      'Optimización de costos AWS para empresas de Chile y Latinoamérica con prácticas FinOps y gobierno cloud.',
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ClientProviders>

          {/* 🔵 NAVBAR GLOBAL */}
          <PublicNavbar />

          <main>{children}</main>

        </ClientProviders>
      </body>
    </html>
  );
}
