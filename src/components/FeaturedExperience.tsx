'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '@/content/siteContent';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FeaturedExperience: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCounter, setActiveCounter] = useState('01 / 05');

  useEffect(() => {
    // Respect reduced motion and mobile/tablet native scroll behavior
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileOrTablet = window.matchMedia('(max-width: 1023px)').matches;

    if (prefersReducedMotion || isMobileOrTablet) return;

    // Use GSAP context for safe cleanup during HMR or unmount
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      ScrollTrigger.refresh();

      // Total horizontal distance to scroll
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
      });

      const totalExperiences = siteContent.featured.showcase.length; // 5

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        animation: tween,
        scrub: 1, // Smooth interaction
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Calculate active experience index (1 to 5)
          const currentIdx = Math.min(
            Math.max(Math.floor(progress * totalExperiences) + 1, 1),
            totalExperiences
          );
          setActiveCounter(`0${currentIdx} / 05`);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const data = siteContent.featured;

  return (
    <section 
      ref={containerRef} 
      id="featured" 
      className="featured-stage"
      aria-label="CHANDRA Featured Experience Exhibition"
    >
      {/* Minimal Top Header Bar (Safe Area Protected) */}
      <div className="stage-top-meta" aria-hidden="true">
        <span className="stage-eyebrow-tag">03 / {data.eyebrow}</span>
        <span className="stage-active-index">{activeCounter}</span>
      </div>

      {/* Horizontal Track — Clean Canvas Exhibition (No Cards) */}
      <div className="stage-horizontal-track" ref={trackRef}>
        
        {/* Intro Story Block (Integrated Naturally at Start of Track) */}
        <div className="stage-intro-block">
          <span className="intro-tag">{data.eyebrow}</span>
          
          <h2 className="intro-headline">
            <span>{data.introHeadlineLine1}</span>
            <span>{data.introHeadlineLine2}</span>
          </h2>

          <p className="intro-support">
            {data.introSupport}
          </p>

          <div className="intro-scroll-hint" aria-hidden="true">
            <span className="hint-text">SCROLL TO EXPLORE</span>
            <span className="hint-arrow">→</span>
          </div>
        </div>

        {/* 5 Full-Scale Experience Moments (30% Text / 70% Large Immersive Media) */}
        {data.showcase.map((item) => (
          <div key={item.id} className="experience-moment">
            
            {/* Left: Editorial Story (28–32%) */}
            <div className="moment-text-col">
              <div className="moment-meta">
                <span className="moment-index">{item.index.split('/')[0].trim()}</span>
                <span className="moment-sep">/</span>
                <span className="moment-category">{item.category}</span>
              </div>

              <h3 className="moment-headline">
                {item.title}
              </h3>

              <p className="moment-desc">
                {item.description}
              </p>
            </div>

            {/* Right: Dominant Immersive Visual (68–72%) */}
            <div className="moment-media-col">
              <div className="moment-media-viewport">
                <img 
                  src={item.image} 
                  alt={item.imageAlt} 
                  className="moment-media-image"
                  loading="lazy"
                />
                <div className="moment-media-vignette" aria-hidden="true" />
              </div>
            </div>

          </div>
        ))}

      </div>

      <style jsx>{`
        /* ============================================================
           FEATURED EXPERIENCE — CINEMATIC FULL-STAGE EXHIBITION (GSAP)
           No cards · No boxes · Pure 30% Editorial / 70% Monumental Media
           ============================================================ */

        .featured-stage {
          background-color: var(--color-black);
          color: var(--color-white);
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          box-sizing: border-box;
          border-top: 1px solid rgba(248, 247, 243, 0.06);
          border-bottom: 1px solid rgba(248, 247, 243, 0.06);
        }

        /* ------------------------------------------------------------
           MINIMAL TOP META BAR (SAFE ZONE BELOW MAIN NAVBAR)
           ------------------------------------------------------------ */
        .stage-top-meta {
          position: absolute;
          top: max(24px, 3.5vh);
          left: clamp(24px, 4.5vw, 64px);
          right: clamp(24px, 4.5vw, 64px);
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }

        .stage-eyebrow-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .stage-active-index {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(248, 247, 243, 0.6);
        }

        /* ------------------------------------------------------------
           HORIZONTAL SCROLL TRACK
           ------------------------------------------------------------ */
        .stage-horizontal-track {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 100%;
          width: max-content;
          will-change: transform;
          padding-top: max(84px, 10vh);
          padding-bottom: max(28px, 4vh);
          padding-left: clamp(24px, 4.5vw, 64px);
          padding-right: clamp(48px, 8vw, 120px);
          gap: clamp(48px, 6vw, 96px);
          box-sizing: border-box;
        }

        /* ------------------------------------------------------------
           NATURAL INTRO BLOCK (START OF TRACK)
           ------------------------------------------------------------ */
        .stage-intro-block {
          width: clamp(340px, 32vw, 480px);
          min-width: clamp(340px, 32vw, 480px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-shrink: 0;
          padding-right: clamp(20px, 3vw, 40px);
        }

        .intro-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .intro-headline {
          font-family: var(--font-display-condensed);
          font-size: clamp(42px, 4.8vw, 74px);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: var(--color-white);
          text-transform: uppercase;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
        }

        .intro-support {
          font-family: var(--font-body);
          font-size: clamp(15px, 1.15vw, 17px);
          line-height: 1.6;
          color: rgba(248, 247, 243, 0.78);
          margin: 0 0 28px 0;
          max-width: 440px;
        }

        .intro-scroll-hint {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          color: var(--color-gold);
        }

        .hint-arrow {
          font-size: 14px;
          transition: transform 0.3s ease;
        }

        .stage-intro-block:hover .hint-arrow {
          transform: translateX(4px);
        }

        /* ------------------------------------------------------------
           FULL-SCALE EXPERIENCE MOMENTS (30% TEXT / 70% MEDIA)
           ------------------------------------------------------------ */
        .experience-moment {
          width: 90vw;
          min-width: 90vw;
          max-width: 90vw;
          height: 100%;
          display: grid;
          grid-template-columns: minmax(260px, 28vw) minmax(0, 1fr);
          gap: clamp(36px, 4.5vw, 72px);
          align-items: center;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        /* Left: Editorial Story (28–32%) */
        .moment-text-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 440px;
          z-index: 2;
        }

        .moment-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .moment-sep {
          color: rgba(248, 247, 243, 0.3);
        }

        .moment-category {
          color: var(--color-gold);
        }

        .moment-headline {
          font-family: var(--font-display-condensed);
          font-size: clamp(42px, 4.6vw, 72px);
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: var(--color-white);
          margin: 0 0 20px 0;
          text-transform: uppercase;
        }

        .moment-desc {
          font-family: var(--font-body);
          font-size: clamp(15px, 1.15vw, 17px);
          line-height: 1.6;
          color: rgba(248, 247, 243, 0.82);
          margin: 0;
          max-width: 400px;
        }

        /* Right: Dominant Immersive Visual (68–72%) */
        .moment-media-col {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .moment-media-viewport {
          position: relative;
          width: 100%;
          height: clamp(480px, 72vh, 780px);
          border-radius: 4px;
          overflow: hidden;
          background-color: #0c0d0b;
        }

        .moment-media-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.95) contrast(1.05);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .experience-moment:hover .moment-media-image {
          transform: scale(1.02);
        }

        .moment-media-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.08) 0%,
            transparent 40%,
            rgba(7, 8, 7, 0.4) 100%
          );
          pointer-events: none;
        }

        /* ------------------------------------------------------------
           RESPONSIVE (MOBILE & TABLET BREAKPOINTS < 1024PX)
           ------------------------------------------------------------ */
        @media (max-width: 1023px) {
          .featured-stage {
            height: auto;
            padding: 80px 0 100px 0;
          }

          .stage-top-meta {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            padding: 0 var(--page-pad-x) 40px;
          }

          .stage-horizontal-track {
            height: auto;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: clamp(60px, 10vh, 100px);
            padding: 0 var(--page-pad-x);
          }

          .stage-intro-block {
            width: 100%;
            min-width: 0;
            padding-right: 0;
          }

          .experience-moment {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .moment-text-col {
            max-width: 100%;
          }

          .moment-media-viewport {
            height: auto;
            aspect-ratio: 16 / 10;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .intro-headline {
            font-size: 36px;
          }

          .moment-headline {
            font-size: 34px;
          }

          .moment-media-viewport {
            aspect-ratio: 4 / 3;
          }
        }

        /* ------------------------------------------------------------
           REDUCED MOTION ACCESSIBILITY
           ------------------------------------------------------------ */
        @media (prefers-reduced-motion: reduce) {
          .featured-stage {
            height: auto;
          }

          .stage-horizontal-track {
            display: flex;
            flex-direction: column;
            height: auto;
            width: 100%;
            gap: 80px;
            padding: 60px var(--page-pad-x);
          }

          .experience-moment {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            height: auto;
          }
        }
      `}</style>
    </section>
  );
};
