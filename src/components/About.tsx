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
                const isEven = idx % 2 === 1;
                
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
                    mediaY = 18;
                  } else if (localProgress > 0 && localProgress < 0.15) {
                    const enterProgress = localProgress / 0.15;
                    opacity = enterProgress;
                    textY = 12 * (1 - enterProgress);
                    mediaY = 18 * (1 - enterProgress);
                  } else if (localProgress >= 0.15 && localProgress <= 0.85) {
                    opacity = 1;
                    textY = 0;
                    mediaY = 0;
                  } else if (localProgress > 0.85 && localProgress < 1) {
                    const exitProgress = (localProgress - 0.85) / 0.15;
                    opacity = 1 - exitProgress;
                    textY = -12 * exitProgress;
                    mediaY = -18 * exitProgress;
                  } else if (localProgress >= 1) {
                    opacity = 0;
                    textY = -12;
                    mediaY = -18;
                  }
                  
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
                      isEven ? 'chandra-about__chapter--reverse' : 'chandra-about__chapter--standard'
                    } ${isActive ? 'is-active' : ''}`}
                    style={{
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isActive ? 'auto' : 'none',
                      visibility: opacity > 0.01 ? 'visible' : 'hidden',
                    }}
                    aria-hidden={!isActive}
                  >
                    {/* TEXT CONTENT PANEL */}
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

                    {/* MEDIA PANEL */}
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
          padding: 100px var(--page-pad-x) 56px;
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
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
        }

        .chandra-about__eyebrow-rule {
          width: 36px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.3);
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
          gap: clamp(60px, 8vw, 120px);
          align-items: center;
        }

        /* Alternating Split-Screen Layouts */
        .chandra-about__chapter--standard {
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
        }
        .chandra-about__chapter--standard .chandra-about__content-panel {
          grid-column: 1;
        }
        .chandra-about__chapter--standard .chandra-about__media-panel {
          grid-column: 2;
        }

        .chandra-about__chapter--reverse {
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
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
          max-width: 500px;
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
          line-height: 1.5;
          color: rgba(248, 247, 243, 0.82);
          margin: 0;
          max-width: 460px;
        }

        /* Media Panel & Frame */
        .chandra-about__media-panel {
          width: 100%;
          z-index: 1;
          will-change: transform;
          display: flex;
          justify-content: center;
        }

        .chandra-about__media-frame {
          position: relative;
          width: auto;
          max-width: 34vw;
          aspect-ratio: 4 / 5;
          height: min(68svh, 680px);
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

        /* Bottom Progress Counter & Ticks */
        .chandra-about__footer-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
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
            aspect-ratio: 4 / 5;
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
