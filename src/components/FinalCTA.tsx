'use client';

import React from 'react';
import { siteContent } from '@/content/siteContent';

interface FinalCTAProps {
  onOpenEnquiry: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenEnquiry }) => {
  return (
    <section
      id="contact"
      aria-label="CHANDRA Final Experience CTA"
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(90px, 10vw, 150px) var(--page-pad-x) 40px',
        overflow: 'hidden',
        backgroundColor: 'var(--color-black)',
      }}
    >
      {/* Full-Bleed Finale Video Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/lets-create-poster.webp"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        >
          <source src="/media/lets-create-bg-desktop.webm" type="video/webm" />
          <source src="/media/lets-create-bg-desktop.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Dark Overlay for Text Contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center 45%, rgba(7,8,7,0.4) 0%, rgba(7,8,7,0.85) 85%, rgba(7,8,7,0.98) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Center Climax Block */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: '850px',
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.24em',
            color: 'var(--color-white)',
            opacity: 0.9,
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          {siteContent.cta.eyebrow}
        </span>

        {/* Climax Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(44px, 7vw, 92px)',
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            color: 'var(--color-white)',
            margin: '0 0 36px 0',
          }}
        >
          <span>{siteContent.cta.headlineLine1}</span>
          <br />
          <span>{siteContent.cta.headlineLine2}</span>
        </h2>

        {/* Primary Centered Action */}
        <div>
          <button
            onClick={onOpenEnquiry}
            className="btn-primary-gold"
            aria-label="Plan an Event with Chandra"
            style={{ padding: '16px 40px', fontSize: '12px' }}
          >
            <span>{siteContent.cta.primaryButton}</span>
          </button>
        </div>
      </div>

      {/* Bottom Dual Brand Anchors (Matching Reference) */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: 'var(--container-max)',
          width: '100%',
          margin: '60px auto 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(248, 247, 243, 0.1)',
        }}
      >
        {/* Left Brand Anchor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.28em',
              color: 'var(--color-white)',
              textTransform: 'uppercase',
            }}
          >
            {siteContent.cta.footerAnchorLeft}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              color: 'var(--color-muted-dark)',
              textTransform: 'uppercase',
            }}
          >
            {siteContent.cta.footerSubLeft}
          </span>
        </div>

        {/* Right Conceptual Descriptor */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '3px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'var(--color-white)',
              opacity: 0.9,
              textTransform: 'uppercase',
            }}
          >
            {siteContent.cta.footerAnchorRight}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              color: 'var(--color-muted-dark)',
              textTransform: 'uppercase',
            }}
          >
            {siteContent.cta.footerSubRight}
          </span>
        </div>
      </div>
    </section>
  );
};
