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

  // Desktop Scroll-Linked Logic (via requestAnimationFrame)
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

          const currentScroll = -rect.top;
          const rawProgress = currentScroll / totalDistance;
          const clamped = Math.max(0, Math.min(1, rawProgress));

          setScrollProgress(clamped);

          const segment = 1 / numChapters;
          const chapterIdx = Math.min(
            numChapters - 1,
            Math.max(0, Math.floor(clamped / segment))
          );
          setActiveChapterIndex((prev) => (prev !== chapterIdx ? chapterIdx : prev));
          
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
      {/* DESKTOP TRUE SPLIT-SCREEN VIEW (≥ 1024px) */}
      <div className="chandra-about__desktop-track" aria-hidden={isMobile}>
        <div className="chandra-about__sticky-viewport">
          
          {/* Top Fixed Section Eyebrow (Protected Safe Area) */}
          <header className="chandra-about__header" aria-hidden="true">
            <div className="chandra-about__eyebrow-row">
              <span className="chandra-about__eyebrow">
                02 / {siteContent.about.eyebrow}
              </span>
              <div className="chandra-about__eyebrow-rule" />
            </div>
          </header>

          {/* Unified Stage: 1fr 1fr Grid (Same Row, Identical Midpoint Y) */}
          <div className="chandra-about__stage-container">
            <div className="chandra-about__stage">
              {chapters.map((chapter, idx) => {
                // Chapters alternate horizontally only:
                // 01: Media Left, Text Right
                // 02: Text Left, Media Right
                // 03: Media Left, Text Right
                // 04: Text Left, Media Right
                // 05: Media Left, Text Right
                const isEven = idx % 2 === 1; // idx 1, 3 are even (02, 04) -> Text Left, Media Right
                
                const segment = 1 / numChapters;
                const chapterStart = idx * segment;
                
                let localProgress = (scrollProgress - chapterStart) / segment;
                localProgress = Math.max(0, Math.min(1, localProgress));

                let opacity = 0;
                let textY = 0;
                let mediaY = 0;

                if (reducedMotion) {
                  opacity = idx === activeChapterIndex ? 1 : 0;
                } else {
                  if (localProgress <= 0) {
                    opacity = 0;
                    textY = 12;
                    mediaY = 16;
                  } else if (localProgress > 0 && localProgress < 0.15) {
                    const enterProgress = localProgress / 0.15;
                    opacity = enterProgress;
                    textY = 12 * (1 - enterProgress);
                    mediaY = 16 * (1 - enterProgress);
                  } else if (localProgress >= 0.15 && localProgress <= 0.85) {
                    opacity = 1;
                    textY = 0;
                    mediaY = 0;
                  } else if (localProgress > 0.85 && localProgress < 1) {
                    const exitProgress = (localProgress - 0.85) / 0.15;
                    opacity = 1 - exitProgress;
                    textY = -12 * exitProgress;
                    mediaY = -16 * exitProgress;
                  } else if (localProgress >= 1) {
                    opacity = 0;
                    textY = -12;
                    mediaY = -16;
                  }
                  
                  // Boundary edge cases
                  if (idx === 0 && scrollProgress <= 0) {
                    opacity = 1;
                    textY = 0;
                    mediaY = 0;
                  }
                  if (idx === numChapters - 1 && scrollProgress >= 1) {
                    opacity = 1;
                    textY = 0;
                    mediaY = 0;
                  }
                }

                const isActive = opacity > 0.05 || idx === activeChapterIndex;
                const zIndex = idx === activeChapterIndex ? 2 : 1;

                return (
                  <article
                    key={chapter.id}
                    className={`chandra-about__chapter ${
                      isEven ? 'chandra-about__chapter--text-left' : 'chandra-about__chapter--media-left'
                    } ${isActive ? 'is-active' : ''}`}
                    style={{
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isActive ? 'auto' : 'none',
                      visibility: opacity > 0.01 ? 'visible' : 'hidden',
                    }}
                    aria-hidden={!isActive}
                  >
                    {/* MEDIA PANEL (Dominant 50% Stage Visual) */}
                    <div
                      className="chandra-about__media-panel"
                      style={{ transform: `translate3d(0, ${mediaY}px, 0)` }}
                    >
                      <figure className="chandra-about__media-frame">
                        <img
                          src={chapter.image}
                          alt={chapter.imageAlt}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          className="chandra-about__image"
                          style={{ objectPosition: (chapter as any).objectPosition || 'center' }}
                        />
                        <div className="chandra-about__media-vignette" aria-hidden="true" />
                      </figure>
                    </div>

                    {/* TEXT CONTENT PANEL (Co-equal Vertical Center) */}
                    <div
                      className="chandra-about__content-panel"
                      style={{ transform: `translate3d(0, ${textY}px, 0)` }}
                    >
                      <div className="chandra-about__meta-row">
                        <span className="chandra-about__meta-tag">{chapter.metadata}</span>
                      </div>
                      
                      <h3 className="chandra-about__headline">
                        <span className="chandra-about__headline-line">{chapter.headlineLine1}</span>
                        <span className="chandra-about__headline-line">{chapter.headlineLine2}</span>
                      </h3>

                      <p className="chandra-about__body">{chapter.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Bottom Fixed Progress Ticks */}
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
          </footer>

        </div>
      </div>

      {/* MOBILE NATIVE STACKED VIEW (< 1024px) */}
      <div className="chandra-about__mobile-view" aria-hidden={!isMobile}>
        <div className="chandra-about__mobile-container">
          <header className="chandra-about__mobile-header">
            <div className="chandra-about__eyebrow-row">
              <span className="chandra-about__eyebrow">
                02 / {siteContent.about.eyebrow}
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
                    style={{ objectPosition: (chapter as any).objectPosition || 'center' }}
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
           CHANDRA ABOUT — TRUE 50/50 SPLIT-SCREEN STORY STAGE
           One Permanent Stage Geometry · Identical Center Y · Substantial Media
           ============================================================ */

        .chandra-about {
          background-color: var(--color-black);
          color: var(--color-white);
          position: relative;
          border-top: 1px solid rgba(248, 247, 243, 0.08);
        }

        /* ------------------------------------------------------------
           DESKTOP STICKY SCROLL TRACK (≥ 1024px)
           ------------------------------------------------------------ */
        .chandra-about__desktop-track {
          position: relative;
          height: 420vh;
          width: 100%;
          display: block;
        }

        .chandra-about__sticky-viewport {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: var(--color-black);
        }

        /* Top Protected Header Bar */
        .chandra-about__header {
          position: absolute;
          top: max(24px, 3.5vh);
          left: clamp(24px, 4.5vw, 64px);
          z-index: 10;
          pointer-events: none;
        }

        .chandra-about__eyebrow-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chandra-about__eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .chandra-about__eyebrow-rule {
          width: 28px;
          height: 1px;
          background-color: rgba(198, 161, 91, 0.4);
        }

        /* Stage Container: Full-Height Usable Band */
        .chandra-about__stage-container {
          max-width: var(--container-max);
          width: 100%;
          height: 100%;
          margin: 0 auto;
          padding: 0 var(--page-pad-x);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
        }

        /* Single Stage Geometry */
        .chandra-about__stage {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Chapter Overlay: Exact Same 1fr 1fr Grid, Center Aligned */
        .chandra-about__chapter {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(40px, 5vw, 80px);
          align-items: center;
          box-sizing: border-box;
        }

        /* Horizontal Mirroring Only (Y NEVER Changes) */
        /* Chapter 01, 03, 05: Media Left (Col 1), Text Right (Col 2) */
        .chandra-about__chapter--media-left .chandra-about__media-panel {
          grid-column: 1;
        }
        .chandra-about__chapter--media-left .chandra-about__content-panel {
          grid-column: 2;
        }

        /* Chapter 02, 04: Text Left (Col 1), Media Right (Col 2) */
        .chandra-about__chapter--text-left .chandra-about__content-panel {
          grid-column: 1;
        }
        .chandra-about__chapter--text-left .chandra-about__media-panel {
          grid-column: 2;
        }

        /* ------------------------------------------------------------
           DOMINANT MEDIA PANEL (~50% STAGE WIDTH, 74–78% VIEWPORT HEIGHT)
           ------------------------------------------------------------ */
        .chandra-about__media-panel {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          will-change: transform;
        }

        .chandra-about__media-frame {
          position: relative;
          width: 100%;
          height: clamp(360px, 74vh, 78vh);
          max-height: calc(100vh - 160px); /* Strictly safe-stage driven */
          margin: 0;
          border-radius: 4px;
          overflow: hidden;
          background-color: var(--color-charcoal);
          border: 1px solid rgba(248, 247, 243, 0.1);
          box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.9);
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
            rgba(7, 8, 7, 0.15) 0%,
            transparent 40%,
            rgba(7, 8, 7, 0.5) 100%
          );
          pointer-events: none;
        }

        /* ------------------------------------------------------------
           CO-EQUAL TEXT CONTENT PANEL (CENTER ALIGNED)
           ------------------------------------------------------------ */
        .chandra-about__content-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: clamp(14px, 2vh, 20px);
          max-width: 520px;
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
          font-size: clamp(38px, 4.2vw, 62px);
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
          font-size: clamp(15px, 1.15vw, 17px);
          line-height: 1.6;
          color: rgba(248, 247, 243, 0.82);
          margin: 0;
          max-width: 480px;
        }

        /* Bottom Fixed Progress Ticks */
        .chandra-about__footer-nav {
          position: absolute;
          bottom: max(24px, 3.5vh);
          right: clamp(24px, 4.5vw, 64px);
          z-index: 10;
          pointer-events: none;
        }

        .chandra-about__progress-ticks {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chandra-about__tick {
          width: 24px;
          height: 2px;
          background-color: rgba(248, 247, 243, 0.15);
          border-radius: 1px;
          transition: background-color 0.3s ease, width 0.3s ease;
        }

        .chandra-about__tick.is-active {
          background-color: rgba(198, 161, 91, 0.85);
          width: 36px;
        }

        .chandra-about__tick.is-passed {
          background-color: rgba(198, 161, 91, 0.4);
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
            aspect-ratio: 4 / 3;
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
