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
  let found: any = allPreceptos.find((e) => e.id === eventId);
  
  // Try fetching iCal feed to find the event if not found in preceptos
  if (!found) {
    try {
      const { fetchICalFeed } = await import('../../utils/icalParser');
      const { ICAL_FEED_URL } = await import('../../config');
      if (ICAL_FEED_URL) {
        const iCalEvents = await fetchICalFeed(ICAL_FEED_URL);
        found = iCalEvents.find((e: any) => e.id === eventId);
      }
    } catch (e) {
      console.error("Error fetching iCal for OG generation:", e);
    }
  }

  const eventTitle = found ? found.title : 'Evento de la Comunidad';
  let eventDesc = baseDescription;
  if (found) {
    eventDesc = found.description ? `${found.description}` : '';
    eventDesc += ` (${found.date} en ${found.location || 'Parroquia de la Sagrada Familia'})`;
  }
  const eventCategory = found && found.isPrecepto ? 'Misa de Precepto' : (found && found.type ? found.type : 'Evento Parroquial');
  const eventDate = found ? found.date : '';
  const eventTime = found && found.time ? found.time : '';
  const eventLocation = found && found.location ? found.location : 'Parroquia de la Sagrada Familia, Querétaro';

  const ogImageUrl = `/api/og?title=${encodeURIComponent(eventTitle)}&category=${encodeURIComponent(
    eventCategory
  )}&date=${encodeURIComponent(eventDate)}&time=${encodeURIComponent(eventTime)}&location=${encodeURIComponent(
    eventLocation
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
