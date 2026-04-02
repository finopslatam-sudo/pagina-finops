import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog FinOps Chile y Latinoamérica',
  description:
    'Recursos y guías FinOps para Chile y LATAM: optimización de costos cloud, gobierno financiero AWS y mejores prácticas oficiales.',
  keywords: [
    'blog FinOps Chile',
    'FinOps LATAM',
    'AWS Cost Optimization',
    'Cloud Financial Management',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog FinOps Chile y Latinoamérica',
    description:
      'Recursos y guías FinOps para Chile y LATAM sobre ahorro cloud, gobierno financiero y buenas prácticas AWS.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog FinOps Chile y Latinoamérica',
    description:
      'Recursos y guías FinOps para Chile y LATAM sobre ahorro cloud, gobierno financiero y buenas prácticas AWS.',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
