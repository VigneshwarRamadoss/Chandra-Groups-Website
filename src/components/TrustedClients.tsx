'use client';

import React from 'react';

/*
 * ──────────────────────────────────────────────────────────────
 * ⚠  PLACEHOLDER LOGOS — DESIGN ONLY
 *
 *    The brands listed below are NOT confirmed Chandra clients.
 *    Every logo in this array must be replaced with verified
 *    client assets before production launch.
 * ──────────────────────────────────────────────────────────────
 */

interface PlaceholderLogo {
  name: string;
  svg: string;
  hoverColor: string;
  opticalWidth: number;
  desktopGap: number;
}

const PLACEHOLDER_LOGOS: PlaceholderLogo[] = [
  {
    name: 'Google',
    hoverColor: '#4285F4',
    opticalWidth: 90,
    desktopGap: 90,
    svg: `<svg viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="18" letter-spacing="0.06em">GOOGLE</text></svg>`,
  },
  {
    name: 'Apple',
    hoverColor: '#A2AAAD',
    opticalWidth: 70,
    desktopGap: 110,
    svg: `<svg viewBox="0 0 100 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="18" letter-spacing="0.06em">APPLE</text></svg>`,
  },
  {
    name: 'Nike',
    hoverColor: '#111',
    opticalWidth: 60,
    desktopGap: 120,
    svg: `<svg viewBox="0 0 100 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="700" font-size="18" letter-spacing="0.06em">NIKE</text></svg>`,
  },
  {
    name: 'Samsung',
    hoverColor: '#1428A0',
    opticalWidth: 105,
    desktopGap: 80,
    svg: `<svg viewBox="0 0 140 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="18" letter-spacing="0.06em">SAMSUNG</text></svg>`,
  },
  {
    name: 'Mercedes-Benz',
    hoverColor: '#333',
    opticalWidth: 140,
    desktopGap: 75,
    svg: `<svg viewBox="0 0 160 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="14" letter-spacing="0.06em">MERCEDES-BENZ</text></svg>`,
  },
  {
    name: 'Red Bull',
    hoverColor: '#DB0032',
    opticalWidth: 100,
    desktopGap: 95,
    svg: `<svg viewBox="0 0 130 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="700" font-size="18" letter-spacing="0.06em">RED BULL</text></svg>`,
  },
  {
    name: 'Spotify',
    hoverColor: '#1DB954',
    opticalWidth: 95,
    desktopGap: 85,
    svg: `<svg viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="18" letter-spacing="0.06em">SPOTIFY</text></svg>`,
  },
  {
    name: 'Rolex',
    hoverColor: '#006039',
    opticalWidth: 75,
    desktopGap: 105,
    svg: `<svg viewBox="0 0 100 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="18" letter-spacing="0.06em">ROLEX</text></svg>`,
  },
  {
    name: 'Coca-Cola',
    hoverColor: '#F40009',
    opticalWidth: 110,
    desktopGap: 70,
    svg: `<svg viewBox="0 0 140 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="600" font-size="15" letter-spacing="0.06em">COCA-COLA</text></svg>`,
  },
  {
    name: 'Adidas',
    hoverColor: '#000',
    opticalWidth: 80,
    desktopGap: 110,
    svg: `<svg viewBox="0 0 110 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" font-family="Inter,Helvetica,Arial,sans-serif" font-weight="700" font-size="18" letter-spacing="0.06em">ADIDAS</text></svg>`,
  },
];

export const TrustedClients: React.FC = () => {
  // We duplicate the track once so the marquee loops seamlessly
  const track = [...PLACEHOLDER_LOGOS, ...PLACEHOLDER_LOGOS];

  return (
    <section
      aria-label="Trusted Clients"
      style={{
        backgroundColor: 'var(--color-ivory)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Optional subtle top hairline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 'var(--page-pad-x)',
          right: 'var(--page-pad-x)',
          height: '1px',
          backgroundColor: 'var(--color-gold)',
          opacity: 0.2,
        }}
      />

      {/* Inner wrapper — compact vertical rhythm */}
      <div
        style={{
          padding: '24px var(--page-pad-x) 0',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        {/* Section label */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-muted-light)',
            marginBottom: '16px',
            userSelect: 'none',
          }}
        >
          SELECTED CLIENTS
        </p>
      </div>

      {/* ── Desktop: marquee (hidden on mobile) ── */}
      <div className="clients-marquee-wrap">
        <div className="clients-marquee-track">
          {track.map((logo, i) => (
            <span
              key={`${logo.name}-${i}`}
              className="client-logo"
              title={`${logo.name} — placeholder`}
              data-hover-color={logo.hoverColor}
              dangerouslySetInnerHTML={{ __html: logo.svg }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: `${logo.opticalWidth}px`,
                marginRight: `${logo.desktopGap}px`,
                height: '40px',
                flexShrink: 0,
                color: '#6B665F',
                opacity: 0.65,
                transition: 'opacity 400ms ease, color 400ms ease',
                cursor: 'default',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile: horizontal scroll (hidden on desktop) ── */}
      <div className="clients-mobile-scroll">
        {PLACEHOLDER_LOGOS.map((logo, i) => (
          <span
            key={`mob-${logo.name}-${i}`}
            className="client-logo"
            title={`${logo.name} — placeholder`}
            data-hover-color={logo.hoverColor}
            dangerouslySetInnerHTML={{ __html: logo.svg }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${logo.opticalWidth}px`,
              minWidth: `${logo.opticalWidth}px`,
              height: '40px',
              flexShrink: 0,
              color: '#6B665F',
              opacity: 0.65,
              transition: 'opacity 400ms ease, color 400ms ease',
              scrollSnapAlign: 'start',
            }}
          />
        ))}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: '28px' }} />

      {/* ── Styles ── */}
      <style jsx>{`
        /* ── Marquee animation ── */
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .clients-marquee-wrap {
          overflow: hidden;
          width: 100%;
          padding: 0 var(--page-pad-x);
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .clients-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee-scroll 42s linear infinite;
        }

        .clients-marquee-wrap:hover .clients-marquee-track {
          animation-play-state: paused;
        }

        .client-logo:hover {
          opacity: 1 !important;
        }

        /* ── Mobile scroll ── */
        .clients-mobile-scroll {
          display: none;
          gap: 40px;
          overflow-x: auto;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          padding: 0 var(--page-pad-x);
        }

        /* ── Responsive breakpoint ── */
        @media (min-width: 900px) {
          .clients-marquee-wrap {
            display: block;
          }
          .clients-mobile-scroll {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .clients-marquee-wrap {
            display: none !important;
          }
          .clients-mobile-scroll {
            display: flex !important;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .clients-marquee-track {
            animation: none !important;
          }
          .clients-marquee-wrap {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </section>
  );
};
