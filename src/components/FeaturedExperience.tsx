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

      // Ensure fonts/images are calculated properly
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
        
        {/* Intro Frame */}
        <div className="intro-frame">
          <div className="intro-content">
            <span className="eyebrow">{data.eyebrow}</span>
            <h2 className="intro-headline">
              {data.introHeadlineLine1}<br/>
              {data.introHeadlineLine2}
            </h2>
            <p className="intro-support">{data.introSupport}</p>
          </div>
        </div>

        {/* 5 Experience Panels */}
        {data.showcase.map((item) => (
          <div key={item.id} className="showcase-panel">
            <div className="panel-content">
              <div className="panel-meta">
                <span className="panel-index">{item.index}</span>
                <span className="panel-category">{item.category}</span>
              </div>
              <div className="panel-title-block">
                <h3 className="panel-title">{item.title}</h3>
                <p className="panel-description">{item.description}</p>
              </div>
            </div>
            <div className="panel-image-wrapper">
              <img 
                src={item.image} 
                alt={item.imageAlt} 
                loading="lazy" 
                className="panel-image"
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .featured-section {
          background-color: var(--color-charcoal);
          color: var(--color-white);
          overflow: hidden;
          position: relative;
        }

        .horizontal-track {
          display: flex;
          align-items: center;
          height: 100vh;
          width: max-content;
          will-change: transform;
        }

        .intro-frame {
          width: 55vw;
          min-width: 500px;
          height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 var(--page-pad-x);
          flex-shrink: 0;
        }

        .intro-content {
          max-width: 540px;
        }

        .eyebrow {
          display: block;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.24em;
          color: var(--color-gold);
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .intro-headline {
          font-family: var(--font-display);
          font-size: clamp(32px, 4.5vw, 64px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
        }

        .intro-support {
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          max-width: 400px;
        }

        .showcase-panel {
          width: 78vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 4vw;
          flex-shrink: 0;
        }

        .showcase-panel:last-child {
          padding-right: 12vw;
        }

        .panel-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #000;
        }

        .panel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        
        .showcase-panel:hover .panel-image {
          transform: scale(1.02);
        }

        .panel-content {
          margin-bottom: 32px;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          align-items: end;
        }

        .panel-meta {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 4px;
        }

        .panel-index {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--color-gold);
        }

        .panel-category {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }

        .panel-title {
          font-family: var(--font-display);
          font-size: clamp(24px, 2.5vw, 42px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.015em;
          margin: 0 0 12px 0;
        }

        .panel-description {
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255,255,255,0.8);
          margin: 0;
          max-width: 500px;
        }

        @media (max-width: 1024px) {
          .panel-content {
            grid-template-columns: 1fr;
            gap: 16px;
            align-items: start;
          }
          .panel-meta {
            flex-direction: row;
            align-items: center;
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
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            padding-left: var(--page-pad-x);
          }
          .horizontal-track::-webkit-scrollbar {
            display: none;
          }
          .intro-frame {
            width: 85vw;
            min-width: 0;
            height: auto;
            scroll-snap-align: start;
            padding: 0;
            margin-right: 32px;
          }
          .showcase-panel {
            width: 88vw;
            height: auto;
            scroll-snap-align: start;
            padding: 0;
            margin-right: 32px;
          }
          .showcase-panel:last-child {
            padding-right: var(--page-pad-x);
            margin-right: 0;
          }
          .panel-image-wrapper {
            margin-top: 24px;
            aspect-ratio: 4/3;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .horizontal-track {
            display: block;
            height: auto;
            width: 100%;
          }
          .intro-frame, .showcase-panel {
            width: 100%;
            height: auto;
            min-width: 0;
            padding: 60px var(--page-pad-x);
            margin: 0;
          }
        }
      `}</style>
    </section>
  );
};
