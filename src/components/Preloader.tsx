'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  heroForegroundRef: React.RefObject<HTMLDivElement | null>;
}

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (
    callback: (...args: unknown[]) => void
  ) => number;
};

const DIAMOND_PATH =
  'M 174 0 L 176 1 L 184 1 L 194 4 L 204 10 L 338 142 L 346 153 L 351 167 L 351 183 L 350 184 L 350 188 L 343 203 L 245 303 L 207 341 L 200 346 L 187 351 L 166 351 L 159 349 L 147 342 L 9 205 L 1 188 L 1 184 L 0 183 L 1 166 L 5 155 L 12 145 L 146 10 L 159 3 L 166 1 L 173 1 Z';

export const Preloader: React.FC<PreloaderProps> = ({
  heroForegroundRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const bootCoverRef = useRef<HTMLDivElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);

  const anniversaryRef = useRef<HTMLDivElement>(null);

  const maskPositionGroupRef = useRef<SVGGElement>(null);
  const maskScaleGroupRef = useRef<SVGGElement>(null);

  const borderPositionGroupRef = useRef<SVGGElement>(null);
  const borderScaleGroupRef = useRef<SVGGElement>(null);
  const borderSvgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const foreground = heroForegroundRef.current;

    const bootCover = bootCoverRef.current;
    const blackOverlay = blackOverlayRef.current;

    const anniversary = anniversaryRef.current;

    const maskPositionGroup =
      maskPositionGroupRef.current;

    const maskScaleGroup =
      maskScaleGroupRef.current;

    const borderPositionGroup =
      borderPositionGroupRef.current;

    const borderScaleGroup =
      borderScaleGroupRef.current;

    const borderSvg =
      borderSvgRef.current;

    const navigation =
      document.getElementById(
        'chandra-navigation'
      );

    if (!container || !foreground || !maskPositionGroup || !maskScaleGroup || !blackOverlay || !brand || !anniversary || !particleLayer) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || window.location.hash || window.scrollY > 0) return;

    const SYMBOL_CENTER_SHIFT = 367;
    const MASK_BASE_SIZE = 120;
    const MASK_HALF = MASK_BASE_SIZE / 2;

    let finalScale = 1;
    let resizeFrame = 0;

    const calculateMaskGeometry = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const cx = width / 2;
      const cy = height / 2;

      /*
       * Mask and gold border always share
       * the exact same centre.
       */
      maskPositionGroup.setAttribute(
        'transform',
        `translate(${cx} ${cy})`
      );

      borderPositionGroup.setAttribute(
        'transform',
        `translate(${cx} ${cy})`
      );

      /*
       * Calculate enough scale for the
       * diamond to cover all four corners.
       */
      const sTL =
        Math.abs(cx) / MASK_HALF +
        Math.abs(cy) / MASK_HALF;

      const sTR =
        Math.abs(width - cx) /
          MASK_HALF +
        Math.abs(cy) / MASK_HALF;

      const sBL =
        Math.abs(cx) / MASK_HALF +
        Math.abs(height - cy) /
          MASK_HALF;

      const sBR =
        Math.abs(width - cx) /
          MASK_HALF +
        Math.abs(height - cy) /
          MASK_HALF;

      finalScale =
        Math.max(
          sTL,
          sTR,
          sBL,
          sBR
        ) * 1.15;
    };

    const symbolShift = brand.querySelector('#logo-symbol-shift') as SVGGElement | null;
    const symbol = brand.querySelector('#logo-symbol') as SVGGElement | null;

    if (!symbolShift || !symbol) return;

    const letters = [
      '#letter-c',
      '#letter-h',
      '#letter-a1',
      '#letter-n',
      '#letter-d',
      '#letter-r',
      '#letter-a2',
    ]
      .map((selector) => brand.querySelector(selector))
      .filter(Boolean) as SVGGElement[];

    const particleAnimations: gsap.core.Animation[] = [];

    const clearParticles = () => {
      particleAnimations.splice(0).forEach((animation) => animation.kill());
      particleLayer.replaceChildren();
    };

    /*
     * Build particles FROM the actual inline SVG geometry.
     *
     * Instead of scattering random dots inside each element's rectangle,
     * points are accepted only when they fall inside the real SVG fill or
     * stroke. This makes the CHANDRA mark visually break into its own pieces.
     */
    const spawnLogoParticles = () => {
      clearParticles();

      const containerRect = container.getBoundingClientRect();
      const brandRect = brand.getBoundingClientRect();
      const logoCenterX = brandRect.left - containerRect.left + brandRect.width / 2;
      const logoCenterY = brandRect.top - containerRect.top + brandRect.height / 2;

      const geometryPaths = Array.from(
        brand.querySelectorAll<SVGGeometryElement>(
          '#logo-symbol path, #logo-wordmark path'
        )
      );

      if (!geometryPaths.length) return;

      const pathWeights = geometryPaths.map((path) => {
        const rect = path.getBoundingClientRect();
        return Math.max(1, rect.width * rect.height);
      });

      const totalWeight = pathWeights.reduce((sum, weight) => sum + weight, 0);
      const totalParticles = window.innerWidth < 768 ? 72 : 120;

      geometryPaths.forEach((path, pathIndex) => {
        const bbox = path.getBBox();
        const screenMatrix = path.getScreenCTM();

        if (!screenMatrix || bbox.width <= 0 || bbox.height <= 0) return;

        const computed = window.getComputedStyle(path);
        const fillColor = computed.fill;
        const strokeColor = computed.stroke;
        const hasFill = fillColor !== 'none' && fillColor !== 'rgba(0, 0, 0, 0)';
        const hasStroke = strokeColor !== 'none' && strokeColor !== 'rgba(0, 0, 0, 0)';

        const targetCount = Math.max(
          hasStroke && !hasFill ? 5 : 3,
          Math.round((pathWeights[pathIndex] / totalWeight) * totalParticles)
        );

        let created = 0;
        let attempts = 0;
        const maxAttempts = targetCount * 40;

        while (created < targetCount && attempts < maxAttempts) {
          attempts += 1;

          const localX = bbox.x + Math.random() * bbox.width;
          const localY = bbox.y + Math.random() * bbox.height;
          const localPoint = new DOMPoint(localX, localY);

          let insideFill = false;
          let insideStroke = false;

          try {
            insideFill = hasFill && path.isPointInFill(localPoint);
            insideStroke = hasStroke && path.isPointInStroke(localPoint);
          } catch {
            continue;
          }

          if (!insideFill && !insideStroke) continue;

          const screenPoint = localPoint.matrixTransform(screenMatrix);
          const x = screenPoint.x - containerRect.left;
          const y = screenPoint.y - containerRect.top;

          const particle = document.createElement('span');
          particle.className = 'preloader-particle';

          const size = gsap.utils.random(1.2, 2.8, 0.1);
          const color = insideFill ? fillColor : strokeColor;

          particle.style.left = `${x}px`;
          particle.style.top = `${y}px`;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.backgroundColor = color;

          particleLayer.appendChild(particle);

          const fromCenterX = x - logoCenterX;
          const fromCenterY = y - logoCenterY;
          const distance = Math.hypot(fromCenterX, fromCenterY) || 1;
          const directionX = fromCenterX / distance;
          const directionY = fromCenterY / distance;

          // Slow, restrained drift — not an explosion.
          const travel = gsap.utils.random(10, 34);
          const driftX = directionX * travel + gsap.utils.random(-7, 7);
          const driftY = directionY * travel + gsap.utils.random(-7, 7);
          const delay = gsap.utils.random(0, 0.07);

          const particleTimeline = gsap.timeline({ delay });

          particleTimeline
            .fromTo(
              particle,
              {
                opacity: 0,
                scale: 0.8,
                x: 0,
                y: 0,
              },
              {
                opacity: gsap.utils.random(0.72, 1),
                scale: 1,
                duration: 0.10,
                ease: 'power1.out',
              }
            )
            .to(
              particle,
              {
                x: driftX,
                y: driftY,
                opacity: 0,
                scale: gsap.utils.random(0.25, 0.55),
                duration: gsap.utils.random(0.34, 0.52),
                ease: 'power1.out',
              },
              0.08
            );

          particleAnimations.push(particleTimeline);
          created += 1;
        }
      });
    };

    const root = document.documentElement;
    const content = navigation ? [foreground, navigation] : [foreground];
    let finished = false;

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(calculateMaskGeometry);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) finishIntro();
    };

    const finishIntro = () => {
      if (finished) return;
      finished = true;

      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(resizeFrame);
      clearParticles();
      ctx.revert();
      root.classList.remove('chandra-intro-active');
    };

    const ctx = gsap.context(() => {
      gsap.set(container, { display: 'block' });
      calculateMaskGeometry();
      gsap.set(content, { autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(foreground, { y: 10 });
      if (navigation) gsap.set(navigation, { y: -6 });

      gsap.set(symbol, { opacity: 0, scale: 0.94, transformOrigin: '50% 50%' });
      gsap.set(letters, { opacity: 0, y: 5 });

      const splash = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: finishIntro,
      });

      splash
        .to(symbol, { opacity: 1, scale: 1, duration: 0.26 }, 0)
        .to(symbolShift, {
          attr: { transform: 'translate(0 0)' },
          duration: 0.34,
          ease: 'power2.inOut',
        }, 0.22)
        .to(letters, { opacity: 1, y: 0, duration: 0.18, stagger: 0.025 }, 0.56)
        .addLabel('logoDissolve', '+=0.14')
        .call(spawnLogoParticles, [], 'logoDissolve')
        .to(brand, { opacity: 0, duration: 0.22 }, 'logoDissolve')
        .addLabel('anniversary', 'logoDissolve+=0.14')
        .fromTo(anniversary, { y: 5 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.22,
        }, 'anniversary')
        .to(anniversary, { autoAlpha: 0, y: -4, duration: 0.23 }, 'anniversary+=0.66')
        .addLabel('diamondReturn', 'anniversary+=0.76')
        .set(letters, { opacity: 0 }, 'diamondReturn')
        .set(symbolShift, {
          attr: { transform: `translate(${SYMBOL_CENTER_SHIFT} 0)` },
        }, 'diamondReturn')
        .set(brand, { opacity: 1 }, 'diamondReturn')
        .fromTo(symbol, { opacity: 0 }, { opacity: 1, duration: 0.17, immediateRender: false }, 'diamondReturn')
        .addLabel('heroReveal')
        .to(blackOverlay, { opacity: 0, duration: 0.16 }, 'heroReveal')
        .to(brand, { opacity: 0, duration: 0.20 }, 'heroReveal')
        .to(maskScaleGroup, {
          attr: { transform: () => `scale(${finalScale})` },
          duration: 0.55,
          ease: 'power2.inOut',
        }, 'heroReveal')
        .to(content, { autoAlpha: 1, y: 0, duration: 0.36 }, 'heroReveal+=0.22');
    }, container);

    root.classList.add('chandra-intro-active');
    window.addEventListener('resize', handleResize, { passive: true });
    mediaQuery.addEventListener('change', handleMotionChange);

    return finishIntro;
  }, [heroForegroundRef]);

  return (

    <div

      ref={containerRef}

      aria-hidden="true"
      hidden

      className="chandra-preloader"

    >

      {/* ==========================================================

          HERO VIDEO REVEAL MASK

          ========================================================== */}



      <svg

        className="preloader-mask-svg"

        aria-hidden="true"

      /*
       * CRITICAL FIRST-PAINT STYLES.
       *
       * These exist before React effects,
       * styled-jsx or video decoding.
       */
      style={{
        position: 'fixed',

        inset: 0,

        width: '100vw',
        height: '100dvh',

        zIndex: 900,

        overflow: 'hidden',

        background: 'transparent',

        pointerEvents: 'none',
      }}
    >
      {/* ===================================================
          FULL BLACK TRANSITION LAYER

          This is BELOW the mask.
          =================================================== */}

      <div
        ref={blackOverlayRef}
        className="preloader-black-cover"
      />

      {/* ===================================================
          HERO DIAMOND MASK

          Black outside.
          Transparent inside.
          =================================================== */}

      <svg
        className="preloader-mask-svg"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="chandra-emblem-mask"
            maskUnits="userSpaceOnUse"
          >
            {/*
              WHITE:
              black rectangle remains.
            */}
            <rect
              width="100%"
              height="100%"
              fill="white"
            />

            {/*
              BLACK:
              punches transparent hole.
            */}
            <g
              ref={maskPositionGroupRef}
              transform="translate(0 0)"
            >
              <g
                ref={maskScaleGroupRef}
                transform="scale(1)"
              >
                <g transform="translate(-60 -60)">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 352 352"
                    fill="black"
                  >
                    <path
                      d={DIAMOND_PATH}
                    />
                  </svg>
                </g>
              </g>
            </g>
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"

          fill="#070807"

          mask="url(#chandra-emblem-mask)"
        />
      </svg>



      {/* ==========================================================

          FULL BLACK INTRO COVER



          Prevents Hero footage appearing before

          the logo has returned to centre.

          ========================================================== */}



      <div

        ref={blackOverlayRef}

        className="preloader-black-cover"

      />

      {/* Anniversary message crossfades with the CHANDRA particle dissolve. */}
      <div
        ref={anniversaryRef}
        className="preloader-anniversary"
      >
        <span className="preloader-anniversary-number">75+</span>
        <span className="preloader-anniversary-copy">YEARS OF EXCELLENCE</span>
      </div>

      {/* Particle layer used only while the original inline SVG dissolves. */}
      <div
        ref={particleLayerRef}
        className="preloader-particles"
      />



      {/* ==========================================================

          ORIGINAL CHANDRA LOGO



          SAME PATHS.

          SAME COLORS.

          SAME PROPORTIONS.



          Only groups were separated so animation

          can control symbol + letters independently.

          ========================================================== */}



      <div

        ref={brandGroupRef}

        className="preloader-brand"

      >

        <svg

          xmlns="http://www.w3.org/2000/svg"

          viewBox="0 0 1024 286"

          fill="none"

          className="brand-svg"

        >

          {/* ======================================================

              DIAMOND SYMBOL

              ====================================================== */}

      <svg
        ref={borderSvgRef}

        className="preloader-diamond-border"

        aria-hidden="true"
      >
        <defs>
          <filter
            id="diamond-gold-glow"

            x="-100%"
            y="-100%"

            width="300%"
            height="300%"
          >
            <feGaussianBlur
              stdDeviation="1.8"

              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />

              <feMergeNode
                in="SourceGraphic"
              />
            </feMerge>
          </filter>
        </defs>

        <g
          ref={borderPositionGroupRef}

          transform="translate(0 0)"
        >
          <g
            ref={borderScaleGroupRef}

            transform="scale(1)"
          >
            <g transform="translate(-60 -60)">
              <svg
                width="120"
                height="120"

                viewBox="0 0 352 352"

                overflow="visible"
              >
                <path
                  d={DIAMOND_PATH}

                  fill="none"

                  stroke="#C6A15B"

                  strokeWidth="4"

                  vectorEffect="non-scaling-stroke"

                  filter="url(#diamond-gold-glow)"
                />
              </svg>
            </g>
          </g>
        </g>
      </svg>

      {/* ===================================================
          75+ YEARS OF EXCELLENCE
          =================================================== */}

      <div
        ref={anniversaryRef}

        className="preloader-anniversary"
      >
        <span className="anniversary-number">
          75+
        </span>

        <span className="anniversary-copy">
          YEARS OF EXCELLENCE
        </span>
      </div>

      {/* ===================================================
          FIRST-PAINT BOOT COVER

          INLINE BLACK means Hero/video cannot flash
          before React/GSAP starts.
          =================================================== */}

      <div
        ref={bootCoverRef}

        className="preloader-boot-cover"

        style={{
          position: 'absolute',

          inset: 0,

          width: '100%',
          height: '100%',

          zIndex: 7,

          background: '#070807',

          opacity: 1,

          pointerEvents: 'none',
        }}
      />

      <style jsx>{`

        :global(html) {
          scrollbar-gutter: stable;
        }

        :global(html.chandra-intro-active),
        :global(html.chandra-intro-active body) {
          overflow-y: hidden;
        }

        .chandra-preloader {
          user-select: none;

          background: transparent;
        }

        /*
         * Full black transition layer.
         *
         * IMPORTANT:
         * This sits BELOW the mask.
         */
        .preloader-black-cover {
          position: absolute;
          inset: 0;

          z-index: 2;

          width: 100%;
          height: 100%;

          background: #070807;

          opacity: 1;

          pointer-events: none;
        }

        /*
         * This layer creates:
         *
         * BLACK OUTSIDE
         * TRANSPARENT DIAMOND INSIDE
         *
         * Hero.tsx exists underneath
         * the entire preloader.
         */
        .preloader-mask-svg {
          position: absolute;
          inset: 0;

          z-index: 3;

          width: 100%;
          height: 100%;

          overflow: visible;

          pointer-events: none;
        }

        /*
         * CSS repeats only non-critical styling.
         *
         * Critical first-paint positioning is
         * already inline on the video itself.
         */
        .preloader-video {
          will-change: opacity;
        }

        /*
         * Gold outline sits above mask + video.
         */
        .preloader-diamond-border {
          position: absolute;
          inset: 0;

          z-index: 5;

          width: 100%;
          height: 100%;

          overflow: visible;

          opacity: 0;

          pointer-events: none;
        }

        /*
         * Anniversary is above everything except
         * the first-paint black cover.
         */
        .preloader-anniversary {
          position: absolute;
          inset: 0;

          z-index: 6;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: clamp(
            14px,
            2vh,
            24px
          );

          text-align: center;

          opacity: 0;
          visibility: hidden;

          pointer-events: none;
        }

        .anniversary-number {
          display: block;

          font-family:
            var(
              --font-display-condensed
            );

          font-size:
            clamp(
              120px,
              19vw,
              260px
            );

          font-weight: 900;

          line-height: 0.75;

          letter-spacing: -0.045em;

          color: #f3efe6;

          text-shadow:
            0 0 34px
              rgba(
                198,
                161,
                91,
                0.12
              );
        }

        .anniversary-copy {
          display: block;

          font-family:
            var(--font-body);

          font-size:
            clamp(
              15px,
              1.6vw,
              22px
            );

          font-weight: 700;

          line-height: 1;

          letter-spacing: 0.24em;

          color: #c6a15b;

          text-transform: uppercase;
        }

        .preloader-particles {
          position: absolute;
          inset: 0;
          z-index: 5;
          overflow: hidden;
          pointer-events: none;
        }

        :global(.preloader-particle) {
          position: absolute;
          border-radius: 999px;
          opacity: 0;
          transform: translate(-50%, -50%);
          pointer-events: none;
          will-change: transform, opacity;
        }

        @media (max-width: 767px) {
          .anniversary-number {
            font-size:
              clamp(
                96px,
                30vw,
                160px
              );
          }

          .anniversary-copy {
            padding-left: 0.24em;

            font-size: 12px;

            letter-spacing: 0.2em;
          }
        }
      `}</style>
    </div>
  );
};
