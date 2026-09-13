'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { siteContent } from '@/content/siteContent';

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [svgPathD, setSvgPathD] = useState<string>('');
  const [pathLength, setPathLength] = useState<number>(0);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number }>({ x: 24, y: 0 });
  const [endPoint, setEndPoint] = useState<{ x: number; y: number }>({ x: 24, y: 0 });
  const [mobileActiveIndices, setMobileActiveIndices] = useState<number[]>([0]);

  const steps = siteContent.process.steps;
  const numSteps = steps.length;

  // Responsive & Reduced Motion Detection
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Compute the Continuous Architectural Serpentine SVG Path for Desktop
  const calculatePath = useCallback(() => {
    if (isMobile || !journeyRef.current || stageRefs.current.length < numSteps) return;

    const journeyRect = journeyRef.current.getBoundingClientRect();
    const containerWidth = journeyRect.width;

    // Margins for left and right path rails
    const leftX = 20;
    const rightX = containerWidth - 20;
    const R = 28; // Corner fillet radius

    const points: { x: number; y: number }[] = [];

    // Measure each stage's top and bottom relative to journey container
    const stageMetrics = stageRefs.current.map((stageEl) => {
      if (!stageEl) return { top: 0, bottom: 0, height: 0 };
      const r = stageEl.getBoundingClientRect();
      return {
        top: r.top - journeyRect.top,
        bottom: r.bottom - journeyRect.top,
        height: r.height,
      };
    });

    // Start point: slightly above first stage
    const startY = Math.max(10, stageMetrics[0].top - 30);
    setStartPoint({ x: leftX, y: startY });

    let d = `M ${leftX} ${startY}`;

    // Stage 01 (Text Left, Media Right): Rail is on LEFT
    // Runs down past stage 1, then bends 90deg right, runs across to rightX, bends 90deg down
    const s0Bottom = stageMetrics[0].bottom;
    const s1Top = stageMetrics[1].top;
    const crossY0 = (s0Bottom + s1Top) / 2;

    d += ` L ${leftX} ${crossY0 - R}`;
    d += ` Q ${leftX} ${crossY0}, ${leftX + R} ${crossY0}`;
    d += ` L ${rightX - R} ${crossY0}`;
    d += ` Q ${rightX} ${crossY0}, ${rightX} ${crossY0 + R}`;

    // Stage 02 (Media Left, Text Right): Rail is on RIGHT
    // Runs down past stage 2, then bends 90deg left, runs across to leftX, bends 90deg down
    const s1Bottom = stageMetrics[1].bottom;
    const s2Top = stageMetrics[2].top;
    const crossY1 = (s1Bottom + s2Top) / 2;

    d += ` L ${rightX} ${crossY1 - R}`;
    d += ` Q ${rightX} ${crossY1}, ${rightX - R} ${crossY1}`;
    d += ` L ${leftX + R} ${crossY1}`;
    d += ` Q ${leftX} ${crossY1}, ${leftX} ${crossY1 + R}`;

    // Stage 03 (Text Left, Media Right): Rail is on LEFT
    // Runs down past stage 3, then bends 90deg right, runs across to rightX, bends 90deg down
    const s2Bottom = stageMetrics[2].bottom;
    const s3Top = stageMetrics[3].top;
    const crossY2 = (s2Bottom + s3Top) / 2;

    d += ` L ${leftX} ${crossY2 - R}`;
    d += ` Q ${leftX} ${crossY2}, ${leftX + R} ${crossY2}`;
    d += ` L ${rightX - R} ${crossY2}`;
    d += ` Q ${rightX} ${crossY2}, ${rightX} ${crossY2 + R}`;

    // Stage 04 (Media Left, Text Right): Rail is on RIGHT
    // Runs down past stage 4, then bends 90deg left, runs across to leftX, bends 90deg down
    const s3Bottom = stageMetrics[3].bottom;
    const s4Top = stageMetrics[4].top;
    const crossY3 = (s3Bottom + s4Top) / 2;

    d += ` L ${rightX} ${crossY3 - R}`;
    d += ` Q ${rightX} ${crossY3}, ${rightX - R} ${crossY3}`;
    d += ` L ${leftX + R} ${crossY3}`;
    d += ` Q ${leftX} ${crossY3}, ${leftX} ${crossY3 + R}`;

    // Stage 05 (Text Left, Media Right): Rail is on LEFT
    // Runs down past stage 5 to the end node
    const s4Bottom = stageMetrics[4].bottom;
    const endY = s4Bottom + 40;

    d += ` L ${leftX} ${endY}`;
    setEndPoint({ x: leftX, y: endY });

    setSvgPathD(d);
  }, [isMobile, numSteps]);

  // Recalculate path on layout changes & image load
  useEffect(() => {
    if (isMobile) return;

    calculatePath();

    // Use ResizeObserver for accurate container dimensions
    let ro: ResizeObserver | null = null;
    if (journeyRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        calculatePath();
      });
      ro.observe(journeyRef.current);
    }

    const timer = setTimeout(calculatePath, 300);
    const timer2 = setTimeout(calculatePath, 1000);

    return () => {
      ro?.disconnect();
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [calculatePath, isMobile]);

  // Update SVG Path Total Length for dasharray
  useEffect(() => {
    if (pathRef.current && svgPathD) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [svgPathD]);

  // Native Scroll-Linked Progress (Smooth 60-120fps requestAnimationFrame)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = window.requestAnimationFrame(() => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Path progress starts when top of journey enters bottom 35% of viewport
        // and finishes when bottom of journey reaches top 35% of viewport
        const startOffset = windowHeight * 0.65;
        const endOffset = windowHeight * 0.35;
        const totalDistance = rect.height - endOffset;

        if (totalDistance <= 0) return;

        const currentScroll = startOffset - rect.top;
        const rawProgress = currentScroll / totalDistance;
        const clamped = Math.max(0, Math.min(1, rawProgress));

        setScrollProgress(clamped);

        // Map progress to active stage index (0 to 4)
        const stageIndex = Math.min(
          numSteps - 1,
          Math.max(0, Math.floor(clamped * numSteps * 0.999))
        );
        setActiveStageIndex(stageIndex);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [numSteps]);

  // Mobile In-View Detection (Center Viewport Threshold)
  useEffect(() => {
    if (!isMobile) return;

    const itemElements = document.querySelectorAll<HTMLElement>('.chandra-process__mobile-step');
    if (!itemElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-step-index'));
          if (entry.isIntersecting) {
            setMobileActiveIndices((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.15,
      }
    );

    itemElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="CHANDRA Process"
      className="chandra-process"
    >
      <div className="chandra-process__container">
        {/* Section Intro / Eyebrow Header */}
        <header className="chandra-process__header">
          <div className="chandra-process__eyebrow-row">
            <span className="chandra-process__eyebrow">
              {siteContent.process.eyebrow}
            </span>
            <div className="chandra-process__eyebrow-rule" aria-hidden="true" />
          </div>

          <h2 className="chandra-process__supporting">
            {siteContent.process.supportingLine}
          </h2>
        </header>

        {/* DESKTOP VIEW: Continuous Serpentine Process Journey (≥ 1024px) */}
        <div ref={journeyRef} className="chandra-process__journey" aria-hidden={isMobile}>
          {/* Continuous Serpentine SVG Path */}
          {svgPathD && (
            <svg
              className="chandra-process__svg-canvas"
              aria-hidden="true"
            >
              {/* Base Inactive Path (Muted Bronze/Gold) */}
              <path
                d={svgPathD}
                fill="none"
                stroke="rgba(198, 161, 91, 0.20)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Progress Path (Champagne Gold #C6A15B) */}
              <path
                ref={pathRef}
                d={svgPathD}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: pathLength || 1000,
                  strokeDashoffset: reducedMotion
                    ? 0
                    : (pathLength || 1000) * (1 - scrollProgress),
                  transition: 'stroke-dashoffset 0.08s linear',
                }}
              />

              {/* Start Node: Brief enters the process */}
              <circle
                cx={startPoint.x}
                cy={startPoint.y}
                r="4.5"
                fill="var(--color-gold)"
                stroke="var(--color-black)"
                strokeWidth="2"
              />

              {/* End Node: Experience delivered */}
              <circle
                cx={endPoint.x}
                cy={endPoint.y}
                r="4.5"
                fill={scrollProgress >= 0.95 || reducedMotion ? 'var(--color-gold)' : 'rgba(198, 161, 91, 0.3)'}
                stroke="var(--color-black)"
                strokeWidth="2"
                style={{ transition: 'fill 0.3s ease' }}
              />
            </svg>
          )}

          {/* 5 Alternating Process Stages */}
          <ol className="chandra-process__stages-list">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0; // Even: Text Left, Media Right. Odd: Media Left, Text Right.
              const isPassed = scrollProgress >= (idx + 0.8) / numSteps;
              const isActive = !reducedMotion && idx === activeStageIndex;
              const isCompleted = reducedMotion || isPassed || idx < activeStageIndex;

              return (
                <li
                  key={step.id}
                  ref={(el) => {
                    stageRefs.current[idx] = el;
                  }}
                  className={`chandra-process__stage ${
                    isEven ? 'chandra-process__stage--even' : 'chandra-process__stage--odd'
                  } ${
                    isActive
                      ? 'chandra-process__stage--active'
                      : isCompleted
                      ? 'chandra-process__stage--completed'
                      : 'chandra-process__stage--upcoming'
                  }`}
                >
                  {/* TEXT CONTENT BLOCK */}
                  <div className="chandra-process__text-block">
                    {/* Stage Meta & Large Number */}
                    <div className="chandra-process__stage-meta">
                      <span className="chandra-process__meta-tag">{step.meta}</span>
                    </div>

                    <div className="chandra-process__title-row">
                      <span className="chandra-process__number">{step.id}</span>
                      <h3 className="chandra-process__title">{step.title}</h3>
                    </div>

                    <p className="chandra-process__description">
                      {step.description}
                    </p>

                    <div className="chandra-process__stage-accent-rule" aria-hidden="true" />
                  </div>

                  {/* MEDIA FRAME BLOCK */}
                  <div className="chandra-process__media-block">
                    <figure className="chandra-process__media-frame">
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        loading="lazy"
                        className="chandra-process__image"
                      />
                      {/* Subtle Dark Vignette */}
                      <div className="chandra-process__media-vignette" aria-hidden="true" />
                      
                      {/* Stage Tag Overlay */}
                      <div className="chandra-process__media-overlay" aria-hidden="true">
                        <span className="chandra-process__overlay-badge">STAGE {step.id}</span>
                      </div>
                    </figure>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* MOBILE VIEW: Clean Native Vertical Flow (< 1024px) */}
        <div ref={mobileTrackRef} className="chandra-process__mobile-view" aria-hidden={!isMobile}>
          {/* Vertical Base Line */}
          <div className="chandra-process__mobile-rail" aria-hidden="true" />

          <ol className="chandra-process__mobile-list">
            {steps.map((step, idx) => {
              const isPastOrActive = mobileActiveIndices.includes(idx);

              return (
                <li
                  key={step.id}
                  data-step-index={idx}
                  className={`chandra-process__mobile-step ${
                    isPastOrActive ? 'is-active' : ''
                  }`}
                >
                  {/* Left Step Node Marker */}
                  <div className="chandra-process__mobile-node" aria-hidden="true">
                    <span className="chandra-process__mobile-node-dot" />
                  </div>

                  {/* Right Content */}
                  <div className="chandra-process__mobile-body">
                    <div className="chandra-process__mobile-head">
                      <span className="chandra-process__mobile-num">{step.id}</span>
                      <span className="chandra-process__mobile-divider">/</span>
                      <h3 className="chandra-process__mobile-title">{step.title}</h3>
                    </div>

                    <p className="chandra-process__mobile-desc">
                      {step.description}
                    </p>

                    {/* Mobile Media Frame */}
                    <figure className="chandra-process__mobile-figure">
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        loading="lazy"
                        className="chandra-process__mobile-img"
                      />
                      <div className="chandra-process__media-vignette" aria-hidden="true" />
                    </figure>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <style jsx>{`
        /* ============================================================
           CHANDRA PROCESS STYLES — VERTICAL CINEMATIC FLOW
           ============================================================ */

        .chandra-process {
          background-color: var(--color-black);
          color: var(--color-white);
          position: relative;
          border-top: 1px solid rgba(248, 247, 243, 0.08);
          padding: clamp(90px, 9vw, 150px) var(--page-pad-x);
          overflow: hidden;
        }

        .chandra-process__container {
          max-width: var(--container-max);
          margin: 0 auto;
          width: 100%;
        }

        /* ------------------------------------------------------------
           Section Header (Preserved Söhne / Monument Hierarchy)
           ------------------------------------------------------------ */
        .chandra-process__header {
          margin-bottom: clamp(60px, 7vw, 100px);
          max-width: 720px;
        }

        .chandra-process__eyebrow-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .chandra-process__eyebrow {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.24em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .chandra-process__eyebrow-rule {
          width: 36px;
          height: 1px;
          background-color: var(--color-gold);
          opacity: 0.75;
        }

        .chandra-process__supporting {
          font-family: var(--font-body);
          font-size: clamp(14px, 1.4vw, 18px);
          font-weight: 500;
          letter-spacing: 0.16em;
          line-height: 1.4;
          color: var(--color-white);
          text-transform: uppercase;
          margin: 0;
        }

        /* ------------------------------------------------------------
           DESKTOP JOURNEY (≥ 1024px)
           ------------------------------------------------------------ */
        .chandra-process__journey {
          position: relative;
          width: 100%;
          display: block;
        }

        .chandra-process__svg-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .chandra-process__stages-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(80px, 8.5vw, 130px);
          position: relative;
          z-index: 2;
        }

        /* Alternating Grid Row Composition */
        .chandra-process__stage {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(48px, 6vw, 96px);
          align-items: center;
          transition: opacity 0.35s var(--ease-ui);
        }

        /* Stage 01, 03, 05: Text on Left (col 1), Media on Right (col 2) */
        .chandra-process__stage--even {
          padding-left: 52px; /* Breathing room for left SVG rail */
        }
        .chandra-process__stage--even .chandra-process__text-block {
          grid-column: 1;
        }
        .chandra-process__stage--even .chandra-process__media-block {
          grid-column: 2;
        }

        /* Stage 02, 04: Media on Left (col 1), Text on Right (col 2) */
        .chandra-process__stage--odd {
          padding-right: 52px; /* Breathing room for right SVG rail */
        }
        .chandra-process__stage--odd .chandra-process__media-block {
          grid-column: 1;
        }
        .chandra-process__stage--odd .chandra-process__text-block {
          grid-column: 2;
        }

        /* Stage Visual States: Upcoming, Active, Completed */
        .chandra-process__stage--upcoming {
          opacity: 0.45;
        }

        .chandra-process__stage--active {
          opacity: 1;
        }

        .chandra-process__stage--completed {
          opacity: 0.88;
        }

        /* Text Block */
        .chandra-process__text-block {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 460px;
        }

        .chandra-process__stage-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chandra-process__meta-tag {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.2em;
          color: var(--color-gold);
          text-transform: uppercase;
        }

        .chandra-process__title-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
        }

        .chandra-process__number {
          font-family: var(--font-display-condensed);
          font-size: clamp(46px, 4.8vw, 68px);
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: var(--color-gold);
          transition: color 0.3s ease;
        }

        .chandra-process__stage--upcoming .chandra-process__number {
          color: rgba(198, 161, 91, 0.45);
        }

        .chandra-process__title {
          font-family: var(--font-display);
          font-size: clamp(24px, 2.4vw, 34px);
          font-weight: 400;
          letter-spacing: -0.015em;
          color: var(--color-white);
          margin: 0;
          text-transform: uppercase;
        }

        .chandra-process__description {
          font-family: var(--font-body);
          font-size: clamp(14px, 1.1vw, 16px);
          line-height: 1.6;
          color: var(--color-muted-dark);
          margin: 0;
          transition: color 0.3s ease;
        }

        .chandra-process__stage--active .chandra-process__description,
        .chandra-process__stage--completed .chandra-process__description {
          color: rgba(248, 247, 243, 0.9);
        }

        .chandra-process__stage-accent-rule {
          width: 32px;
          height: 1px;
          background-color: var(--color-gold);
          opacity: 0.65;
          margin-top: 8px;
        }

        /* Media Frame Block */
        .chandra-process__media-block {
          width: 100%;
        }

        .chandra-process__media-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          margin: 0;
          overflow: hidden;
          background-color: var(--color-charcoal);
          border: 1px solid rgba(248, 247, 243, 0.1);
          border-radius: 4px;
          box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.85);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .chandra-process__stage--active .chandra-process__media-frame {
          border-color: rgba(198, 161, 91, 0.4);
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(198, 161, 91, 0.12);
        }

        .chandra-process__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.92) contrast(1.04);
          transition: filter 0.35s ease, transform 0.5s var(--ease-cinematic);
        }

        .chandra-process__stage--active .chandra-process__image {
          filter: brightness(1.02) contrast(1.06);
          transform: scale(1.015);
        }

        .chandra-process__media-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.25) 0%,
            transparent 40%,
            rgba(7, 8, 7, 0.65) 100%
          );
          pointer-events: none;
        }

        .chandra-process__media-overlay {
          position: absolute;
          bottom: 14px;
          left: 16px;
          z-index: 2;
        }

        .chandra-process__overlay-badge {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          color: var(--color-gold);
          background-color: rgba(7, 8, 7, 0.8);
          border: 1px solid rgba(198, 161, 91, 0.3);
          padding: 4px 8px;
          border-radius: 2px;
          text-transform: uppercase;
        }

        /* ------------------------------------------------------------
           MOBILE VIEW (< 1024px)
           ------------------------------------------------------------ */
        .chandra-process__mobile-view {
          display: none;
          position: relative;
        }

        @media (max-width: 1023px) {
          .chandra-process__journey {
            display: none !important;
          }

          .chandra-process__mobile-view {
            display: block;
          }

          .chandra-process__mobile-rail {
            position: absolute;
            top: 16px;
            bottom: 24px;
            left: 12px;
            width: 1.5px;
            background-color: rgba(198, 161, 91, 0.25);
            z-index: 1;
          }

          .chandra-process__mobile-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 48px;
            position: relative;
            z-index: 2;
          }

          .chandra-process__mobile-step {
            display: flex;
            gap: 20px;
            opacity: 0.5;
            transition: opacity 0.3s ease;
          }

          .chandra-process__mobile-step.is-active {
            opacity: 1;
          }

          .chandra-process__mobile-node {
            flex-shrink: 0;
            width: 25px;
            display: flex;
            justify-content: center;
            padding-top: 6px;
          }

          .chandra-process__mobile-node-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background-color: var(--color-charcoal);
            border: 1.5px solid rgba(198, 161, 91, 0.5);
            transition: background-color 0.3s ease, border-color 0.3s ease;
          }

          .chandra-process__mobile-step.is-active .chandra-process__mobile-node-dot {
            background-color: var(--color-gold);
            border-color: var(--color-gold);
            box-shadow: 0 0 8px rgba(198, 161, 91, 0.6);
          }

          .chandra-process__mobile-body {
            display: flex;
            flex-direction: column;
            gap: 10px;
            flex: 1;
          }

          .chandra-process__mobile-head {
            display: flex;
            align-items: baseline;
            gap: 8px;
          }

          .chandra-process__mobile-num {
            font-family: var(--font-display-condensed);
            font-size: 28px;
            font-weight: 700;
            color: var(--color-gold);
            line-height: 1;
          }

          .chandra-process__mobile-divider {
            color: var(--color-muted-dark);
            font-size: 14px;
          }

          .chandra-process__mobile-title {
            font-family: var(--font-display);
            font-size: 18px;
            font-weight: 400;
            color: var(--color-white);
            text-transform: uppercase;
            margin: 0;
          }

          .chandra-process__mobile-desc {
            font-family: var(--font-body);
            font-size: 13.5px;
            line-height: 1.55;
            color: rgba(248, 247, 243, 0.85);
            margin: 0;
          }

          .chandra-process__mobile-figure {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
            margin: 8px 0 0 0;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid rgba(248, 247, 243, 0.1);
            background-color: var(--color-charcoal);
          }

          .chandra-process__mobile-img {
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
          .chandra-process__stage {
            opacity: 1 !important;
            transition: none !important;
          }
          .chandra-process__image {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};
