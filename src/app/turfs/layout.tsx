import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Browse Turfs',
  description:
    'Explore all sports turfs in Chennai. Filter by cricket, football, basketball & tennis. Book your preferred slot instantly online.',
  alternates: { canonical: 'https://turfbook.in/turfs' },
  openGraph: {
    title: 'Browse Sports Turfs in Chennai | TurfBook',
    description:
      'Cricket, football, basketball & tennis turfs in Chennai. Real-time availability, instant booking.',
    url: 'https://turfbook.in/turfs',
  },
};

export default function TurfsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
