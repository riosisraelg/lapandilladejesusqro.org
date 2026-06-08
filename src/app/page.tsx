import LandingClient from './LandingClient';

export const metadata = {
  title: 'La Pandilla de Jesús - Grupo Juvenil Católico · Querétaro',
  description: 'Somos el grupo de jóvenes católicos de la Parroquia de La Sagrada Familia en Jardines de la Hacienda, Querétaro. Encuentros, retiros Kerigma, horas santas y misiones.',
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  return <LandingClient />;
}
