import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicios FinOps en Chile y Latinoamérica',
  description:
    'Planes FinOps para empresas de Chile y LATAM: visibilidad de costos multi-cloud (AWS, Azure y GCP), optimización continua, gobernanza cloud y acompañamiento estratégico.',
  keywords: [
    'servicios FinOps Chile',
    'planes FinOps',
    'FinOps multi-cloud',
    'optimización AWS LATAM',
    'optimización Azure LATAM',
    'optimización GCP LATAM',
    'gobernanza cloud',
  ],
  alternates: {
    canonical: '/servicios',
  },
  openGraph: {
    title: 'Servicios FinOps en Chile y Latinoamérica',
    description:
      'Planes FinOps para empresas de Chile y LATAM con enfoque en ahorro, eficiencia y control financiero cloud.',
    url: '/servicios',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios FinOps en Chile y Latinoamérica',
    description:
      'Planes FinOps para empresas de Chile y LATAM con enfoque en ahorro, eficiencia y control financiero cloud.',
  },
};

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
