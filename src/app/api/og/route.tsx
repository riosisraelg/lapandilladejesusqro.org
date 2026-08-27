import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function hashStringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'La Pandilla de Jesús • Querétaro';
    const category = searchParams.get('category') || 'Evento Parroquial';
    const date = searchParams.get('date') || '';
    const time = searchParams.get('time') || '';
    const location = searchParams.get('location') || 'Parroquia de la Sagrada Familia, Querétaro';

    // Unique random color based on event title
    const hue1 = hashStringToHue(title);
    const hue2 = (hue1 + 120) % 360;

    // Format display date if YYYY-MM-DD
    let displayDate = date;
    if (date && date.includes('-') && date.length === 10) {
      try {
        const [y, m, d] = date.split('-');
        const months = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const monthName = months[parseInt(m, 10) - 1] || m;
        displayDate = `${parseInt(d, 10)} de ${monthName}, ${y}`;
      } catch {
        displayDate = date;
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 70px',
            backgroundColor: '#0d1322',
            backgroundImage: `radial-gradient(circle at 85% 15%, hsla(${hue1}, 70%, 40%, 0.4) 0%, transparent 60%), radial-gradient(circle at 10% 90%, hsla(${hue2}, 60%, 30%, 0.5) 0%, transparent 60%)`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          {/* Top Bar / Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d4a359 0%, #b88636 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1a1309',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px rgba(212, 163, 89, 0.4)',
                }}
              >
                ✝
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  La Pandilla de Jesús
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#d4a359',
                    letterSpacing: '0.5px',
                  }}
                >
                  Comunidad Juvenil Católica · Querétaro
                </span>
              </div>
            </div>

            {/* Category Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 24px',
                borderRadius: '999px',
                backgroundColor: 'rgba(212, 163, 89, 0.15)',
                border: '1.5px solid rgba(212, 163, 89, 0.45)',
                color: '#f3d99f',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          </div>

          {/* Center Content: Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1060px',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? '72px' : '96px',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 15px rgba(0,0,0,0.6)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Bar: Date, Time, Location & Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
              paddingTop: '32px',
              borderTop: '2px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {displayDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF', fontSize: '32px', fontWeight: 600 }}>
                    <span style={{ color: '#d4a359' }}>📅</span>
                    <span>{displayDate}</span>
                  </div>
                )}
                {time && time !== 'Todo el día' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFFFFF', fontSize: '32px', fontWeight: 600 }}>
                    <span style={{ color: '#d4a359' }}>⏰</span>
                    <span>{time}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4cbdb', fontSize: '28px', fontWeight: 500 }}>
                <span style={{ color: '#d4a359' }}>📍</span>
                <span>{location}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                color: '#8e9aaf',
                fontSize: '22px',
                fontWeight: 500,
              }}
            >
              <span>lapandilladejesusqro.org</span>
              <span style={{ color: '#d4a359', fontSize: '18px' }}>Parroquia de La Sagrada Familia</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
