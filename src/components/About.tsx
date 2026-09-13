'use client';

import React, { useEffect, useRef, useState } from 'react';
import { siteContent } from '@/content/siteContent';

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const chapters = siteContent.about.chapters;
  const numChapters = chapters.length;

  // Viewport & Reduced Motion Detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Desktop Scroll-Linked Opposing Physics (via requestAnimationFrame)
  useEffect(() => {
    if (isMobile) return;

    let animationFrameId: number;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }

          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalDistance = rect.height - windowHeight;

          if (totalDistance <= 0) {
            ticking = false;
            return;
          }

          // Progress begins when section top reaches top of viewport (0.0)
          // and ends when bottom of section reaches bottom of viewport (1.0)
          const currentScroll = -rect.top;
          const rawProgress = currentScroll / totalDistance;
          const clamped = Math.max(0, Math.min(1, rawProgress));

          setScrollProgress(clamped);

          // Map progress to active chapter index (0 to 4)
          const chapterIdx = Math.min(
            numChapters - 1,
            Math.max(0, Math.floor(clamped * numChapters * 0.999))
          );
          setActiveChapterIndex(chapterIdx);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, numChapters]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About CHANDRA"
      className="chandra-about"
    >
      {/* DESKTOP SPLIT-SCREEN VIEW (≥ 1024px) */}
      <div className="chandra-about__desktop-track" aria-hidden={isMobile}>
        <div className="chandra-about__sticky-viewport">
          <div className="chandra-about__container">
            {/* Top Minimal Section Eyebrow */}
            <header className="chandra-about__header">
              <div className="chandra-about__eyebrow-row">
                <span className="chandra-about__eyebrow">
                  {siteContent.about.eyebrow}
                </span>
                <div className="chandra-about__eyebrow-rule" aria-hidden="true" />
              </div>
            </header>

            {/* 5 Chapters Split-Screen Presentation Layer */}
            <div className="chandra-about__stage">
              {chapters.map((chapter, idx) => {
                // Chapter progress calculations for smooth opposing travel & crossfade
                const isEven = idx % 2 === 1; // 01: Text L/Media R, 02: Media L/Text R, 03: Text L/Media R...
                
                // Cinematic Crossfade & Motion Logic based on 5 equal scroll segments
                const segment = 1 / numChapters; // 0.2
                const segmentCenter = (idx + 0.5) * segment; // 0.1, 0.3, 0.5, 0.7, 0.9
                const progressDelta = scrollProgress - segmentCenter;
                
                // Motion ranges from -1 to 1 across the chapter's visible area (approx 0.2 scroll)
                const distanceRatio = 8;
                const normalizedOffset = Math.max(-1, Math.min(1, progressDelta * distanceRatio));

                // Fade boundaries
                const transitionDuration = 0.06;
                const halfTransition = transitionDuration / 2;
                
                const fadeStart = idx * segment - halfTransition;
                const fullVisibleStart = idx * segment + halfTransition;
                const fullVisibleEnd = (idx + 1) * segment - halfTransition;
                const fadeEnd = (idx + 1) * segment + halfTransition;

                let opacity = 0;
                if (reducedMotion) {
                  opacity = idx === activeChapterIndex ? 1 : 0;
                } else {
                  if (scrollProgress >= fullVisibleStart && scrollProgress <= fullVisibleEnd) {
                    opacity = 1;
                  } else if (scrollProgress >= fadeStart && scrollProgress < fullVisibleStart) {
                    opacity = (scrollProgress - fadeStart) / transitionDuration;
                  } else if (scrollProgress > fullVisibleEnd && scrollProgress <= fadeEnd) {
                    opacity = 1 - ((scrollProgress - fullVisibleEnd) / transitionDuration);
                  }
                  
                  // Ensure first and last chapters are solid at the very top and bottom
                  if (idx === 0 && scrollProgress <= fullVisibleStart) opacity = 1;
                  if (idx === numChapters - 1 && scrollProgress >= fullVisibleEnd) opacity = 1;
                  
                  opacity = Math.max(0, Math.min(1, opacity));
                }

                const isActive = opacity > 0.05 || idx === activeChapterIndex;

                // Subtle Opposing Motion:
                // Media travels slightly down to up (+3.5vh to -3.5vh)
                // Content travels in opposing direction (-2.5vh to +2.5vh)
                const mediaY = reducedMotion ? 0 : normalizedOffset * -3.5;
                const contentY = reducedMotion ? 0 : normalizedOffset * 2.5;

                return (
                  <article
                    key={chapter.id}
                    className={`chandra-about__chapter ${
                      isEven ? 'chandra-about__chapter--reverse' : 'chandra-about__chapter--standard'
                    } ${isActive ? 'is-active' : ''}`}
                    style={{
                      opacity: opacity,
                      pointerEvents: isActive ? 'auto' : 'none',
                      visibility: opacity > 0.01 ? 'visible' : 'hidden',
                    }}
                    aria-hidden={!isActive}
                  >
                    {/* TEXT CONTENT PANEL (46% width) */}
                    <div
                      className="chandra-about__content-panel"
                      style={{
                        transform: `translate3d(0, ${contentY}vh, 0)`,
                      }}
                    >
                      {/* Chapter Metadata */}
                      <div className="chandra-about__meta-row">
                        <span className="chandra-about__meta-tag">{chapter.metadata}</span>
                      </div>

                      {/* Headline */}
                      <h3 className="chandra-about__headline">
                        <span className="chandra-about__headline-line">{chapter.headlineLine1}</span>
                        <span className="chandra-about__headline-line">{chapter.headlineLine2}</span>
                      </h3>

                      {/* Body Copy */}
                      <p className="chandra-about__body">
                        {chapter.body}
                      </p>

                      {/* Subtle Accent Rule */}
                      <div className="chandra-about__accent-rule" aria-hidden="true" />
                    </div>

                    {/* MEDIA PANEL (54% width) */}
                    <div
                      className="chandra-about__media-panel"
                      style={{
                        transform: `translate3d(0, ${mediaY}vh, 0)`,
                      }}
                    >
                      <figure className="chandra-about__media-frame">
                        <img
                          src={chapter.image}
                          alt={chapter.imageAlt}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          className="chandra-about__image"
                        />
                        <div className="chandra-about__media-vignette" aria-hidden="true" />
                        
                        {/* Restrained Chapter Stamp */}
                        <div className="chandra-about__media-badge" aria-hidden="true">
                          <span>{chapter.id} / 05</span>
                        </div>
                      </figure>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Progress Counter */}
            <footer className="chandra-about__footer-nav" aria-hidden="true">
              <div className="chandra-about__progress-ticks">
                {chapters.map((_, i) => (
                  <span
                    key={i}
                    className={`chandra-about__tick ${
                      i === activeChapterIndex ? 'is-active' : i < activeChapterIndex ? 'is-passed' : ''
                    }`}
                  />
                ))}
              </div>
              <span className="chandra-about__counter">
                {chapters[activeChapterIndex]?.id || '01'} / 05
              </span>
            </footer>
          </div>
        </div>
      </div>

      {/* MOBILE NATIVE STACKED VIEW (< 1024px) */}
      <div className="chandra-about__mobile-view" aria-hidden={!isMobile}>
        <div className="chandra-about__mobile-container">
          <header className="chandra-about__mobile-header">
            <div className="chandra-about__eyebrow-row">
              <span className="chandra-about__eyebrow">
                {siteContent.about.eyebrow}
              </span>
              <div className="chandra-about__eyebrow-rule" aria-hidden="true" />
            </div>
          </header>

          <ol className="chandra-about__mobile-list">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="chandra-about__mobile-card">
                <div className="chandra-about__mobile-meta">
                  <span className="chandra-about__meta-tag">{chapter.metadata}</span>
                </div>

                <h3 className="chandra-about__mobile-headline">
                  {chapter.headline}
                </h3>

                <p className="chandra-about__mobile-body">
                  {chapter.body}
                </p>

                <figure className="chandra-about__mobile-frame">
                  <img
                    src={chapter.image}
                    alt={chapter.imageAlt}
                    loading="lazy"
                    className="chandra-about__mobile-img"
                  />
                  <div className="chandra-about__media-vignette" aria-hidden="true" />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style jsx>{`
        /* ============================================================
           CHANDRA ABOUT STYLES — CINEMATIC SPLIT-SCREEN SCROLL STORY
           ============================================================ */

        .chandra-about {
          background-color: var(--color-black);
          color: var(--color-white);
          position: relative;
          border-top: 1px solid rgba(248, 247, 243, 0.08);
        }

        /* ------------------------------------------------------------
           DESKTOP STICKY SCROLL TRACK (≥ 1024px)
           260vh calibrated scroll depth for comfortable, untrapped story
           ------------------------------------------------------------ */
        .chandra-about__desktop-track {
          position: relative;
          height: 260vh;
          width: 100%;
          display: block;
        }

        .chandra-about__sticky-viewport {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .chandra-about__container {
          max-width: var(--container-max);
          margin: 0 auto;
          width: 100%;
          padding: 40px var(--page-pad-x);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        /* Top Section Eyebrow Header */
        .chandra-about__header {
          padding-top: 24px;
          z-index: 10;
        }

        .chandra-about__eyebrow-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .chandra-about__eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.24em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .chandra-about__eyebrow-rule {
          width: 36px;
          height: 1px;
          background-color: var(--color-gold);
          opacity: 0.75;
        }

        /* Stage Container Holding the 5 Overlaid Chapter Articles */
        .chandra-about__stage {
          position: relative;
          flex: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chandra-about__chapter {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 46% 54%;
          gap: clamp(40px, 5vw, 84px);
          align-items: center;
        }

        /* Alternating Split-Screen Layouts */
        .chandra-about__chapter--standard .chandra-about__content-panel {
          grid-column: 1;
        }
        .chandra-about__chapter--standard .chandra-about__media-panel {
          grid-column: 2;
        }

        .chandra-about__chapter--reverse {
          grid-template-columns: 54% 46%;
        }
        .chandra-about__chapter--reverse .chandra-about__media-panel {
          grid-column: 1;
        }
        .chandra-about__chapter--reverse .chandra-about__content-panel {
          grid-column: 2;
        }

        /* Content Panel */
        .chandra-about__content-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 480px;
          z-index: 2;
          will-change: transform;
        }

        .chandra-about__meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chandra-about__meta-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .chandra-about__headline {
          font-family: var(--font-display-condensed);
          font-size: clamp(34px, 3.8vw, 54px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.015em;
          color: var(--color-white);
          margin: 0;
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
        }

        .chandra-about__headline-line {
          display: block;
        }

        .chandra-about__body {
          font-family: var(--font-body);
          font-size: clamp(14.5px, 1.15vw, 16.5px);
          line-height: 1.65;
          color: rgba(248, 247, 243, 0.82);
          margin: 0;
          max-width: 440px;
        }

        .chandra-about__accent-rule {
          width: 32px;
          height: 1px;
          background-color: var(--color-gold);
          opacity: 0.65;
          margin-top: 6px;
        }

        /* Media Panel & Frame */
        .chandra-about__media-panel {
          width: 100%;
          z-index: 1;
          will-change: transform;
        }

        .chandra-about__media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          margin: 0;
          overflow: hidden;
          background-color: var(--color-charcoal);
          border: 1px solid rgba(248, 247, 243, 0.1);
          border-radius: 4px;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.9);
        }

        .chandra-about__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.92) contrast(1.05);
          transition: filter 0.4s ease;
        }

        .chandra-about__chapter.is-active .chandra-about__image {
          filter: brightness(1) contrast(1.06);
        }

        .chandra-about__media-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.25) 0%,
            transparent 40%,
            rgba(7, 8, 7, 0.6) 100%
          );
          pointer-events: none;
        }

        .chandra-about__media-badge {
          position: absolute;
          bottom: 16px;
          right: 18px;
          z-index: 2;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--color-gold);
          background-color: rgba(7, 8, 7, 0.75);
          border: 1px solid rgba(198, 161, 91, 0.3);
          padding: 4px 8px;
          border-radius: 2px;
        }

        /* Bottom Progress Counter & Ticks */
        .chandra-about__footer-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          z-index: 10;
        }

        .chandra-about__progress-ticks {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chandra-about__tick {
          width: 24px;
          height: 2px;
          background-color: rgba(248, 247, 243, 0.2);
          border-radius: 1px;
          transition: background-color 0.3s ease, width 0.3s ease;
        }

        .chandra-about__tick.is-active {
          background-color: var(--color-gold);
          width: 36px;
        }

        .chandra-about__tick.is-passed {
          background-color: rgba(198, 161, 91, 0.5);
        }

        .chandra-about__counter {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--color-gold);
        }

        /* ------------------------------------------------------------
           MOBILE NATIVE STACKED VIEW (< 1024px)
           ------------------------------------------------------------ */
        .chandra-about__mobile-view {
          display: none;
        }

        @media (max-width: 1023px) {
          .chandra-about__desktop-track {
            display: none !important;
          }

          .chandra-about__mobile-view {
            display: block;
            padding: clamp(64px, 8vw, 100px) var(--page-pad-x);
          }

          .chandra-about__mobile-container {
            max-width: var(--container-max);
            margin: 0 auto;
            width: 100%;
          }

          .chandra-about__mobile-header {
            margin-bottom: 40px;
          }

          .chandra-about__mobile-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 56px;
          }

          .chandra-about__mobile-card {
            display: flex;
            flex-direction: column;
            gap: 16px;
            border-bottom: 1px solid rgba(248, 247, 243, 0.08);
            padding-bottom: 48px;
          }

          .chandra-about__mobile-card:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .chandra-about__mobile-meta {
            display: flex;
            align-items: center;
          }

          .chandra-about__mobile-headline {
            font-family: var(--font-display-condensed);
            font-size: clamp(26px, 6vw, 36px);
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.015em;
            color: var(--color-white);
            margin: 0;
            text-transform: uppercase;
          }

          .chandra-about__mobile-body {
            font-family: var(--font-body);
            font-size: 14.5px;
            line-height: 1.6;
            color: rgba(248, 247, 243, 0.82);
            margin: 0;
          }

          .chandra-about__mobile-frame {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
            margin: 8px 0 0 0;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid rgba(248, 247, 243, 0.1);
            background-color: var(--color-charcoal);
          }

          .chandra-about__mobile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
        }

        /* ------------------------------------------------------------
           Reduced Motion Compliance
           ------------------------------------------------------------ */
        @media (prefers-reduced-motion: reduce) {
          .chandra-about__content-panel,
          .chandra-about__media-panel {
            transform: none !important;
            transition: none !important;
          }
          .chandra-about__chapter {
            transition: opacity 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};
