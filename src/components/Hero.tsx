'use client';

import React, { useEffect, useRef } from 'react';
import { siteContent } from '@/content/siteContent';

interface HeroProps {
  onOpenEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Initial check for reduced motion
    if (mediaQuery.matches) {
      video.pause();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (mediaQuery.matches) return;
          
          if (entry.isIntersecting) {
            // Play when Hero is substantially visible
            video.play().catch(() => {
              // Ignore play interruption errors
            });
          } else {
            // Pause when offscreen
            video.pause();
          }
        });
      },
      { threshold: 0.1 } // 10% visible
    );

    const currentSection = document.getElementById('home');
    if (currentSection) {
      observer.observe(currentSection);
    }

    const handleVisibilityChange = () => {
      if (mediaQuery.matches) return;
      
      if (document.visibilityState === 'visible') {
        const rect = video.getBoundingClientRect();
        // Check if actually in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        video.pause();
      } else {
        // If motion is allowed now, and it's visible, play it
        const rect = video.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && document.visibilityState === 'visible') {
          video.play().catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <section
      id="home"
      aria-label="CHANDRA Hero"
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#070807',
      }}
    >
      {/* Background Media Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          backgroundColor: '#070807',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero-poster-desktop.webp"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center center',
            backgroundColor: '#070807',
          }}
        >
          {/* Full 1920x1080 uncropped source streams */}
          <source src="/media/hero-bg-desktop.webm" type="video/webm" />
          <source src="/media/hero-bg-desktop.mp4" type="video/mp4" />
          <source src="/media/Chandra Hero section BG.mp4" type="video/mp4" />
        </video>

        {/* Existing Dark Gradient / Overlay (Preserves Left Typography Readability) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(7,8,7,0.88) 0%, rgba(7,8,7,0.65) 35%, rgba(7,8,7,0.25) 65%, rgba(7,8,7,0.35) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        {/* Subtle Top & Bottom Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(7,8,7,0.6) 0%, transparent 20%, transparent 80%, rgba(7,8,7,0.95) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </div>

      {/* Hero Foreground Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '120px var(--page-pad-x) 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Headline Block */}
        <div style={{ maxWidth: '640px' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.24em',
                color: 'var(--color-white)',
                textTransform: 'uppercase',
              }}
            >
              {siteContent.hero.eyebrow}
            </span>
            <div
              style={{
                width: '44px',
                height: '1px',
                backgroundColor: 'var(--color-gold)',
                opacity: 0.85,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Architectural H1: MOVE PEOPLE */}
          <h1
            style={{
              fontFamily: 'var(--font-display-condensed)',
              fontSize: 'clamp(56px, 10.5vw, 136px)',
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              margin: '0 0 32px 0',
              display: 'flex',
              flexDirection: 'column',
              userSelect: 'none',
            }}
          >
            <span>{siteContent.hero.titleLine1}</span>
            <span>{siteContent.hero.titleLine2}</span>
          </h1>

          {/* Descriptor */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              color: 'var(--color-white)',
              textTransform: 'uppercase',
              opacity: 0.9,
              marginBottom: '48px',
            }}
          >
            {siteContent.hero.descriptor}
          </p>

          {/* Primary CTA */}
          <div>
            <button
              onClick={onOpenEnquiry}
              className="btn-primary-gold"
              aria-label="Let's Create an Event with Chandra"
            >
              <span>{siteContent.hero.cta}</span>
            </button>
          </div>
        </div>

        {/* Right Stage & Technical Microcopy (Desktop Only) */}
        <div
          className="hero-right-meta"
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            gap: '8px',
            paddingTop: '12px',
          }}
        >
          {siteContent.hero.verticalMeta.map((item) => (
            <span
              key={item}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: 'var(--color-white)',
                opacity: 0.7,
                textTransform: 'uppercase',
              }}
            >
              {item}
            </span>
          ))}
          <div
            style={{
              width: '1px',
              height: '32px',
              backgroundColor: 'rgba(248, 247, 243, 0.3)',
              marginTop: '8px',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .hero-right-meta {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
};
