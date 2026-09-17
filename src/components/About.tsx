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

  // ------------------------------------------------------------
  // Viewport + Reduced Motion Detection
  // ------------------------------------------------------------
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
      setReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    checkViewport();

    window.addEventListener('resize', checkViewport, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // ------------------------------------------------------------
  // Desktop Scroll Tracking
  // ------------------------------------------------------------
  useEffect(() => {
    if (isMobile) return;

    let animationFrameId = 0;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

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

        const rawProgress = Math.max(
          0,
          Math.min(1, currentScroll / totalDistance)
        );

        setScrollProgress(rawProgress);

        const segment = 1 / numChapters;

        const currentIdx = Math.min(
          numChapters - 1,
          Math.max(0, Math.floor(rawProgress / segment))
        );

        setActiveChapterIndex(currentIdx);

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobile, numChapters]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About CHANDRA"
      className="chandra-about"
    >
      {/* ============================================================
          DESKTOP TWO-STEP STORY SCROLL
          ============================================================ */}
      <div
        className="chandra-about__desktop-track"
        aria-hidden={isMobile}
      >
        <div className="chandra-about__sticky-viewport">
          {/* Section Header */}
          <header
            className="chandra-about__header"
            aria-hidden="true"
          >
            <div className="chandra-about__eyebrow-row">
              <span className="chandra-about__eyebrow">
                02 / {siteContent.about.eyebrow}
              </span>

              <div className="chandra-about__eyebrow-rule" />
            </div>
          </header>

          {/* Main Story Stage */}
          <div className="chandra-about__stage-container">
            <div className="chandra-about__stage">
              {chapters.map((chapter, idx) => {
                // 01 / 03 / 05 => media left
                // 02 / 04 => media right
                const isEven = idx % 2 === 1;

                const segment = 1 / numChapters;

                // 0 -> 1 inside each chapter
                const rawLocal =
                  (scrollProgress - idx * segment) / segment;

                let imageOpacity = 0;
                let textOpacity = 0;
                let textY = 18;
                let imageScale = 1;

                if (reducedMotion) {
                  const isActive =
                    idx === activeChapterIndex;

                  imageOpacity = isActive ? 1 : 0;
                  textOpacity = isActive ? 1 : 0;
                  textY = 0;
                  imageScale = 1;
                } else {
                  // ------------------------------------------------
                  // IMAGE
                  // ------------------------------------------------

                  // Enter
                  if (
                    rawLocal >= -0.15 &&
                    rawLocal < 0.05
                  ) {
                    imageOpacity =
                      (rawLocal + 0.15) / 0.2;
                  }

                  // Hold
                  else if (
                    rawLocal >= 0.05 &&
                    rawLocal <= 0.85
                  ) {
                    imageOpacity = 1;
                  }

                  // Exit
                  else if (
                    rawLocal > 0.85 &&
                    rawLocal <= 1.05
                  ) {
                    imageOpacity =
                      1 -
                      (rawLocal - 0.85) / 0.2;
                  }

                  // Outside chapter range
                  else {
                    imageOpacity = 0;
                  }

                  // ------------------------------------------------
                  // TEXT — SECOND STEP
                  // ------------------------------------------------

                  // Image-only phase
                  if (
                    rawLocal < 0.38 ||
                    rawLocal > 0.98
                  ) {
                    textOpacity = 0;
                    textY = 18;
                  }

                  // Reveal
                  else if (
                    rawLocal >= 0.38 &&
                    rawLocal < 0.54
                  ) {
                    const revealT =
                      (rawLocal - 0.38) / 0.16;

                    textOpacity = revealT;
                    textY = 18 * (1 - revealT);
                  }

                  // Hold
                  else if (
                    rawLocal >= 0.54 &&
                    rawLocal <= 0.8
                  ) {
                    textOpacity = 1;
                    textY = 0;
                  }

                  // Exit
                  else if (
                    rawLocal > 0.8 &&
                    rawLocal <= 0.98
                  ) {
                    const exitT =
                      (rawLocal - 0.8) / 0.18;

                    textOpacity = 1 - exitT;
                    textY = -10 * exitT;
                  }

                  // ------------------------------------------------
                  // SUBTLE IMAGE ZOOM
                  // ------------------------------------------------

                  const scaleProgress = Math.max(
                    0,
                    Math.min(
                      1,
                      (rawLocal + 0.1) / 0.9
                    )
                  );

                  imageScale =
                    1 + scaleProgress * 0.048;

                  // First chapter initial state
                  if (
                    idx === 0 &&
                    scrollProgress <= 0
                  ) {
                    imageOpacity = 1;
                    imageScale = 1;
                    textOpacity = 0;
                    textY = 18;
                  }

                  // Last chapter final state
                  if (
                    idx === numChapters - 1 &&
                    scrollProgress >= 1
                  ) {
                    imageOpacity = 1;
                    textOpacity = 1;
                    textY = 0;
                    imageScale = 1.048;
                  }
                }

                const isActive =
                  idx === activeChapterIndex;

                const isChapterVisible =
                  imageOpacity > 0.01 ||
                  textOpacity > 0.01;

                return (
                  <article
                    key={chapter.id}
                    className={[
                      'chandra-about__chapter',
                      isEven
                        ? 'chandra-about__chapter--text-left'
                        : 'chandra-about__chapter--media-left',
                      isActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{
                      visibility:
                        isChapterVisible
                          ? 'visible'
                          : 'hidden',
                      zIndex: isActive ? 2 : 1,
                      pointerEvents: isActive
                        ? 'auto'
                        : 'none',
                    }}
                    aria-hidden={!isActive}
                  >
                    {/* MEDIA */}
                    <div
                      className="chandra-about__media-panel"
                      style={{
                        opacity: reducedMotion
                          ? isActive
                            ? 1
                            : 0
                          : imageOpacity,
                      }}
                    >
                      <figure className="chandra-about__media-frame">
                        <img
                          src={chapter.image}
                          alt={chapter.imageAlt}
                          loading={
                            idx === 0
                              ? 'eager'
                              : 'lazy'
                          }
                          className="chandra-about__image"
                          style={{
                            objectPosition:
                              (chapter as any)
                                .objectPosition ||
                              'center',
                            transform:
                              reducedMotion
                                ? 'none'
                                : `scale(${imageScale.toFixed(
                                    4
                                  )})`,
                          }}
                        />

                        <div
                          className="chandra-about__media-vignette"
                          aria-hidden="true"
                        />
                      </figure>
                    </div>

                    {/* CONTENT */}
                    <div className="chandra-about__content-panel">
                      <div
                        className="chandra-about__content-inner"
                        style={{
                          transform:
                            reducedMotion
                              ? 'none'
                              : `translate3d(0, ${textY.toFixed(
                                  1
                                )}px, 0)`,
                          opacity: reducedMotion
                            ? isActive
                              ? 1
                              : 0
                            : textOpacity,
                          pointerEvents:
                            textOpacity > 0.1
                              ? 'auto'
                              : 'none',
                        }}
                      >
                        <div className="chandra-about__meta-row">
                          <span className="chandra-about__meta-tag">
                            {chapter.metadata}
                          </span>
                        </div>

                        <h3 className="chandra-about__headline">
                          <span className="chandra-about__headline-line">
                            {chapter.headlineLine1}
                          </span>

                          <span className="chandra-about__headline-line">
                            {chapter.headlineLine2}
                          </span>
                        </h3>

                        <p className="chandra-about__body">
                          {chapter.body}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <footer
            className="chandra-about__footer-nav"
            aria-hidden="true"
          >
            <div className="chandra-about__progress-ticks">
              {chapters.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'chandra-about__tick',
                    i === activeChapterIndex
                      ? 'is-active'
                      : '',
                    i < activeChapterIndex
                      ? 'is-passed'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
          </footer>
        </div>
      </div>

      {/* ============================================================
          MOBILE NATIVE STACKED VIEW
          ============================================================ */}
      <div
        className="chandra-about__mobile-view"
        aria-hidden={!isMobile}
      >
        <div className="chandra-about__mobile-container">
          <header className="chandra-about__mobile-header">
            <div className="chandra-about__eyebrow-row">
              <span className="chandra-about__eyebrow">
                02 / {siteContent.about.eyebrow}
              </span>

              <div
                className="chandra-about__eyebrow-rule"
                aria-hidden="true"
              />
            </div>
          </header>

          <ol className="chandra-about__mobile-list">
            {chapters.map((chapter) => (
              <li
                key={chapter.id}
                className="chandra-about__mobile-card"
              >
                <div className="chandra-about__mobile-meta">
                  <span className="chandra-about__meta-tag">
                    {chapter.metadata}
                  </span>
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
                    style={{
                      objectPosition:
                        (chapter as any)
                          .objectPosition ||
                        'center',
                    }}
                  />

                  <div
                    className="chandra-about__media-vignette"
                    aria-hidden="true"
                  />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style jsx>{`
        /* ============================================================
           CHANDRA ABOUT — TWO STEP STORY
           ============================================================ */

        .chandra-about {
          position: relative;
          background-color: var(--color-black);
          color: var(--color-white);
          border-top: 1px solid
            rgba(248, 247, 243, 0.08);
        }

        /* ============================================================
           DESKTOP TRACK
           ============================================================ */

        .chandra-about__desktop-track {
          position: relative;
          width: 100%;
          height: 500vh;
          display: block;
        }

        .chandra-about__sticky-viewport {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100svh;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;
          background-color: var(--color-black);
        }

        /* ============================================================
           SECTION HEADER
           ============================================================ */

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
          background-color: rgba(
            198,
            161,
            91,
            0.4
          );
        }

        /* ============================================================
           STORY STAGE
           ============================================================ */

        .chandra-about__stage-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .chandra-about__stage {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /*
         * IMPORTANT:
         *
         * ONE ROW ONLY.
         *
         * grid-template-areas ensures the DOM order does
         * not push even chapters into a second grid row.
         */

        .chandra-about__chapter {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);

          grid-template-rows:
            minmax(0, 1fr);

          align-items: stretch;
          box-sizing: border-box;
        }

        /* 01 / 03 / 05 */
        .chandra-about__chapter--media-left {
          grid-template-areas:
            'media content';
        }

        /* 02 / 04 */
        .chandra-about__chapter--text-left {
          grid-template-areas:
            'content media';
        }

        /* ============================================================
           MEDIA
           ============================================================ */

        .chandra-about__media-panel {
          grid-area: media;

          min-width: 0;
          min-height: 0;

          width: 100%;
          height: 100%;

          position: relative;
          overflow: hidden;

          background-color:
            var(--color-charcoal);

          will-change: opacity;

          transition:
            opacity 0.3s ease-out;
        }

        .chandra-about__media-frame {
          position: relative;

          width: 100%;
          height: 100%;

          margin: 0;
          overflow: hidden;
        }

        .chandra-about__image {
          width: 100%;
          height: 100%;

          display: block;
          object-fit: cover;

          filter:
            brightness(0.92)
            contrast(1.05);

          will-change: transform;

          transition:
            filter 0.4s ease;
        }

        .chandra-about__chapter.is-active
          .chandra-about__image {
          filter:
            brightness(1)
            contrast(1.06);
        }

        .chandra-about__media-vignette {
          position: absolute;
          inset: 0;

          pointer-events: none;

          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.25) 0%,
            transparent 35%,
            rgba(7, 8, 7, 0.4) 100%
          );
        }

        /* ============================================================
           CONTENT
           ============================================================ */

        .chandra-about__content-panel {
          grid-area: content;

          min-width: 0;
          min-height: 0;

          width: 100%;
          height: 100%;

          display: flex;
          flex-direction: column;
          justify-content: center;

          padding-inline:
            clamp(56px, 6vw, 110px);

          padding-block:
            max(80px, 10vh);

          box-sizing: border-box;
        }

        .chandra-about__content-inner {
          width: 100%;
          max-width: 520px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          gap:
            clamp(14px, 2.2vh, 22px);

          will-change:
            transform,
            opacity;

          transition:
            transform 0.3s ease-out,
            opacity 0.3s ease-out;
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
          margin: 0;

          display: flex;
          flex-direction: column;

          font-family:
            var(--font-display-condensed);

          font-size:
            clamp(38px, 4.2vw, 62px);

          font-weight: 800;
          line-height: 1.04;

          letter-spacing: -0.015em;

          color: var(--color-white);

          text-transform: uppercase;
        }

        .chandra-about__headline-line {
          display: block;
        }

        .chandra-about__body {
          max-width: 480px;

          margin: 0;

          font-family: var(--font-body);

          font-size:
            clamp(15px, 1.15vw, 17px);

          line-height: 1.6;

          color:
            rgba(248, 247, 243, 0.82);
        }

        /* ============================================================
           PROGRESS
           ============================================================ */

        .chandra-about__footer-nav {
          position: absolute;

          right:
            clamp(24px, 4.5vw, 64px);

          bottom:
            max(24px, 3.5vh);

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

          border-radius: 1px;

          background-color:
            rgba(248, 247, 243, 0.15);

          transition:
            background-color 0.3s ease,
            width 0.3s ease;
        }

        .chandra-about__tick.is-active {
          width: 36px;

          background-color:
            rgba(198, 161, 91, 0.85);
        }

        .chandra-about__tick.is-passed {
          background-color:
            rgba(198, 161, 91, 0.4);
        }

        /* ============================================================
           MOBILE
           ============================================================ */

        .chandra-about__mobile-view {
          display: none;
        }

        @media (max-width: 1023px) {
          .chandra-about__desktop-track {
            display: none !important;
          }

          .chandra-about__mobile-view {
            display: block;

            padding:
              clamp(64px, 8vw, 100px)
              var(--page-pad-x);
          }

          .chandra-about__mobile-container {
            width: 100%;
            max-width: var(--container-max);

            margin: 0 auto;
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

            padding-bottom: 48px;

            border-bottom:
              1px solid
              rgba(248, 247, 243, 0.08);
          }

          .chandra-about__mobile-card:last-child {
            padding-bottom: 0;
            border-bottom: none;
          }

          .chandra-about__mobile-meta {
            display: flex;
            align-items: center;
          }

          .chandra-about__mobile-headline {
            margin: 0;

            font-family:
              var(--font-display-condensed);

            font-size:
              clamp(26px, 6vw, 36px);

            font-weight: 800;
            line-height: 1.1;

            letter-spacing: -0.015em;

            color: var(--color-white);

            text-transform: uppercase;
          }

          .chandra-about__mobile-body {
            margin: 0;

            font-family: var(--font-body);
            font-size: 14.5px;

            line-height: 1.6;

            color:
              rgba(248, 247, 243, 0.82);
          }

          .chandra-about__mobile-frame {
            position: relative;

            width: 100%;
            aspect-ratio: 4 / 3;

            margin: 8px 0 0;

            overflow: hidden;

            border-radius: 4px;

            border:
              1px solid
              rgba(248, 247, 243, 0.1);

            background-color:
              var(--color-charcoal);
          }

          .chandra-about__mobile-img {
            width: 100%;
            height: 100%;

            display: block;
            object-fit: cover;
          }
        }

        /* ============================================================
           REDUCED MOTION
           ============================================================ */

        @media (prefers-reduced-motion: reduce) {
          .chandra-about__content-inner,
          .chandra-about__image,
          .chandra-about__media-panel {
            transform: none !important;
            transition: none !important;
          }

          .chandra-about__chapter {
            transition:
              opacity 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};