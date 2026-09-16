'use client';

import React, { useEffect, useRef } from 'react';
import { siteContent } from '@/content/siteContent';

interface HeroProps {
  onOpenEnquiry: () => void;
  onMediaReady?: () => void;
  isPreloaderComplete?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenEnquiry,
  onMediaReady,
  isPreloaderComplete = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if media is already sufficiently loaded
    if (video.readyState >= 2 && onMediaReady) {
      onMediaReady();
    }

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
          onLoadedData={onMediaReady}
          onCanPlay={onMediaReady}
          poster="/media/hero-poster-desktop.webp"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            backgroundColor: '#070807',
          }}
        >
          {/* Seamless full-bleed background media streams */}
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
        className="hero-foreground"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          padding:
            'clamp(96px, 11vh, 128px) clamp(56px, 7.5vw, 144px) clamp(40px, 6vh, 72px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 560px) auto',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: isPreloaderComplete ? 1 : 0,
          transform: isPreloaderComplete ? 'translateY(0)' : 'translateY(12px)',
          transition:
            'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Left Headline Block */}
        <div style={{ maxWidth: '560px', width: '100%' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
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
            className="hero-title"
            style={{
              fontFamily: 'var(--font-display-condensed)',
              fontWeight: 700,
              lineHeight: 0.88,
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
              marginBottom: '40px',
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
        .hero-title {
          font-size: clamp(48px, 10vw, 72px);
        }
        @media (min-width: 1024px) {
          .hero-title {
            font-size: clamp(72px, min(7.5vw, 14vh), 132px);
          }
          .hero-right-meta {
            display: flex !important;
          }
        }
        @media (max-width: 1023px) {
          .hero-foreground {
            grid-template-columns: 1fr !important;
            padding-left: var(--page-pad-x, 24px) !important;
            padding-right: var(--page-pad-x, 24px) !important;
          }
        }
      `}</style>
    </section>
  );
};
