'use client';

import React from 'react';
import { siteContent } from '@/content/siteContent';

export const Process: React.FC = () => {
  // 5 Custom SVG Icons matching the approved reference design
  const renderStepIcon = (index: number) => {
    switch (index) {
      case 0: // Concept: Lightbulb
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M9 18h6m-4 3h2m-1-18a7 7 0 00-7 7c0 2.5 1.5 4.5 3 6v1h8v-1c1.5-1.5 3-3.5 3-6a7 7 0 00-7-7z" />
          </svg>
        );
      case 1: // Design: Architectural grid / framing
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
          </svg>
        );
      case 2: // Produce: Precision gear / production
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        );
      case 3: // Manage: Coordination / team
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        );
      case 4: // Deliver: Star climax
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
    }
  };

  return (
    <section
      id="process"
      aria-label="CHANDRA Process"
      style={{
        backgroundColor: 'var(--color-black)',
        color: 'var(--color-white)',
        position: 'relative',
        padding: 'clamp(90px, 10vw, 160px) var(--page-pad-x)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(248, 247, 243, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        {/* Eyebrow */}
        <div style={{ marginBottom: '64px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: 'var(--color-muted-dark)',
              textTransform: 'uppercase',
            }}
          >
            {siteContent.process.eyebrow}
          </span>
        </div>

        {/* Process Main Layout: 5 Steps with Connecting Line & Right Tagline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="process-split"
        >
          {/* Steps Timeline */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '20px 0',
            }}
            className="steps-wrapper"
          >
            {/* Subtle Horizontal Connecting Line */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '28px',
                right: '28px',
                height: '1px',
                backgroundColor: 'rgba(198, 161, 91, 0.35)',
                transform: 'translateY(-16px)',
                zIndex: 1,
              }}
              className="connecting-line"
            />

            {siteContent.process.steps.map((step, idx) => (
              <div
                key={step.id}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '18px',
                }}
              >
                {/* Circular Node */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    border: '1px solid rgba(198, 161, 91, 0.65)',
                    backgroundColor: 'var(--color-charcoal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-white)',
                    transition: 'border-color var(--duration-fast) ease, transform var(--duration-fast) ease',
                  }}
                >
                  {renderStepIcon(idx)}
                </div>

                {/* Step Label */}
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: 'var(--color-white)',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          {/* Right Accent Column */}
          <div
            style={{
              borderLeft: '1px solid rgba(248, 247, 243, 0.1)',
              paddingLeft: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '280px',
            }}
            className="process-right-tag"
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                lineHeight: 1.6,
                color: 'var(--color-muted-dark)',
                textTransform: 'uppercase',
              }}
            >
              {siteContent.process.sideTagline}
            </span>
            <div
              style={{
                width: '32px',
                height: '1px',
                backgroundColor: 'var(--color-gold)',
                opacity: 0.8,
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .process-split {
            grid-template-columns: 1fr 280px !important;
          }
        }
        @media (max-width: 768px) {
          .steps-wrapper {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 32px !important;
            padding-left: 20px !important;
          }
          .connecting-line {
            display: none !important;
          }
          .process-right-tag {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid rgba(248, 247, 243, 0.1);
            padding-top: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
