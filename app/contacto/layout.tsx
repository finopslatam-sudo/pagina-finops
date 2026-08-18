import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto FinOps en Chile y LATAM',
  description:
    'Agenda una consultoría FinOps para optimizar costos en AWS, Azure y GCP en Chile y Latinoamérica. Hablemos de ahorro cloud, gobernanza y eficiencia operativa.',
  keywords: [
    'contacto FinOps Chile',
    'consultoría AWS Chile',
    'consultoría Azure Chile',
    'consultoría GCP Chile',
    'optimización costos cloud LATAM',
  ],
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto FinOps en Chile y LATAM',
    description:
      'Agenda una consultoría FinOps para optimizar costos en AWS, Azure y GCP en Chile y Latinoamérica.',
    url: '/contacto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto FinOps en Chile y LATAM',
    description:
      'Agenda una consultoría FinOps para optimizar costos en AWS, Azure y GCP en Chile y Latinoamérica.',
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
