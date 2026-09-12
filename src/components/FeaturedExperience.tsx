'use client';

import React from 'react';
import { siteContent } from '@/content/siteContent';

interface FeaturedExperienceProps {
  onOpenCaseStudy: () => void;
}

export const FeaturedExperience: React.FC<FeaturedExperienceProps> = ({ onOpenCaseStudy }) => {
  return (
    <section
      id="featured"
      aria-label="CHANDRA Featured Experience"
      style={{
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        position: 'relative',
        padding: 'clamp(80px, 9vw, 150px) var(--page-pad-x)',
        borderTop: '1px solid rgba(248, 247, 243, 0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        {/* Main Split: Left Copy & Right Turntable Visual */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
            alignItems: 'center',
            marginBottom: '64px',
          }}
          className="featured-split"
        >
          {/* Left Title & Action Block */}
          <div style={{ maxWidth: '540px' }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.24em',
                color: 'var(--color-gold)',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              {siteContent.featured.eyebrow}
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 5.5vw, 76px)',
                fontWeight: 400,
                lineHeight: 0.96,
                letterSpacing: '-0.025em',
                color: 'var(--color-white)',
                margin: '0 0 20px 0',
              }}
            >
              {siteContent.featured.title}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'var(--color-white)',
                opacity: 0.8,
                textTransform: 'uppercase',
                marginBottom: '36px',
              }}
            >
              {siteContent.featured.tagline}
            </p>

            <button
              onClick={onOpenCaseStudy}
              className="btn-primary-gold"
              aria-label="View Global Product Launch Case Study"
            >
              <span>{siteContent.featured.cta}</span>
            </button>
          </div>

          {/* Right Turntable Reveal Image with Floating Accent */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '2px',
              overflow: 'hidden',
              backgroundColor: 'var(--color-black)',
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
              <img
                src="/media/featured-launch.webp"
                alt="Automotive product reveal with vehicle under silk wrap on illuminated circular arena stage"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.06)',
                }}
              />

              {/* Inset Shadow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(7,8,7,0.4) 0%, transparent 40%, rgba(7,8,7,0.5) 100%)',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />

              {/* Floating Typography Accent (Matching Reference) */}
              <div
                style={{
                  position: 'absolute',
                  top: '32px',
                  right: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  zIndex: 5,
                }}
              >
                {siteContent.featured.visualOverlay.map((word) => (
                  <span
                    key={word}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      color: 'var(--color-white)',
                      opacity: 0.85,
                      textTransform: 'uppercase',
                    }}
                  >
                    {word}
                  </span>
                ))}
                <div
                  style={{
                    width: '28px',
                    height: '1px',
                    backgroundColor: 'rgba(248, 247, 243, 0.4)',
                    marginTop: '6px',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Proof Points (Divided by Subtle Vertical Rules) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            borderTop: '1px solid rgba(248, 247, 243, 0.1)',
            paddingTop: '40px',
          }}
          className="stats-grid"
        >
          {siteContent.featured.stats.map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px 24px',
                borderRight: idx < siteContent.featured.stats.length - 1 ? '1px solid rgba(248, 247, 243, 0.08)' : 'none',
              }}
              className="stat-col"
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-white)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  color: 'var(--color-muted-dark)',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .featured-split {
            grid-template-columns: 42% 58% !important;
          }
        }
        @media (max-width: 768px) {
          .stat-col {
            border-right: none !important;
            border-bottom: 1px solid rgba(248, 247, 243, 0.08);
            padding: 16px 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
