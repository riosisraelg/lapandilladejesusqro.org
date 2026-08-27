import { Suspense } from 'react';
import type { Metadata } from 'next';
import CalendarioClient from './CalendarioClient';
import { getMisasDePrecepto } from '../../data/preceptoData';

interface PageProps {
  searchParams: Promise<{ evento?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const eventId = params.evento;

  const baseTitle = 'Calendario de Eventos - La Pandilla de Jesús · Querétaro';
  const baseDescription =
    'Consulta los próximos retiros, misas de precepto, colectas, misiones y reuniones de La Pandilla de Jesús en la Parroquia de La Sagrada Familia, Querétaro.';

  if (!eventId) {
    return {
      title: baseTitle,
      description: baseDescription,
      alternates: {
        canonical: '/calendario',
      },
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        url: 'https://lapandilladejesusqro.org/calendario',
        images: [
          {
            url: '/api/og?title=Calendario+de+Eventos&category=Comunidad+Católica',
            width: 1200,
            height: 630,
            alt: 'Calendario de La Pandilla de Jesús',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: baseTitle,
        description: baseDescription,
        images: ['/api/og?title=Calendario+de+Eventos&category=Comunidad+Católica'],
      },
    };
  }

  // Look for the specific event in Precepto data
  const currentYear = new Date().getFullYear();
  const allPreceptos = [
    ...getMisasDePrecepto(currentYear - 1),
    ...getMisasDePrecepto(currentYear),
    ...getMisasDePrecepto(currentYear + 1),
  ];
  const found = allPreceptos.find((e) => e.id === eventId);

  const eventTitle = found ? found.title : 'Evento de la Comunidad';
  const eventDesc = found
    ? `${found.description} (${found.date} en ${found.location})`
    : baseDescription;
  const eventCategory = found && found.isPrecepto ? 'Misa de Precepto' : 'Evento Parroquial';
  const eventDate = found ? found.date : '';

  const ogImageUrl = `/api/og?title=${encodeURIComponent(eventTitle)}&category=${encodeURIComponent(
    eventCategory
  )}&date=${encodeURIComponent(eventDate)}&location=${encodeURIComponent(
    found?.location || 'Parroquia de la Sagrada Familia, Querétaro'
  )}`;

  const pageTitle = `${eventTitle} • La Pandilla de Jesús`;

  return {
    title: pageTitle,
    description: eventDesc,
    alternates: {
      canonical: `/calendario?evento=${encodeURIComponent(eventId)}`,
    },
    openGraph: {
      title: pageTitle,
      description: eventDesc,
      url: `https://lapandilladejesusqro.org/calendario?evento=${encodeURIComponent(eventId)}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: eventTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: eventDesc,
      images: [ogImageUrl],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando calendario...</div>}>
      <CalendarioClient />
    </Suspense>
  );
}
