import React from 'react';

interface ArtworkProps {
  iconKey?: string;
  size?: number;
  className?: string;
}

export default function MysteryArtworkIcon({ iconKey, size = 52, className = '' }: ArtworkProps) {
  switch (iconKey) {
    // ── GOZOSOS ──
    case 'icon-annunciation':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Anunciación">
          <circle cx="32" cy="32" r="30" fill="rgba(212, 160, 23, 0.12)" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <path d="M32 14v16M24 22h16" stroke="var(--gold, #d4a017)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 42c4-8 10-12 14-12s10 4 14 12" stroke="#8b5cf6" strokeWidth="2" fill="rgba(139, 92, 246, 0.15)" />
          <circle cx="32" cy="24" r="5" fill="#d4a017" />
          <path d="M22 36l-6 10h12l-6-10z" fill="rgba(212, 160, 23, 0.25)" stroke="var(--gold, #d4a017)" strokeWidth="1.5" />
          <path d="M42 36l-6 10h12l-6-10z" fill="rgba(212, 160, 23, 0.25)" stroke="var(--gold, #d4a017)" strokeWidth="1.5" />
        </svg>
      );

    case 'icon-visitation':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Visitación">
          <circle cx="32" cy="32" r="30" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" />
          <circle cx="24" cy="24" r="6" fill="#10b981" />
          <circle cx="40" cy="24" r="6" fill="var(--gold, #d4a017)" />
          <path d="M16 48c0-8 5-14 11-14 3 0 5 2 5 5" stroke="#10b981" strokeWidth="2" fill="rgba(16, 185, 129, 0.2)" />
          <path d="M48 48c0-8-5-14-11-14-3 0-5 2-5 5" stroke="var(--gold, #d4a017)" strokeWidth="2" fill="rgba(212, 160, 23, 0.2)" />
          <path d="M28 32h8" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 20v-6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'icon-nativity':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Natividad">
          <circle cx="32" cy="32" r="30" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" strokeWidth="2" />
          <path d="M32 10l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="var(--gold, #d4a017)" />
          <path d="M18 46l14-8 14 8-14 4-14-4z" fill="rgba(180, 83, 9, 0.3)" stroke="#b45309" strokeWidth="2" />
          <circle cx="32" cy="38" r="4" fill="var(--gold, #d4a017)" />
          <path d="M26 38c0-3 3-5 6-5s6 2 6 5" stroke="var(--gold, #d4a017)" strokeWidth="1.5" />
          <path d="M14 52h36" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'icon-presentation':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Presentación">
          <circle cx="32" cy="32" r="30" fill="rgba(99, 102, 241, 0.12)" stroke="#6366f1" strokeWidth="2" />
          <path d="M18 48V28l14-10 14 10v20H18z" stroke="#6366f1" strokeWidth="2" fill="rgba(99, 102, 241, 0.15)" />
          <path d="M26 48V34h12v14" stroke="#6366f1" strokeWidth="2" />
          <circle cx="32" cy="38" r="3" fill="var(--gold, #d4a017)" />
          <path d="M32 12v6M29 15h6" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'icon-finding':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Niño Jesús en el Templo">
          <circle cx="32" cy="32" r="30" fill="rgba(14, 165, 233, 0.12)" stroke="#0ea5e9" strokeWidth="2" />
          <circle cx="32" cy="26" r="6" fill="var(--gold, #d4a017)" />
          <path d="M22 48c0-7 4.5-12 10-12s10 5 10 12H22z" fill="rgba(14, 165, 233, 0.25)" stroke="#0ea5e9" strokeWidth="2" />
          <path d="M16 28h8v16h-8zM40 28h8v16h-8z" stroke="#0ea5e9" strokeWidth="1.5" fill="rgba(14, 165, 233, 0.1)" />
          <path d="M32 14v4M26 16l3 2M38 16l-3 2" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // ── LUMINOSOS ──
    case 'icon-baptism':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Bautismo">
          <circle cx="32" cy="32" r="30" fill="rgba(6, 182, 212, 0.12)" stroke="#06b6d4" strokeWidth="2" />
          <path d="M32 12l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" fill="var(--gold, #d4a017)" />
          <path d="M14 44c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 50c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M32 24v12M28 28l4-4 4 4" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'icon-wedding-cana':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Bodas de Caná">
          <circle cx="32" cy="32" r="30" fill="rgba(236, 72, 153, 0.12)" stroke="#ec4899" strokeWidth="2" />
          <path d="M22 22h8v16c0 4-3 7-7 7h-2c-4 0-7-3-7-7V22h8z" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="2" />
          <path d="M42 22h8v16c0 4-3 7-7 7h-2c-4 0-7-3-7-7V22h8z" fill="rgba(212, 160, 23, 0.2)" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <path d="M28 14c4 2 8 2 12 0" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="30" r="3" fill="#ec4899" />
        </svg>
      );

    case 'icon-kingdom':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Anuncio del Reino">
          <circle cx="32" cy="32" r="30" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="2" />
          <path d="M20 20h24v28H20z" rx="2" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" />
          <path d="M32 26v16M26 32h12" stroke="var(--gold, #d4a017)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="14" r="3" fill="var(--gold, #d4a017)" />
        </svg>
      );

    case 'icon-transfiguration':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Transfiguración">
          <circle cx="32" cy="32" r="30" fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="32" cy="28" r="14" fill="#fbbf24" opacity="0.35" />
          <path d="M32 10v6M32 46v6M14 28h6M44 28h6M19 15l4 4M41 37l4 4M41 15l-4 4M19 37l-4 4" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="28" r="7" fill="var(--gold, #d4a017)" />
          <path d="M16 52c6-4 12-6 16-6s10 2 16 6" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'icon-eucharist':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Eucaristía">
          <circle cx="32" cy="32" r="30" fill="rgba(212, 160, 23, 0.15)" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <circle cx="32" cy="18" r="9" fill="#fef08a" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <path d="M32 14v8M28 18h8" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 34h20c0 8-4 14-10 14s-10-6-10-14z" fill="rgba(212, 160, 23, 0.3)" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <path d="M32 48v6M24 54h16" stroke="var(--gold, #d4a017)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // ── DOLOROSOS ──
    case 'icon-agony':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Oración en el Huerto">
          <circle cx="32" cy="32" r="30" fill="rgba(100, 116, 139, 0.15)" stroke="#64748b" strokeWidth="2" />
          <path d="M16 48c4-12 12-16 18-16 6 0 10 3 14 16H16z" fill="rgba(100, 116, 139, 0.25)" stroke="#64748b" strokeWidth="2" />
          <circle cx="38" cy="24" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          <path d="M42 22l6-8M44 26l8-2" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="20" r="3" fill="#64748b" opacity="0.6" />
        </svg>
      );

    case 'icon-scourging':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Flagelación">
          <circle cx="32" cy="32" r="30" fill="rgba(225, 29, 72, 0.12)" stroke="#e11d48" strokeWidth="2" />
          <rect x="28" y="14" width="8" height="36" rx="2" fill="rgba(225, 29, 72, 0.25)" stroke="#e11d48" strokeWidth="2" />
          <path d="M22 24c4 2 12 2 16 0M22 34c4 2 12 2 16 0M22 44c4 2 12 2 16 0" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 16l8 12M46 22l6 14" stroke="#881337" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'icon-crowning':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Coronación de Espinas">
          <circle cx="32" cy="32" r="30" fill="rgba(180, 83, 9, 0.15)" stroke="#b45309" strokeWidth="2" />
          <circle cx="32" cy="32" r="16" stroke="#b45309" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <path d="M20 20l4 4M44 20l-4 4M20 44l4-4M44 44l-4-4M32 14v6M32 44v6M14 32h6M44 32h6" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="32" r="6" fill="rgba(225, 29, 72, 0.3)" />
        </svg>
      );

    case 'icon-carrying-cross':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Cruz a Cuestas">
          <circle cx="32" cy="32" r="30" fill="rgba(120, 53, 15, 0.15)" stroke="#78350f" strokeWidth="2" />
          <path d="M14 50l32-32M24 16l24 24" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          <circle cx="26" cy="42" r="4" fill="var(--gold, #d4a017)" />
          <path d="M22 46l8-4" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'icon-crucifixion':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Crucifixión">
          <circle cx="32" cy="32" r="30" fill="rgba(159, 18, 57, 0.15)" stroke="#9f1239" strokeWidth="2" />
          <path d="M32 10v44M16 22h32" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="22" r="4" fill="var(--gold, #d4a017)" />
          <path d="M28 26c0 6 2 10 4 10s4-4 4-10" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <path d="M28 12h8" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // ── GLORIOSOS ──
    case 'icon-resurrection':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Resurrección">
          <circle cx="32" cy="32" r="30" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="2" />
          <circle cx="32" cy="24" r="10" fill="#fef08a" stroke="#eab308" strokeWidth="2" />
          <path d="M32 14v20M22 24h20" stroke="var(--gold, #d4a017)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 48c4-8 10-12 16-12s12 4 16 12H16z" fill="rgba(234, 179, 8, 0.3)" stroke="#eab308" strokeWidth="2" />
          <path d="M18 12l4 4M46 12l-4 4M10 28l6 1M54 28l-6 1" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'icon-ascension':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Ascensión">
          <circle cx="32" cy="32" r="30" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="32" cy="18" r="6" fill="var(--gold, #d4a017)" />
          <path d="M24 32c2-6 5-10 8-10s6 4 8 10" stroke="var(--gold, #d4a017)" strokeWidth="2" fill="rgba(212, 160, 23, 0.25)" />
          <path d="M14 46c3-4 8-4 12 0s8 4 12 0 8-4 12 0" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 36v10M28 38l4-4 4 4" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'icon-pentecost':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Pentecostés">
          <circle cx="32" cy="32" r="30" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="2" />
          <path d="M32 12c3 6 8 8 8 14 0 5-4 9-8 9s-8-4-8-9c0-6 5-8 8-14z" fill="#ef4444" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="32" cy="44" r="5" fill="var(--gold, #d4a017)" />
          <circle cx="20" cy="46" r="4" fill="#ef4444" opacity="0.8" />
          <circle cx="44" cy="46" r="4" fill="#ef4444" opacity="0.8" />
          <path d="M32 20c-1 3-3 4-3 7s2 4 3 4 3-1 3-4-2-4-3-7z" fill="#fef08a" />
        </svg>
      );

    case 'icon-assumption':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Asunción de la Virgen">
          <circle cx="32" cy="32" r="30" fill="rgba(147, 51, 234, 0.15)" stroke="#9333ea" strokeWidth="2" />
          <circle cx="32" cy="20" r="6" fill="var(--gold, #d4a017)" />
          <path d="M22 36c2-8 6-12 10-12s8 4 10 12" stroke="#9333ea" strokeWidth="2" fill="rgba(147, 51, 234, 0.25)" />
          <path d="M18 48c4-4 8-4 14-4s10 0 14 4" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 48c4 4 16 4 20 0" stroke="var(--gold, #d4a017)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'icon-coronation':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Coronación de la Virgen">
          <circle cx="32" cy="32" r="30" fill="rgba(212, 160, 23, 0.2)" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <path d="M18 28l4-10 10 6 10-6 4 10H18z" fill="rgba(212, 160, 23, 0.4)" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="22" cy="17" r="2" fill="var(--gold, #d4a017)" />
          <circle cx="32" cy="23" r="2" fill="var(--gold, #d4a017)" />
          <circle cx="42" cy="17" r="2" fill="var(--gold, #d4a017)" />
          <circle cx="32" cy="40" r="7" fill="rgba(147, 51, 234, 0.3)" stroke="#9333ea" strokeWidth="1.5" />
          <path d="M22 52c2-6 6-8 10-8s8 2 10 8" stroke="#9333ea" strokeWidth="2" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-label="Misterio del Rosario">
          <circle cx="32" cy="32" r="30" fill="rgba(212, 160, 23, 0.15)" stroke="var(--gold, #d4a017)" strokeWidth="2" />
          <circle cx="32" cy="32" r="14" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M32 20v24M20 32h24" stroke="var(--gold, #d4a017)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
