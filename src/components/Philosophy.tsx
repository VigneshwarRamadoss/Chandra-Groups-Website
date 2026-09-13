'use client';

import React, { useEffect, useRef, useState } from 'react';
import { siteContent } from '@/content/siteContent';

export const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setProgress(1);
      setTextVisible(true);
      return;
    }

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

          // Trigger text reveal when section enters comfortable viewing range
          if (rect.top <= windowHeight * 0.85) {
            setTextVisible(true);
          }

          // Compute normalized scroll progress through this section (0.00 -> 1.00)
          // Starts transforming when section enters viewport, completes near bottom of section
          const startScroll = windowHeight * 0.8;
          const endScroll = -rect.height * 0.25;
          const currentPos = rect.top;

          const rawProgress = (startScroll - currentPos) / (startScroll - endScroll);
          const clampedProgress = Math.max(0, Math.min(1, rawProgress));

          setProgress(clampedProgress);

          // Update CSS custom property for high-performance direct rendering
          if (visualRef.current) {
            visualRef.current.style.setProperty('--scroll-progress', clampedProgress.toFixed(3));
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial evaluation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Micro words visibility based on progress
  const word1Opacity = Math.max(0, Math.min(1, (progress - 0.22) / 0.16));
  const word2Opacity = Math.max(0, Math.min(1, (progress - 0.40) / 0.16));
  const word3Opacity = Math.max(0, Math.min(1, (progress - 0.58) / 0.16));

  // Technical blueprint overlay fade (1.0 -> 0.0 by progress 0.42)
  // Individual marks inside are calibrated to 8-15% opacity
  const technicalOverlayFade = Math.max(0, 1 - progress * 2.38);

  // Atmosphere lighting activation (0% -> 55% between progress 0.25 and 0.85)
  const atmosphereOpacity = Math.max(0, Math.min(0.55, (progress - 0.22) * 0.85));

  // Final controlled stage light activation (activates between 0.65 -> 1.0)
  const stageLightOpacity = Math.max(0, Math.min(0.45, (progress - 0.65) * 1.28));

  // Image filter & transform interpolation
  const scale = (1.035 - progress * 0.035).toFixed(4);
  const translateY = ((progress - 0.5) * 32).toFixed(1);
  const brightness = (0.72 + progress * 0.30).toFixed(2);
  const saturate = (0.68 + progress * 0.47).toFixed(2);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      aria-label="CHANDRA Philosophy"
      className="philosophy-section"
    >
      <div className="philosophy-container">
        {/* Left Content Block: ~34% of width */}
        <div
          className={`philosophy-content ${textVisible ? 'is-visible' : ''}`}
        >
          {/* Eyebrow */}
          <div className="philosophy-eyebrow">
            <span>{siteContent.philosophy.eyebrow}</span>
            <div className="philosophy-rule" aria-hidden="true" />
          </div>

          {/* Primary Headline: Emotional Display Serif */}
          <h2 className="philosophy-headline">
            <span className="headline-line">{siteContent.philosophy.headlineLine1}</span>
            <span className="headline-line">{siteContent.philosophy.headlineLine2}</span>
          </h2>

          {/* Supporting Statement */}
          <p className="philosophy-subline">
            {siteContent.philosophy.subline}
          </p>

          {/* Body Copy */}
          <p className="philosophy-body">
            {siteContent.philosophy.body}
          </p>

          {/* CTA: SEE OUR APPROACH → */}
          <div className="philosophy-cta-wrapper">
            <a
              href="#approach"
              className="philosophy-cta-link"
              aria-label="See Our Approach to Experiences"
            >
              <span>{siteContent.philosophy.cta}</span>
            </a>
          </div>
        </div>

        {/* Right Visual: ~52% of width with intentional negative space */}
        <div className="philosophy-visual-col" ref={visualRef}>
          <div className="cinematic-frame">
            {/* Primary Backstage Production Image */}
            <div
              className="image-transform-wrapper"
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                filter: `brightness(${brightness}) saturate(${saturate}) contrast(1.06)`,
              }}
            >
              <img
                src="/media/philosophy-production.webp"
                alt="Chandra production specialist moving backstage through an illuminated corridor toward the live stage"
                loading="lazy"
                className="cinematic-img"
              />
            </div>

            {/* Inset Vignette to anchor deep blacks */}
            <div className="cinematic-vignette" aria-hidden="true" />

            {/* STATE 01 — INTENTION: Technical Production Blueprint Overlays */}
            <div
              className="technical-overlay"
              style={{ opacity: technicalOverlayFade }}
              aria-hidden="true"
            >
              {/* Corner Crop Marks */}
              <div className="crop-mark top-left" />
              <div className="crop-mark top-right" />
              <div className="crop-mark bottom-left" />
              <div className="crop-mark bottom-right" />

              {/* Faint Construction Grid Lines */}
              <div className="grid-line-h" style={{ top: '38%' }} />
              <div className="grid-line-h" style={{ top: '74%' }} />
              <div className="grid-line-v" style={{ left: '32%' }} />
              <div className="grid-line-v" style={{ left: '68%' }} />

              {/* Technical Reference Points & Crosshairs */}
              <div className="ref-crosshair" style={{ top: '38%', left: '32%' }}>
                <span>+</span>
                <span className="ref-tag">STG · GRID 01</span>
              </div>
              <div className="ref-crosshair" style={{ top: '74%', left: '68%' }}>
                <span>+</span>
                <span className="ref-tag">AXIS · Z 180</span>
              </div>

              {/* State 01 Micro Labels */}
              <span className="micro-label" style={{ top: '24px', left: '26px' }}>IDEA</span>
              <span className="micro-label" style={{ top: '24px', right: '26px' }}>SPACE</span>
              <span className="micro-label" style={{ bottom: '26px', left: '26px' }}>LIGHT</span>
              <span className="micro-label" style={{ bottom: '26px', right: '26px' }}>PEOPLE</span>
            </div>

            {/* STATE 02 — ATMOSPHERE: Warm Amber Practical Lighting Layer */}
            <div
              className="atmosphere-lighting"
              style={{ opacity: atmosphereOpacity }}
              aria-hidden="true"
            />

            {/* STATE 03 — IMPACT: Activated Stage Light at the Corridor Portal */}
            <div
              className="stage-light-activation"
              style={{ opacity: stageLightOpacity }}
              aria-hidden="true"
            />

            {/* Quiet Production Annotations: IDEAS, PEOPLE, EXPERIENCES (Revealed sequentially) */}
            <div className="production-annotations" aria-hidden="true">
              <div
                className="annotation-item"
                style={{
                  opacity: word1Opacity,
                  transform: `translateY(${(1 - word1Opacity) * 8}px)`,
                }}
              >
                <span className="annotation-marker" />
                <span className="annotation-text">IDEAS</span>
              </div>
              <div
                className="annotation-item"
                style={{
                  opacity: word2Opacity,
                  transform: `translateY(${(1 - word2Opacity) * 8}px)`,
                }}
              >
                <span className="annotation-marker" />
                <span className="annotation-text">PEOPLE</span>
              </div>
              <div
                className="annotation-item"
                style={{
                  opacity: word3Opacity,
                  transform: `translateY(${(1 - word3Opacity) * 8}px)`,
                }}
              >
                <span className="annotation-marker" />
                <span className="annotation-text">EXPERIENCES</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .philosophy-section {
          background-color: var(--color-ivory);
          color: var(--color-black);
          position: relative;
          min-height: clamp(750px, 115vh, 1050px);
          padding: clamp(72px, 8vh, 110px) var(--page-pad-x);
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .philosophy-container {
          width: 100%;
          max-width: var(--container-max);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 56px;
          align-items: center;
        }

        /* Desktop Asymmetric Split */
        @media (min-width: 992px) {
          .philosophy-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: clamp(48px, 6vw, 100px);
          }
        }

        /* Left Editorial Copy Block: ~35% of width */
        .philosophy-content {
          width: 100%;
          max-width: 500px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.75s var(--ease-cinematic), transform 0.75s var(--ease-cinematic);
        }

        .philosophy-content.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 992px) {
          .philosophy-content {
            flex: 0 0 35%;
            max-width: 480px;
          }
        }

        /* Eyebrow */
        .philosophy-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }

        .philosophy-eyebrow span {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-black);
          text-transform: uppercase;
        }

        .philosophy-rule {
          width: 36px;
          height: 1px;
          background-color: var(--color-gold);
          opacity: 0.85;
        }

        /* Primary Headline: Canela Serif — Exactly 2 Lines */
        .philosophy-headline {
          font-family: var(--font-serif);
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 400;
          line-height: 0.96;
          letter-spacing: -0.022em;
          color: var(--color-black);
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
        }

        .headline-line {
          display: block;
          white-space: nowrap;
        }

        /* Supporting Statement */
        .philosophy-subline {
          font-family: var(--font-body);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--color-black);
          text-transform: uppercase;
          margin: 0 0 20px 0;
        }

        /* Minimal Body Copy */
        .philosophy-body {
          font-family: var(--font-body);
          font-size: clamp(14.5px, 1.1vw, 16.5px);
          line-height: 1.65;
          color: var(--color-muted-light);
          margin: 0 0 32px 0;
          max-width: 440px;
        }

        /* CTA: SEE OUR APPROACH → */
        .philosophy-cta-wrapper {
          display: inline-block;
        }

        .philosophy-cta-link {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-body);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--color-black);
          text-decoration: none;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 6px;
          transition: color 0.3s ease;
        }

        .philosophy-cta-link::after {
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

        .philosophy-cta-link:hover::after {
          transform: scaleX(1);
          background-color: var(--color-black);
        }

        /* Right Visual Column: ~52% of width */
        .philosophy-visual-col {
          width: 100%;
          max-width: 580px;
        }

        @media (min-width: 992px) {
          .philosophy-visual-col {
            flex: 0 0 52%;
            max-width: 620px;
            /* Allow image to sit slightly higher than text block as requested */
            transform: translateY(-20px);
          }
        }

        /* Cinematic Vertical Frame */
        .cinematic-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background-color: var(--color-charcoal);
          border: 1px solid rgba(7, 8, 7, 0.08);
          box-shadow: 0 16px 40px -12px rgba(7, 8, 7, 0.07);
        }

        .image-transform-wrapper {
          position: absolute;
          inset: -4%;
          width: 108%;
          height: 108%;
          will-change: transform, filter;
          transition: filter 0.25s linear;
        }

        .cinematic-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
          display: block;
        }

        /* Inset Vignette */
        .cinematic-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 8, 7, 0.35) 0%,
            transparent 35%,
            rgba(7, 8, 7, 0.2) 65%,
            rgba(7, 8, 7, 0.55) 100%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* STATE 01 — INTENTION: Subtle Production Geometry */
        .technical-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          will-change: opacity;
          transition: opacity 0.2s linear;
        }

        /* Corner Crop Marks */
        .crop-mark {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: rgba(248, 247, 243, 0.45);
          border-style: solid;
        }

        .crop-mark.top-left {
          top: 18px;
          left: 18px;
          border-width: 1px 0 0 1px;
        }

        .crop-mark.top-right {
          top: 18px;
          right: 18px;
          border-width: 1px 1px 0 0;
        }

        .crop-mark.bottom-left {
          bottom: 18px;
          left: 18px;
          border-width: 0 0 1px 1px;
        }

        .crop-mark.bottom-right {
          bottom: 18px;
          right: 18px;
          border-width: 0 1px 1px 0;
        }

        /* Faint Construction Lines */
        .grid-line-h {
          position: absolute;
          left: 18px;
          right: 18px;
          height: 1px;
          background: repeating-linear-gradient(
            to right,
            rgba(248, 247, 243, 0.25) 0px,
            rgba(248, 247, 243, 0.25) 6px,
            transparent 6px,
            transparent 12px
          );
        }

        .grid-line-v {
          position: absolute;
          top: 18px;
          bottom: 18px;
          width: 1px;
          background: repeating-linear-gradient(
            to bottom,
            rgba(248, 247, 243, 0.25) 0px,
            rgba(248, 247, 243, 0.25) 6px,
            transparent 6px,
            transparent 12px
          );
        }

        /* Reference Crosshairs */
        .ref-crosshair {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(248, 247, 243, 0.45);
          font-family: var(--font-mono);
          font-size: 9px;
          transform: translate(-4px, -6px);
        }

        .ref-tag {
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        /* Micro Labels (State 01) */
        .micro-label {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.24em;
          color: rgba(248, 247, 243, 0.45);
          text-transform: uppercase;
        }

        /* STATE 02 — ATMOSPHERE: Warm Practical Light Radial Overlay */
        .atmosphere-lighting {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 48%,
            rgba(198, 161, 91, 0.38) 0%,
            rgba(216, 181, 115, 0.18) 45%,
            transparent 75%
          );
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 4;
          will-change: opacity;
          transition: opacity 0.25s linear;
        }

        /* STATE 03 — IMPACT: Subtly Activated Stage Light */
        .stage-light-activation {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 55% 50% at 50% 32%,
            rgba(255, 230, 180, 0.45) 0%,
            rgba(198, 161, 91, 0.2) 40%,
            transparent 75%
          );
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 5;
          will-change: opacity;
          transition: opacity 0.25s linear;
        }

        /* Quiet Production Annotations: IDEAS · PEOPLE · EXPERIENCES */
        .production-annotations {
          position: absolute;
          bottom: 36px;
          right: 32px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          z-index: 6;
          pointer-events: none;
        }

        .annotation-item {
          display: flex;
          align-items: center;
          gap: 8px;
          will-change: opacity, transform;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .annotation-marker {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--color-gold);
          box-shadow: 0 0 6px rgba(198, 161, 91, 0.6);
        }

        .annotation-text {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--color-white);
          text-transform: uppercase;
        }

        /* Mobile Adjustments */
        @media (max-width: 991px) {
          .philosophy-section {
            min-height: auto;
            padding: clamp(64px, 8vw, 90px) var(--page-pad-x);
          }

          .philosophy-visual-col {
            transform: none !important;
          }

          .cinematic-frame {
            aspect-ratio: 4 / 5;
          }
        }
      `}</style>
    </section>
  );
};
