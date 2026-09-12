'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { siteContent } from '@/content/siteContent';

export const EventExperiences: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const categories = siteContent.experiences.categories;
  const numCategories = categories.length;

  // Handle Resize and Media Queries
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 992);
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Handle Scroll Progress through the Sticky Track
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }

          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalScrollable = rect.height - windowHeight;

          if (totalScrollable <= 0) {
            ticking = false;
            return;
          }

          // Compute normalized scroll progress: 0.00 at top of section, 1.00 at bottom
          const currentScroll = -rect.top;
          const rawProgress = currentScroll / totalScrollable;
          const clampedProgress = Math.max(0, Math.min(1, rawProgress));

          setProgress(clampedProgress);

          // Active category index: 0 to (numCategories - 1)
          const virtualPos = clampedProgress * (numCategories - 1);
          const currentActive = Math.min(
            numCategories - 1,
            Math.max(0, Math.round(virtualPos))
          );
          setActiveIndex(currentActive);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, reducedMotion, numCategories]);

  // Click indicator to jump directly to a category position
  const scrollToCategory = useCallback(
    (index: number) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      const targetProgress = index / (numCategories - 1);
      const targetScrollTop = window.scrollY + rect.top + targetProgress * totalScrollable;

      window.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    },
    [numCategories]
  );

  // Active category for the left-side copy
  const activeCategory = categories[activeIndex] || categories[0];

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="CHANDRA Event Experiences"
      className="work-section"
    >
      <div ref={stickyRef} className="work-sticky-container">
        <div className="work-content-wrapper">
          {/* LEFT SIDE: Stable Editorial Title & Active Category Details */}
          <div className="work-left-col">
            {/* Section Eyebrow */}
            <div className="work-eyebrow">
              <span className="eyebrow-text">{siteContent.experiences.eyebrow}</span>
              <div className="eyebrow-rule" aria-hidden="true" />
            </div>

            {/* Main Headline */}
            <h2 className="work-headline">
              <span className="headline-line">{siteContent.experiences.titleLine1 || 'EVERY EVENT.'}</span>
              <span className="headline-line">{siteContent.experiences.titleLine2 || 'A NEW STORY.'}</span>
            </h2>

            <p className="work-subtitle">
              {siteContent.experiences.subtitle}
            </p>

            {/* Active Category Editorial Card */}
            <div className="active-category-card">
              <div className="category-meta-header">
                <span className="category-index-badge">
                  {activeCategory.index}
                  <span className="index-total"> / 0{numCategories}</span>
                </span>
                <span className="category-tag">EVENT ARCHIVE</span>
              </div>

              <h3 className="category-active-title" key={activeCategory.id}>
                {activeCategory.title}
              </h3>

              <p className="category-active-desc" key={`desc-${activeCategory.id}`}>
                {activeCategory.shortDesc}
              </p>

              {/* Step Navigation Dots / Indicators */}
              <div className="category-step-indicators" aria-label="Category Navigation">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`step-btn ${idx === activeIndex ? 'is-active' : ''}`}
                    onClick={() => scrollToCategory(idx)}
                    aria-label={`Jump to category ${cat.index}: ${cat.title}`}
                  >
                    <span className="step-bar" />
                    <span className="step-num">{cat.index}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore CTA */}
            <div className="work-cta-wrapper">
              <a href="#contact" className="work-cta-link" aria-label="Explore All Event Productions">
                <span>{siteContent.experiences.exploreCta}</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Cinematic 3D Vertical Gallery */}
          <div className="work-right-col" aria-hidden="true">
            <div className="gallery-3d-stage">
              {categories.map((cat, i) => {
                // Calculate virtual scroll distance from this item
                const virtualPos = progress * (numCategories - 1);
                const d = i - virtualPos; // Delta: 0 when exactly active
                const absD = Math.abs(d);

                // 3D Transform calculations
                const translateY = d * 220; // Vertical offset
                const translateZ = -absD * 130; // Recede in 3D depth
                const rotateX = Math.max(-5, Math.min(5, -d * 3.5)); // Subtle physical tilt
                const scale = Math.max(0.78, 1 - absD * 0.12); // Active scaling
                const opacity = Math.max(0, 1 - absD * 0.58); // Opacity roll-off

                // Visual contrast & brightness grade
                const brightness = Math.max(0.55, 1.05 - absD * 0.5);
                const saturate = Math.max(0.7, 1.1 - absD * 0.4);

                // Aspect ratio / width morphing
                const widthPercent = Math.max(82, 100 - absD * 18);

                const isActive = Math.round(virtualPos) === i;

                return (
                  <div
                    key={cat.id}
                    className={`gallery-card-3d ${isActive ? 'is-active' : ''}`}
                    style={{
                      transform: `translate3d(0, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                      opacity: opacity,
                      width: `${widthPercent}%`,
                      zIndex: Math.round(10 - absD * 2),
                    }}
                    onClick={() => scrollToCategory(i)}
                  >
                    <div
                      className="card-media-wrapper"
                      style={{
                        filter: `brightness(${brightness}) saturate(${saturate}) contrast(1.05)`,
                      }}
                    >
                      <img
                        src={cat.image}
                        alt={cat.alt}
                        loading="lazy"
                        className="card-image"
                      />

                      {/* Vignette & Ambient Gradient */}
                      <div className="card-vignette" />

                      {/* Card Inset Metadata */}
                      <div className="card-top-meta">
                        <span className="card-category-num">{cat.index}</span>
                        <div className="card-meta-line" />
                        <span className="card-category-label">{cat.title}</span>
                      </div>

                      {/* Active Status Indicator */}
                      {isActive && (
                        <div className="card-active-badge">
                          <span className="active-dot" />
                          <span>ACTIVE SCENE</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE / REDUCED-MOTION FALLBACK: Stacked Cinematic Cards */}
      <div className="work-mobile-container">
        <div className="work-mobile-header">
          <div className="work-eyebrow">
            <span className="eyebrow-text">{siteContent.experiences.eyebrow}</span>
            <div className="eyebrow-rule" aria-hidden="true" />
          </div>

          <h2 className="work-headline">
            <span className="headline-line">{siteContent.experiences.titleLine1 || 'EVERY EVENT.'}</span>
            <span className="headline-line">{siteContent.experiences.titleLine2 || 'A NEW STORY.'}</span>
          </h2>

          <p className="work-subtitle">{siteContent.experiences.subtitle}</p>
        </div>

        <div className="work-mobile-cards">
          {categories.map((cat) => (
            <div key={cat.id} className="mobile-event-card">
              <div className="mobile-card-image-wrapper">
                <img src={cat.image} alt={cat.alt} loading="lazy" className="mobile-card-image" />
                <div className="card-vignette" />
                <span className="mobile-card-index">{cat.index}</span>
              </div>

              <div className="mobile-card-info">
                <h3 className="mobile-card-title">{cat.title}</h3>
                <p className="mobile-card-desc">{cat.shortDesc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="work-mobile-footer">
          <a href="#contact" className="work-cta-link">
            <span>{siteContent.experiences.exploreCta}</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Desktop Section & Sticky Track */
        .work-section {
          background-color: var(--color-black);
          color: var(--color-white);
          position: relative;
          min-height: 290vh; /* Controlled scroll track for 5 items */
        }

        .work-sticky-container {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(
            circle at 75% 50%,
            rgba(24, 26, 22, 0.75) 0%,
            var(--color-black) 70%
          );
        }

        .work-content-wrapper {
          width: 100%;
          max-width: var(--container-max);
          padding: 0 var(--page-pad-x);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(40px, 5vw, 80px);
          height: 100%;
        }

        /* LEFT SIDE: Stable Editorial Column (~38% of width) */
        .work-left-col {
          flex: 0 0 38%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .work-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .eyebrow-text {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .eyebrow-rule {
          width: 32px;
          height: 1px;
          background-color: var(--color-gold);
          opacity: 0.75;
        }

        .work-headline {
          font-family: var(--font-display);
          font-size: clamp(38px, 4.2vw, 58px);
          font-weight: 400;
          line-height: 0.96;
          letter-spacing: -0.025em;
          color: var(--color-white);
          margin: 0 0 16px 0;
          display: flex;
          flex-direction: column;
        }

        .headline-line {
          display: block;
        }

        .work-subtitle {
          font-family: var(--font-body);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-muted-dark);
          text-transform: uppercase;
          margin: 0 0 32px 0;
        }

        /* Active Category Callout Card */
        .active-category-card {
          background-color: rgba(17, 18, 15, 0.75);
          border: 1px solid rgba(248, 247, 243, 0.1);
          border-left: 2px solid var(--color-gold);
          padding: 24px 26px;
          margin-bottom: 32px;
          backdrop-filter: blur(12px);
          border-radius: 2px;
          transition: border-color 0.3s ease;
        }

        .category-meta-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .category-index-badge {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--color-gold);
        }

        .index-total {
          color: var(--color-muted-dark);
          font-size: 11px;
          font-weight: 400;
        }

        .category-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.2em;
          color: var(--color-muted-dark);
          text-transform: uppercase;
        }

        .category-active-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 1.8vw, 26px);
          font-weight: 400;
          line-height: 1.1;
          letter-spacing: -0.015em;
          color: var(--color-white);
          margin: 0 0 10px 0;
          animation: textFadeIn 0.35s var(--ease-cinematic);
        }

        .category-active-desc {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-muted-dark);
          margin: 0 0 20px 0;
          animation: textFadeIn 0.35s var(--ease-cinematic);
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Step Indicators (Interactive 5 dashes) */
        .category-step-indicators {
          display: flex;
          align-items: center;
          gap: 8px;
          border-top: 1px solid rgba(248, 247, 243, 0.08);
          padding-top: 16px;
        }

        .step-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 6px 0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .step-bar {
          width: 100%;
          height: 2px;
          background-color: rgba(248, 247, 243, 0.18);
          transition: background-color 0.3s ease, height 0.3s ease;
        }

        .step-num {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          color: var(--color-muted-dark);
          transition: color 0.3s ease;
        }

        .step-btn.is-active .step-bar {
          background-color: var(--color-gold);
          height: 2px;
        }

        .step-btn.is-active .step-num {
          color: var(--color-gold);
          font-weight: 600;
        }

        .step-btn:hover .step-bar {
          background-color: var(--color-white);
        }

        /* CTA */
        .work-cta-wrapper {
          display: inline-block;
        }

        .work-cta-link {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-body);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-white);
          text-decoration: none;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 6px;
          transition: color 0.3s ease;
        }

        .work-cta-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--color-gold);
          transform: scaleX(0.4);
          transform-origin: left;
          transition: transform 0.4s var(--ease-cinematic), background-color 0.3s ease;
        }

        .work-cta-link:hover::after {
          transform: scaleX(1);
          background-color: var(--color-white);
        }

        /* RIGHT SIDE: Cinematic 3D Gallery Stage (~56% of width) */
        .work-right-col {
          flex: 0 0 56%;
          height: 72vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-3d-stage {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1200px;
          perspective-origin: 50% 50%;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-card-3d {
          position: absolute;
          max-width: 600px;
          aspect-ratio: 16 / 10;
          cursor: pointer;
          will-change: transform, opacity;
          transition: transform 0.15s linear, opacity 0.15s linear, width 0.15s linear;
          transform-style: preserve-3d;
        }

        .card-media-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: var(--color-charcoal);
          border: 1px solid rgba(248, 247, 243, 0.1);
          box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.85);
          will-change: filter;
          transition: filter 0.2s linear;
        }

        .gallery-card-3d.is-active .card-media-wrapper {
          border-color: rgba(198, 161, 91, 0.35);
          box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.95), 0 0 20px rgba(198, 161, 91, 0.15);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.4) 0%,
            transparent 35%,
            rgba(7, 8, 7, 0.2) 65%,
            rgba(7, 8, 7, 0.75) 100%
          );
          pointer-events: none;
        }

        .card-top-meta {
          position: absolute;
          top: 18px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 2;
        }

        .card-category-num {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--color-gold);
        }

        .card-meta-line {
          width: 20px;
          height: 1px;
          background-color: rgba(248, 247, 243, 0.3);
        }

        .card-category-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--color-white);
          text-transform: uppercase;
        }

        .card-active-badge {
          position: absolute;
          bottom: 18px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          color: var(--color-gold);
          text-transform: uppercase;
          z-index: 2;
        }

        .active-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--color-gold);
          box-shadow: 0 0 6px rgba(198, 161, 91, 0.8);
        }

        /* Mobile View: Hidden on Desktop */
        .work-mobile-container {
          display: none;
        }

        /* Responsive Breakpoints */
        @media (max-width: 991px) {
          .work-section {
            min-height: auto !important;
            padding: clamp(70px, 9vw, 100px) var(--page-pad-x);
          }

          .work-sticky-container {
            display: none !important;
          }

          .work-mobile-container {
            display: block;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
          }

          .work-mobile-header {
            margin-bottom: 40px;
          }

          .work-mobile-cards {
            display: flex;
            flex-direction: column;
            gap: 32px;
          }

          .mobile-event-card {
            background-color: var(--color-charcoal);
            border: 1px solid rgba(248, 247, 243, 0.1);
            overflow: hidden;
          }

          .mobile-card-image-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
          }

          .mobile-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .mobile-card-index {
            position: absolute;
            top: 14px;
            left: 16px;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 600;
            color: var(--color-gold);
            background: rgba(7, 8, 7, 0.7);
            padding: 2px 8px;
            border-radius: 2px;
            z-index: 2;
          }

          .mobile-card-info {
            padding: 20px;
          }

          .mobile-card-title {
            font-family: var(--font-display);
            font-size: 20px;
            font-weight: 400;
            color: var(--color-white);
            margin: 0 0 8px 0;
          }

          .mobile-card-desc {
            font-family: var(--font-body);
            font-size: 14px;
            line-height: 1.55;
            color: var(--color-muted-dark);
            margin: 0;
          }

          .work-mobile-footer {
            margin-top: 40px;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};
