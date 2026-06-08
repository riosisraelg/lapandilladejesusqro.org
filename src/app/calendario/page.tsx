import CalendarioClient from './CalendarioClient';

export const metadata = {
  title: 'Calendario de Eventos - La Pandilla de Jesús · Querétaro',
  description: 'Consulta los próximos retiros, misas, colectas, misiones y reuniones de La Pandilla de Jesús en la Parroquia de La Sagrada Familia, Querétaro.',
  alternates: {
    canonical: '/calendario',
  },
};

export default function Page() {
  return <CalendarioClient />;
}
