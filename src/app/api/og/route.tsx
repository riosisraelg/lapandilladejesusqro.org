import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function getDynamicTitleSize(len: number): string {
  if (len < 35) return '95px';
  if (len < 60) return '75px';
  if (len < 90) return '60px';
  if (len < 120) return '50px';
  return '42px';
}

function getDynamicLocationSize(len: number): string {
  return len > 60 ? '22px' : '30px';
}

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
    const origin = req.nextUrl.origin;
    const logoUrl = `${origin}/logo-pandilla.png`;

    const title = searchParams.get('title') || 'La Pandilla de Jesús • Querétaro';
    const category = searchParams.get('category') || 'Evento Parroquial';
    const date = searchParams.get('date') || '';
    const time = searchParams.get('time') || '';
    const location = searchParams.get('location') || 'Parroquia de la Sagrada Familia, Querétaro';

    // Truly unique random colors based on event title/date
    const seed = title + date;
    const hue1 = hashStringToHue(seed);
    const hue2 = (hue1 + 140) % 360;
    const hue3 = (hue1 + 220) % 360;

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
            backgroundColor: '#0a0f18',
            backgroundImage: `radial-gradient(circle at 10% 20%, hsla(${hue1}, 80%, 45%, 0.6) 0%, transparent 50%), radial-gradient(circle at 90% 80%, hsla(${hue2}, 75%, 40%, 0.6) 0%, transparent 50%), radial-gradient(circle at 50% 50%, hsla(${hue3}, 70%, 30%, 0.3) 0%, transparent 60%)`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          {/* Background pattern overlay to make it look even more unique */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.15,
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Top Bar / Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src={logoUrl}
                alt="La Pandilla de Jesús"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '30px',
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
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#f3d99f',
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
                padding: '12px 28px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)',
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
              justifyContent: 'center',
              flex: 1,
              gap: '16px',
              maxWidth: '1000px',
              marginTop: '40px',
              marginBottom: '40px',
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: getDynamicTitleSize(title.length),
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.7)',
                display: '-webkit-box',
                WebkitLineClamp: title.length > 90 ? 5 : 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Bar: Date, Time, Location */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%',
              paddingTop: '35px',
              borderTop: '2px solid rgba(255, 255, 255, 0.2)',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              {displayDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '36px', fontWeight: 700 }}>
                  <span style={{ color: '#d4a359' }}>📅</span>
                  <span>{displayDate}</span>
                </div>
              )}
              {time && time !== 'Todo el día' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '36px', fontWeight: 700 }}>
                  <span style={{ color: '#d4a359' }}>⏰</span>
                  <span>{time}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', fontSize: getDynamicLocationSize(location.length), fontWeight: 500 }}>
              <span style={{ color: '#d4a359', flexShrink: 0 }}>📍</span>
              <span style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{location}</span>
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
