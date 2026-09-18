'use client';

import React, { useEffect, useRef } from 'react';
import { siteContent } from '@/content/siteContent';
import { Preloader } from './Preloader';

interface HeroProps {
  onOpenEnquiry: () => void;
  onMediaReady?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenEnquiry,
  onMediaReady,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // THIS is now the scroll track.
  const heroTrackRef = useRef<HTMLElement>(null);

  // Preloader/GSAP directly controls this.
  const foregroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroTrackRef.current;

    if (!video || !hero) return;

    if (video.readyState >= 2) {
      onMediaReady?.();
    }

    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (mediaQuery.matches) {
      video.pause();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (mediaQuery.matches) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.01,
      }
    );

    observer.observe(hero);

    const handleVisibilityChange = () => {
      if (mediaQuery.matches) return;

      if (document.visibilityState === 'visible') {
        const rect = hero.getBoundingClientRect();

        if (
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        ) {
          video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    };

    const handleMotionChange = (
      event: MediaQueryListEvent
    ) => {
      if (event.matches) {
        video.pause();
        return;
      }

      const rect = hero.getBoundingClientRect();

      if (
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        document.visibilityState === 'visible'
      ) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    mediaQuery.addEventListener(
      'change',
      handleMotionChange
    );

    return () => {
      observer.disconnect();

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      mediaQuery.removeEventListener(
        'change',
        handleMotionChange
      );
    };
  }, [onMediaReady]);

  return (
    <section
      ref={heroTrackRef}
      id="home"
      aria-label="CHANDRA Hero"
      className="hero-scroll-track"
    >
      {/* =====================================================
          ONE STICKY HERO STAGE
          ===================================================== */}
      <div className="hero-sticky-stage">

        {/* =====================================================
            HERO VIDEO — ALWAYS EXISTS UNDER THE MASK
            ===================================================== */}
        <div
          className="hero-media"
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={onMediaReady}
            onCanPlay={onMediaReady}
            poster="/media/hero-poster-desktop.webp"
            className="hero-video"
          >
            <source
              src="/media/hero-bg-desktop.webm"
              type="video/webm"
            />

            <source
              src="/media/hero-bg-desktop.mp4"
              type="video/mp4"
            />

            <source
              src="/media/Chandra Hero section BG.mp4"
              type="video/mp4"
            />
          </video>

          {/* Existing horizontal gradient */}
          <div className="hero-gradient-horizontal" />

          {/* Existing top/bottom vignette */}
          <div className="hero-gradient-vertical" />
        </div>

        {/* =====================================================
            EXISTING HERO CONTENT
            GSAP reveals this directly.
            ===================================================== */}
        <div
          ref={foregroundRef}
          className="hero-foreground"
        >
          {/* LEFT */}
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
            }}
          >
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
                  backgroundColor:
                    'var(--color-gold)',
                  opacity: 0.85,
                }}
                aria-hidden="true"
              />
            </div>

            {/* Headline */}
            <h1 className="hero-title">
              <span>
                {siteContent.hero.titleLine1}
              </span>

              <span>
                {siteContent.hero.titleLine2}
              </span>
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

            {/* CTA */}
            <button
              onClick={onOpenEnquiry}
              className="btn-primary-gold"
              aria-label="Let's Create an Event with Chandra"
            >
              <span>
                {siteContent.hero.cta}
              </span>
            </button>
          </div>

          {/* RIGHT META */}
          <div className="hero-right-meta">
            {siteContent.hero.verticalMeta.map(
              (item) => (
                <span
                  key={item}
                  style={{
                    fontFamily:
                      'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    color:
                      'var(--color-white)',
                    opacity: 0.7,
                    textTransform:
                      'uppercase',
                  }}
                >
                  {item}
                </span>
              )
            )}

            <div
              style={{
                width: '1px',
                height: '32px',
                backgroundColor:
                  'rgba(248,247,243,.3)',
                marginTop: '8px',
              }}
            />
          </div>
        </div>

        {/* =====================================================
            PRELOADER IS NOT A SECTION ANYMORE.
            IT IS ONLY AN OVERLAY INSIDE HERO.
            ===================================================== */}
        <Preloader
          introTrackRef={heroTrackRef}
          heroForegroundRef={foregroundRef}
        />
      </div>

      <style jsx>{`
        /*
         * This is the ONLY scroll distance for the entrance.
         *
         * Hero itself is the track.
         * No extra intro section exists.
         */
        .hero-scroll-track {
          position: relative;
          width: 100%;
          height: 300svh;
          background: #070807;
        }

        /*
         * The visible Hero stays on screen while the
         * user scrolls through the reveal.
         */
        .hero-sticky-stage {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100svh;
          overflow: hidden;
          background: #070807;
        }

        .hero-media {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          background: #070807;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          background: #070807;
        }

        .hero-gradient-horizontal {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              rgba(7, 8, 7, 0.88) 0%,
              rgba(7, 8, 7, 0.65) 35%,
              rgba(7, 8, 7, 0.25) 65%,
              rgba(7, 8, 7, 0.35) 100%
            );
        }

        .hero-gradient-vertical {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;

          background:
            linear-gradient(
              180deg,
              rgba(7, 8, 7, 0.6) 0%,
              transparent 20%,
              transparent 80%,
              rgba(7, 8, 7, 0.95) 100%
            );
        }

        .hero-foreground {
          position: relative;
          z-index: 10;

          width: 100%;
          height: 100%;

          padding:
            clamp(96px, 11vh, 128px)
            clamp(56px, 7.5vw, 144px)
            clamp(40px, 6vh, 72px);

          display: grid;
          grid-template-columns:
            minmax(0, 560px) auto;

          justify-content: space-between;
          align-items: center;

          /*
           * Critical:
           * GSAP owns these properties.
           */
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;

          will-change:
            opacity,
            transform;
        }

        .hero-title {
          margin: 0 0 32px;

          display: flex;
          flex-direction: column;

          font-family:
            var(--font-display-condensed);

          font-size:
            clamp(48px, 10vw, 72px);

          font-weight: 700;
          line-height: 0.88;
          letter-spacing: -0.02em;

          text-transform: uppercase;
          color: var(--color-white);

          user-select: none;
        }

        .hero-right-meta {
          display: none;

          flex-direction: column;
          align-items: flex-end;

          text-align: right;

          gap: 8px;
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size:
              clamp(
                72px,
                min(7.5vw, 14vh),
                132px
              );
          }

          .hero-right-meta {
            display: flex;
          }
        }

        @media (max-width: 1023px) {
          .hero-foreground {
            grid-template-columns: 1fr;

            padding-left:
              var(--page-pad-x, 24px);

            padding-right:
              var(--page-pad-x, 24px);
          }
        }

        /*
         * Touch needs less distance,
         * but still enough to feel like an experience.
         */
        @media (max-width: 767px) {
          .hero-scroll-track {
            height: 220svh;
          }
        }

        /*
         * Accessibility:
         * no giant scroll track when reduced motion
         * is requested.
         */
        @media (
          prefers-reduced-motion: reduce
        ) {
          .hero-scroll-track {
            height: 100svh;
          }
        }
      `}</style>
    </section>
  );
};