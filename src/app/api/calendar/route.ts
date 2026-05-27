import { NextResponse } from 'next/server';
import { ICAL_FEED_URL } from '../../../config';

// Evita que Next.js compile estáticamente esta ruta en tiempo de construcción.
// Esto obliga a que la función serverless se ejecute siempre de forma dinámica al recibir una solicitud.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!ICAL_FEED_URL) {
      return new NextResponse('Error: ICAL_FEED_URL no está configurada.', { status: 500 });
    }

    // Agregar un parámetro de tiempo dinámico como destructor de caché (cache buster)
    const cleanUrl = ICAL_FEED_URL.includes('?') 
      ? `${ICAL_FEED_URL}&t=${Date.now()}` 
      : `${ICAL_FEED_URL}?t=${Date.now()}`;

    // Realizar la petición HTTP directa desde el servidor de Vercel (libre de CORS)
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 } // Solicitar explícitamente a Next.js que no almacene en caché el fetch en Vercel
    });

    if (!response.ok) {
      console.error(`Error en la llamada de Vercel al calendar: ${response.status} ${response.statusText}`);
      return new NextResponse(`Error al descargar el calendario de Google: ${response.statusText}`, { 
        status: response.status 
      });
    }

    const icsText = await response.text();

    // Devolver el contenido del iCal crudo con cabeceras estrictas contra el almacenamiento en caché
    return new NextResponse(icsText, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Excepción atrapada en el Proxy Serverless:', error);
    return new NextResponse(error.message || 'Error Interno del Servidor', { status: 500 });
  }
}
