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
  title: 'La Pandilla de Jesús',
  description: 'Grupo Juvenil Católico de la Parroquia de La Sagrada Familia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${cormorant.variable} landing-body`}>
        {children}
      </body>
    </html>
  );
}
