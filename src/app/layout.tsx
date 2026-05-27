import './global.css';
import { Outfit, Cormorant_Garamond } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'La Pandilla de Jesús - Grupo Juvenil Católico · Parroquia de La Sagrada Familia',
  description: 'Somos el grupo de jóvenes católicos de la Parroquia de La Sagrada Familia en Jardines de la Hacienda, pertenecientes a la Diócesis de Querétaro. Encuentros, retiros Kerigma, horas santas y misiones juveniles.',
  keywords: 'grupo juvenil catolico queretaro, grupo de jovenes catolicos, pastoral juvenil queretaro, la pandilla de jesus, parroquia de la sagrada familia queretaro, diocesis de queretaro, retiro espiritual jovenes queretaro, retiros catolicos queretaro, misiones catolicas queretaro',
  metadataBase: new URL('https://lapandilladejesusqro.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'La Pandilla de Jesús - Grupo Juvenil Católico',
    description: 'Comunidad juvenil católica de la Parroquia de La Sagrada Familia en Jardines de la Hacienda, Diócesis de Querétaro. Misiones, retiros y asambleas.',
    url: 'https://lapandilladejesusqro.org',
    siteName: 'La Pandilla de Jesús',
    locale: 'es_MX',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "YouthClub",
        "@id": "https://lapandilladejesusqro.org/#organization",
        "name": "La Pandilla de Jesús",
        "description": "Comunidad Juvenil Católica de la Parroquia de La Sagrada Familia, Diócesis de Querétaro. Organizamos retiros Kerigma, misiones, horas santas y asambleas semanales los martes a las 8:00 PM.",
        "url": "https://lapandilladejesusqro.org",
        "logo": "https://lapandilladejesusqro.org/logo.png",
        "image": "https://lapandilladejesusqro.org/community.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Blvrd Jardines de la Hacienda 710, Jardines de la Hacienda",
          "addressLocality": "Santiago de Querétaro",
          "addressRegion": "Qro.",
          "postalCode": "76180",
          "addressCountry": "MX"
        },
        "sameAs": [
          "https://lasagradafamiliaqro.org/"
        ]
      },
      {
        "@type": "PlaceOfWorship",
        "@id": "https://lapandilladejesusqro.org/#temple",
        "name": "Parroquia de La Sagrada Familia",
        "description": "Templo católico sede de la pastoral de jóvenes y comunidad de La Pandilla de Jesús en la Diócesis de Querétaro.",
        "url": "https://lasagradafamiliaqro.org/",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Blvrd Jardines de la Hacienda 710, Jardines de la Hacienda",
          "addressLocality": "Santiago de Querétaro",
          "addressRegion": "Qro.",
          "postalCode": "76180",
          "addressCountry": "MX"
        }
      }
    ]
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} ${cormorant.variable} landing-body`}>
        {children}
      </body>
    </html>
  );
}
