'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '@/content/siteContent';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturedExperience: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion and mobile native behavior
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (prefersReducedMotion || isMobile) return;

    // Use GSAP context for safe cleanup during HMR or unmount
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      // Ensure dimensions are calculated properly
      ScrollTrigger.refresh();

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;
      
      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        animation: tween,
        scrub: 1, // subtle smoothing
        invalidateOnRefresh: true, // recalculate on resize
      });
    }, containerRef);

    return () => ctx.revert(); // Proper cleanup of ScrollTriggers
  }, []);

  const data = siteContent.featured;

  return (
    <section 
      ref={containerRef} 
      id="featured" 
      className="featured-section"
      aria-label="CHANDRA Featured Experience"
    >
      <div className="horizontal-track" ref={trackRef}>
        
        {/* Intro Panel (100vw Editorial Frame) */}
        <div className="showcase-stage-panel intro-stage-panel">
          <div className="stage-container">
            <div className="panel-content-col">
              <div className="stage-eyebrow-row">
                <span className="eyebrow-tag">{data.eyebrow}</span>
                <div className="eyebrow-rule" aria-hidden="true" />
              </div>
              
              <h2 className="intro-stage-headline">
                <span>{data.introHeadlineLine1}</span>
                <span>{data.introHeadlineLine2}</span>
              </h2>

              <p className="stage-description intro-stage-desc">
                {data.introSupport}
              </p>

              <div className="explore-cue" aria-hidden="true">
                <span className="explore-cue-text">SCROLL TO EXPLORE</span>
                <span className="explore-cue-arrow">→</span>
              </div>
            </div>

            <div className="panel-media-col">
              <div className="intro-card-preview">
                <div className="preview-media-frame">
                  <img 
                    src={data.showcase[0].image} 
                    alt="CHANDRA Experience Production Preview" 
                    className="preview-media-img"
                    loading="eager"
                  />
                  <div className="media-vignette" aria-hidden="true" />
                  <div className="preview-overlay-tag">
                    <span className="preview-counter">05 CATEGORIES</span>
                    <span className="preview-label">PRODUCTION PORTFOLIO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Experience Showcase Panels (Each 100vw Editorial Frame) */}
        {data.showcase.map((item) => (
          <div key={item.id} className="showcase-stage-panel">
            <div className="stage-container">
              
              {/* Content Column (Left) */}
              <div className="panel-content-col">
                <div className="panel-meta-row">
                  <span className="panel-index-tag">{item.index}</span>
                  <span className="meta-bullet" aria-hidden="true">•</span>
                  <span className="panel-category-tag">{item.category}</span>
                </div>

                <h3 className="panel-stage-headline">
                  {item.title}
                </h3>

                <p className="stage-description">
                  {item.description}
                </p>

                <div className="stage-footer-note" aria-hidden="true">
                  <span className="scope-indicator">FULL PRODUCTION & ARCHITECTURE</span>
                </div>
              </div>

              {/* Media Column (Right) */}
              <div className="panel-media-col">
                <div className="stage-media-frame">
                  <img 
                    src={item.image} 
                    alt={item.imageAlt} 
                    loading="lazy" 
                    className="stage-media-img"
                  />
                  <div className="media-vignette" aria-hidden="true" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* ============================================================
           FEATURED EXPERIENCE — SINGLE FIXED EDITORIAL STAGE (GSAP)
           ============================================================ */

        .featured-section {
          background-color: var(--color-charcoal);
          color: var(--color-white);
          overflow: hidden;
          position: relative;
          width: 100%;
          border-top: 1px solid rgba(248, 247, 243, 0.08);
          border-bottom: 1px solid rgba(248, 247, 243, 0.08);
        }

        .horizontal-track {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          height: 100vh;
          height: 100dvh;
          width: max-content;
          will-change: transform;
        }

        /* ------------------------------------------------------------
           EACH STAGE PANEL OCCUPIES 100VW FOR CLEAR SINGLE-STAGE VIEW
           ------------------------------------------------------------ */
        .showcase-stage-panel {
          width: 100vw;
          min-width: 100vw;
          max-width: 100vw;
          height: 100vh;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(80px + 32px) var(--page-pad-x) 48px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .stage-container {
          max-width: var(--container-max);
          width: 100%;
          margin: 0 auto;
          height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: clamp(40px, 6vw, 84px);
          align-items: center;
        }

        /* ------------------------------------------------------------
           CONTENT COLUMN (LEFT)
           ------------------------------------------------------------ */
        .panel-content-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 520px;
          z-index: 2;
        }

        /* Top Eyebrow in Intro */
        .stage-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .eyebrow-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.24em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .eyebrow-rule {
          width: 32px;
          height: 1px;
          background-color: rgba(198, 161, 91, 0.4);
        }

        /* Panel Meta (Index + Category) */
        .panel-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .panel-index-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold);
        }

        .meta-bullet {
          font-size: 10px;
          color: rgba(248, 247, 243, 0.3);
        }

        .panel-category-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(248, 247, 243, 0.65);
        }

        /* Headlines */
        .intro-stage-headline {
          font-family: var(--font-display-condensed);
          font-size: clamp(38px, 4.2vw, 58px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.015em;
          color: var(--color-white);
          margin: 0;
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
        }

        .panel-stage-headline {
          font-family: var(--font-display-condensed);
          font-size: clamp(32px, 3.8vw, 50px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.015em;
          color: var(--color-white);
          margin: 0;
          text-transform: uppercase;
        }

        /* Description Body */
        .stage-description {
          font-family: var(--font-body);
          font-size: clamp(14.5px, 1.15vw, 16.5px);
          line-height: 1.55;
          color: rgba(248, 247, 243, 0.82);
          margin: 4px 0 0 0;
          max-width: 480px;
        }

        .intro-stage-desc {
          color: rgba(248, 247, 243, 0.75);
        }

        /* Explore Prompt */
        .explore-cue {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          color: var(--color-gold);
        }

        .explore-cue-arrow {
          font-size: 14px;
          transition: transform 0.3s ease;
        }

        .stage-footer-note {
          margin-top: 8px;
        }

        .scope-indicator {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.2em;
          color: rgba(248, 247, 243, 0.4);
          text-transform: uppercase;
        }

        /* ------------------------------------------------------------
           MEDIA COLUMN (RIGHT)
           ------------------------------------------------------------ */
        .panel-media-col {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .stage-media-frame,
        .preview-media-frame {
          position: relative;
          width: 100%;
          height: min(60vh, 520px);
          aspect-ratio: 16 / 10;
          border-radius: 4px;
          overflow: hidden;
          background-color: var(--color-black);
          border: 1px solid rgba(248, 247, 243, 0.12);
          box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.9);
        }

        .stage-media-img,
        .preview-media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.95) contrast(1.05);
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease;
        }

        .showcase-stage-panel:hover .stage-media-img {
          transform: scale(1.025);
          filter: brightness(1) contrast(1.05);
        }

        .media-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.2) 0%,
            transparent 45%,
            rgba(7, 8, 7, 0.65) 100%
          );
          pointer-events: none;
        }

        .preview-overlay-tag {
          position: absolute;
          bottom: 20px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(7, 8, 7, 0.85);
          backdrop-filter: blur(8px);
          padding: 10px 16px;
          border: 1px solid rgba(248, 247, 243, 0.1);
          border-radius: 3px;
        }

        .preview-counter {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--color-gold);
        }

        .preview-label {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: var(--color-white);
        }

        /* ------------------------------------------------------------
           RESPONSIVE (MOBILE & TABLET BREAKPOINTS)
           ------------------------------------------------------------ */
        @media (max-width: 1024px) {
          .stage-container {
            grid-template-columns: 1fr;
            gap: 24px;
            align-content: center;
          }

          .panel-content-col {
            max-width: 100%;
          }

          .stage-media-frame,
          .preview-media-frame {
            height: min(44vh, 380px);
            aspect-ratio: 16 / 9;
          }
        }

        @media (max-width: 768px) {
          .featured-section {
            padding: 80px 0 100px 0;
            height: auto;
          }

          .horizontal-track {
            height: auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 60px;
            padding: 0 var(--page-pad-x);
          }

          .showcase-stage-panel {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            height: auto;
            padding: 0 0 48px 0;
            border-bottom: 1px solid rgba(248, 247, 243, 0.08);
          }

          .showcase-stage-panel:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .stage-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .stage-media-frame,
          .preview-media-frame {
            height: auto;
            aspect-ratio: 4 / 3;
            width: 100%;
          }
        }

        /* ------------------------------------------------------------
           REDUCED MOTION ACCESSIBILITY
           ------------------------------------------------------------ */
        @media (prefers-reduced-motion: reduce) {
          .horizontal-track {
            display: block;
            height: auto;
            width: 100%;
          }
          .showcase-stage-panel {
            width: 100%;
            height: auto;
            min-width: 0;
            padding: 60px var(--page-pad-x);
          }
        }
      `}</style>
    </section>
  );
};
