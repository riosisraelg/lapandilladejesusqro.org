import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Donaciones · La Pandilla de Jesús',
  description: 'Sitio de donaciones en construcción para la comunidad de La Pandilla de Jesús.',
};

export default function DonacionesPage() {
  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--cream, #FAF7F2)',
      color: 'var(--text-dark, #2D1B0E)',
      padding: '2rem 1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--white, #FFFFFF)',
        border: '1px solid var(--border-subtle, rgba(45, 27, 14, 0.12))',
        borderRadius: '24px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(45, 27, 14, 0.08)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(197, 148, 78, 0.15)',
          color: 'var(--gold, #C5944E)',
          marginBottom: '1.5rem',
          fontSize: '1.8rem'
        }}>
          🕊️
        </div>

        <span style={{
          display: 'inline-block',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--coffee, #5C3D2E)',
          background: 'rgba(92, 61, 46, 0.1)',
          padding: '4px 12px',
          borderRadius: '999px',
          marginBottom: '1rem'
        }}>
          En Construcción
        </span>

        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: 'var(--text-dark, #2D1B0E)',
          marginBottom: '0.75rem',
          lineHeight: 1.25
        }}>
          Sitio de Donación
        </h1>

        <p style={{
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: 'var(--text-body, #604B3E)',
          marginBottom: '2rem'
        }}>
          Estamos preparando este espacio para la comunidad de <strong>La Pandilla de Jesús</strong>. Muy pronto podrás apoyar directamente nuestras misiones, retiros y apostolados.
        </p>

        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: 'var(--coffee, #5C3D2E)',
          color: '#FFFFFF',
          textDecoration: 'none',
          padding: '0.75rem 1.75rem',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '0.92rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(92, 61, 46, 0.25)'
        }}>
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
