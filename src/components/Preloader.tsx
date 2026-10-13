'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  introTrackRef: React.RefObject<HTMLElement | null>;
  heroForegroundRef: React.RefObject<HTMLDivElement | null>;
}

export const Preloader: React.FC<PreloaderProps> = ({
  introTrackRef,
  heroForegroundRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);
  const maskPositionGroupRef = useRef<SVGGElement>(null);
  const maskScaleGroupRef = useRef<SVGGElement>(null);
  const brandGroupRef = useRef<HTMLDivElement>(null);
  const anniversaryRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = introTrackRef.current;
    const foreground = heroForegroundRef.current;
    const maskPositionGroup = maskPositionGroupRef.current;
    const maskScaleGroup = maskScaleGroupRef.current;
    const blackOverlay = blackOverlayRef.current;
    const brand = brandGroupRef.current;
    const anniversary = anniversaryRef.current;
    const particleLayer = particleLayerRef.current;
    const navigation = document.getElementById('chandra-navigation');

    if (!container || !track || !foreground || !maskPositionGroup || !maskScaleGroup || !blackOverlay || !brand || !anniversary || !particleLayer) {
      return;
    }

    const SYMBOL_CENTER_SHIFT = 367;
    const MASK_BASE_SIZE = 120;
    const MASK_HALF = MASK_BASE_SIZE / 2;

    let finalScale = 1;
    let resizeFrame = 0;
    let introCompleted = false;

    const calculateMaskGeometry = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const cx = width / 2;
      const cy = height / 2;

      maskPositionGroup.setAttribute('transform', `translate(${cx} ${cy})`);

      const sTL = Math.abs(cx) / MASK_HALF + Math.abs(cy) / MASK_HALF;
      const sTR = Math.abs(width - cx) / MASK_HALF + Math.abs(cy) / MASK_HALF;
      const sBL = Math.abs(cx) / MASK_HALF + Math.abs(height - cy) / MASK_HALF;
      const sBR = Math.abs(width - cx) / MASK_HALF + Math.abs(height - cy) / MASK_HALF;

      finalScale = Math.max(sTL, sTR, sBL, sBR) * 1.15;
    };

    calculateMaskGeometry();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const symbolShift = brand.querySelector('#logo-symbol-shift') as SVGGElement | null;
    const symbol = brand.querySelector('#logo-symbol') as SVGGElement | null;

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

    if (mediaQuery.matches) {
      maskScaleGroup.setAttribute('transform', `scale(${finalScale})`);
      gsap.set(blackOverlay, { opacity: 0 });
      gsap.set(brand, { opacity: 0 });
      gsap.set(anniversary, { opacity: 0, visibility: 'hidden' });
      gsap.set(foreground, { opacity: 1, y: 0, pointerEvents: 'auto' });

      if (navigation) {
        gsap.set(navigation, { opacity: 1, y: 0, pointerEvents: 'auto' });
      }

      container.style.display = 'none';
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);

    const restoreDocumentScroll = () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };

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
      const totalParticles = window.innerWidth < 768 ? 300 : 480;

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
          hasStroke && !hasFill ? 18 : 14,
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
          const delay = gsap.utils.random(0, 0.18);

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
                duration: 0.14,
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
                filter: 'blur(1.2px)',
                duration: gsap.utils.random(1.0, 1.35),
                ease: 'power1.out',
              },
              0.08
            );

          particleAnimations.push(particleTimeline);
          created += 1;
        }
      });
    };

    const ctx = gsap.context(() => {
      gsap.set(blackOverlay, { opacity: 1 });
      gsap.set(brand, { opacity: 1, scale: 1 });
      gsap.set(anniversary, { opacity: 0, y: 6, scale: 0.985, visibility: 'hidden' });
      gsap.set(maskScaleGroup, { attr: { transform: 'scale(1)' } });
      gsap.set(foreground, { opacity: 0, y: 12, pointerEvents: 'none' });

      if (navigation) {
        gsap.set(navigation, { opacity: 0, y: -6, pointerEvents: 'none' });
      }

      if (symbolShift) {
        gsap.set(symbolShift, { attr: { transform: `translate(${SYMBOL_CENTER_SHIFT} 0)` } });
      }

      if (symbol) {
        gsap.set(symbol, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%' });
      }

      if (letters.length) {
        gsap.set(letters, { opacity: 0, y: 8 });
      }

      const splashTimeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          introCompleted = true;
          clearParticles();
          gsap.set(foreground, { pointerEvents: 'auto' });

          if (navigation) {
            gsap.set(navigation, { pointerEvents: 'auto' });
          }

          gsap.set(container, { autoAlpha: 0 });
          container.style.display = 'none';
          restoreDocumentScroll();
        },
      });

      // Calm opening: diamond appears first.
      if (symbol) {
        splashTimeline.to(
          symbol,
          { opacity: 1, scale: 1, duration: 0.70, ease: 'power2.out' },
          0.15
        );
      }

      splashTimeline.to({}, { duration: 0.28 });
      splashTimeline.addLabel('symbolMove');

      // Move the diamond completely into its original left position BEFORE
      // any letters begin. This prevents the temporary symbol/wordmark overlap.
      if (symbolShift) {
        splashTimeline.to(
          symbolShift,
          {
            attr: { transform: 'translate(0 0)' },
            duration: 0.88,
            ease: 'power2.inOut',
          },
          'symbolMove'
        );
      }

      // Small breathing space after the diamond has fully settled.
      splashTimeline.to({}, { duration: 0.18 });
      splashTimeline.addLabel('lettersReveal');

      if (letters.length) {
        splashTimeline.to(
          letters,
          {
            opacity: 1,
            y: 0,
            duration: 0.40,
            stagger: 0.10,
            ease: 'power2.out',
          },
          'lettersReveal'
        );
      }

      // Let the completed CHANDRA signature sit calmly before dissolving.
      splashTimeline.to({}, { duration: 0.62 });
      splashTimeline.addLabel('particleDissolve');

      // The particles are sampled from the real SVG paths, so the logo appears
      // to physically break into its own tiny maroon/gold fragments.
      splashTimeline.call(spawnLogoParticles, [], 'particleDissolve');

      splashTimeline.to(
        brand,
        {
          opacity: 0,
          scale: 0.995,
          duration: 0.28,
          ease: 'power1.inOut',
        },
        'particleDissolve+=0.08'
      );

      // Give the real SVG fragments time to drift and fade completely.
      splashTimeline.to({}, { duration: 1.34 });
      splashTimeline.call(clearParticles);

      // Legacy splash — slower, quieter entrance and exit.
      splashTimeline.set(anniversary, { visibility: 'visible' });
      splashTimeline.to(
        anniversary,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: 'power2.out',
        }
      );
      splashTimeline.to({}, { duration: 1.15 });
      splashTimeline.to(
        anniversary,
        {
          opacity: 0,
          y: -4,
          duration: 0.62,
          ease: 'power1.inOut',
        }
      );
      splashTimeline.set(anniversary, { visibility: 'hidden' });

      // Bring the approved diamond back to the exact centre.
      splashTimeline.set(brand, { opacity: 1, scale: 1 });

      if (letters.length) {
        splashTimeline.set(letters, { opacity: 0, y: 0 });
      }

      if (symbolShift) {
        splashTimeline.set(symbolShift, {
          attr: { transform: `translate(${SYMBOL_CENTER_SHIFT} 0)` },
        });
      }

      if (symbol) {
        splashTimeline.set(symbol, { opacity: 0, scale: 0.96 });
        splashTimeline.to(
          symbol,
          {
            opacity: 1,
            scale: 1,
            duration: 0.68,
            ease: 'power2.out',
          }
        );
      }

      splashTimeline.to({}, { duration: 0.34 });
      splashTimeline.addLabel('heroReveal');

      // Existing diamond-to-Hero mask reveal, kept intact but slowed down.
      splashTimeline.to(
        blackOverlay,
        { opacity: 0, duration: 0.20, ease: 'power1.inOut' },
        'heroReveal'
      );

      if (symbol) {
        splashTimeline.to(
          symbol,
          { opacity: 0, duration: 0.20, ease: 'power1.inOut' },
          'heroReveal'
        );
      }

      splashTimeline.to(
        brand,
        { opacity: 0, duration: 0.16, ease: 'power1.inOut' },
        'heroReveal+=0.12'
      );

      splashTimeline.to(
        maskScaleGroup,
        {
          attr: { transform: () => `scale(${finalScale})` },
          duration: 1.32,
          ease: 'power2.inOut',
        },
        'heroReveal+=0.08'
      );

      splashTimeline.to(
        foreground,
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          ease: 'power2.out',
        },
        'heroReveal+=0.86'
      );

      if (navigation) {
        splashTimeline.to(
          navigation,
          {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: 'power2.out',
          },
          'heroReveal+=0.86'
        );
      }

      splashTimeline.to({}, { duration: 0.18 });

      const handleResize = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(calculateMaskGeometry);
      };

      window.addEventListener('resize', handleResize, { passive: true });

      (container as HTMLDivElement & { __chandraResizeCleanup?: () => void }).__chandraResizeCleanup = () => {
        cancelAnimationFrame(resizeFrame);
        window.removeEventListener('resize', handleResize);
      };
    }, container);

    return () => {
      const extendedContainer = container as HTMLDivElement & {
        __chandraResizeCleanup?: () => void;
      };

      extendedContainer.__chandraResizeCleanup?.();
      clearParticles();
      ctx.revert();

      if (!introCompleted) {
        restoreDocumentScroll();
      }
    };
  }, [introTrackRef, heroForegroundRef]);

  return (

    <div

      ref={containerRef}

      aria-hidden="true"

      className="chandra-preloader"

    >

      {/* ==========================================================

          HERO VIDEO REVEAL MASK

          ========================================================== */}



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

             * White keeps the black layer.

             */}

            <rect

              width="100%"

              height="100%"

              fill="white"

            />



            {/*

             * Position only.

             *

             * JS moves this origin to exact

             * viewport centre.

             */}

            <g

              ref={maskPositionGroupRef}

              transform="translate(0 0)"

            >

              {/*

               * Scale only.

               */}

              <g

                ref={maskScaleGroupRef}

                transform="scale(1)"

              >

                {/*

                 * Centre 120 × 120 mask

                 * around origin.

                 */}

                <g transform="translate(-60 -60)">

                  <svg

                    width="120"

                    height="120"

                    viewBox="0 0 352 352"

                    fill="black"

                  >

                    {/*

                     * EXACT APPROVED OUTER

                     * CHANDRA DIAMOND SHAPE.

                     */}

                    <path

                      d="M 174 0 L 176 1 L 184 1 L 194 4 L 204 10 L 338 142 L 346 153 L 351 167 L 351 183 L 350 184 L 350 188 L 343 203 L 245 303 L 207 341 L 200 346 L 187 351 L 166 351 L 159 349 L 147 342 L 9 205 L 1 188 L 1 184 L 0 183 L 1 166 L 5 155 L 12 145 L 146 10 L 159 3 L 166 1 L 173 1 Z"

                    />

                  </svg>

                </g>

              </g>

            </g>

          </mask>

        </defs>



        {/*

         * Black everywhere outside

         * the transparent diamond.

         */}

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

      {/* One-time legacy splash shown after the CHANDRA particle dissolve. */}
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



          <g

            id="logo-symbol-shift"

            transform="translate(367 0)"

          >

            <g

              id="logo-symbol"

              transform="translate(24 22) scale(0.6875)"

              style={{

                opacity: 0,

              }}

            >

              {/* Maroon diamond */}

              <path

                d="M 174 0 L 176 1 L 184 1 L 194 4 L 204 10 L 338 142 L 346 153 L 351 167 L 351 183 L 350 184 L 350 188 L 343 203 L 245 303 L 207 341 L 200 346 L 187 351 L 166 351 L 159 349 L 147 342 L 9 205 L 1 188 L 1 184 L 0 183 L 1 166 L 5 155 L 12 145 L 146 10 L 159 3 L 166 1 L 173 1 Z"

                fill="#700016"

                stroke="#C6A15B"

                strokeWidth="8"

              />



              {/* Inner gold accent */}

              <path

                d="M 175 4 L 176 5 L 184 5 L 193 8 L 201 13 L 209 20 L 337 147 L 343 156 L 347 169 L 347 182 L 344 192 L 339 201 L 223 319 L 205 337 L 194 344 L 184 347 L 168 347 L 155 342 L 149 338 L 13 203 L 8 195 L 5 186 L 5 180 L 4 179 L 5 167 L 13 150 L 149 13 L 157 8 L 166 5 L 174 5 Z"

                stroke="rgba(198,161,91,0.4)"

                strokeWidth="3"

                fill="none"

              />



              {/* Original internal symbol */}

              <path

                d="M 170 115 L 187 115 L 191 116 L 198 119 L 201 123 L 201 125 L 199 127 L 197 127 L 191 122 L 181 119 L 170 120 L 166 122 L 163 122 L 155 127 L 140 142 L 134 154 L 130 166 L 130 194 L 133 202 L 142 212 L 152 217 L 168 217 L 176 215 L 181 212 L 187 206 L 190 200 L 191 190 L 189 187 L 185 183 L 183 183 L 181 185 L 181 198 L 184 203 L 183 206 L 160 206 L 158 204 L 164 198 L 167 193 L 169 185 L 169 179 L 165 178 L 159 186 L 152 187 L 150 185 L 150 178 L 158 171 L 174 170 L 176 167 L 177 161 L 181 153 L 187 147 L 188 142 L 184 141 L 183 142 L 173 143 L 167 145 L 159 151 L 154 151 L 152 147 L 156 143 L 168 137 L 202 136 L 216 129 L 229 128 L 230 129 L 237 129 L 244 133 L 246 137 L 246 145 L 242 149 L 237 151 L 225 151 L 208 144 L 199 143 L 190 153 L 189 157 L 190 158 L 194 158 L 201 155 L 209 155 L 214 160 L 215 172 L 214 173 L 213 184 L 211 190 L 211 200 L 214 203 L 222 202 L 223 201 L 223 192 L 225 190 L 227 190 L 229 192 L 229 200 L 227 203 L 225 204 L 199 204 L 201 191 L 205 182 L 206 163 L 204 160 L 196 160 L 188 163 L 185 167 L 185 172 L 187 174 L 199 174 L 199 179 L 193 181 L 193 184 L 195 187 L 195 194 L 196 195 L 195 202 L 189 213 L 179 220 L 169 223 L 149 223 L 148 222 L 144 222 L 129 214 L 123 207 L 120 201 L 117 189 L 117 168 L 118 167 L 119 158 L 124 147 L 136 131 L 148 121 L 151 121 L 154 119 L 160 118 L 164 116 L 169 116 Z"

                fill="#C6A15B"

              />

            </g>

          </g>



          {/* ======================================================

              CHANDRA WORDMARK



              Every letter remains its ORIGINAL PATH.

              ====================================================== */}



          <g

            id="logo-wordmark"

            transform="translate(48 0)"

          >

            {/* C */}

            <g

              id="letter-c"

              style={{ opacity: 0 }}

            >

              <path

                d="M 321 80 L 315 83 L 307 89 L 303 94 L 298 105 L 296 115 L 296 127 L 298 138 L 303 152 L 309 162 L 316 170 L 329 180 L 331 180 L 333 182 L 348 187 L 365 186 L 366 183 L 366 179 L 370 168 L 371 163 L 362 163 L 356 162 L 350 160 L 341 155 L 333 147 L 331 144 L 327 135 L 326 130 L 326 116 L 327 112 L 329 109 L 335 104 L 340 102 L 369 102 L 368 95 L 366 91 L 366 87 L 364 84 L 364 80 L 363 78 L 328 78 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>



            {/* H */}

            <g

              id="letter-h"

              style={{ opacity: 0 }}

            >

              <path

                d="M 381 78 L 381 186 L 383 198 L 386 204 L 390 201 L 393 200 L 399 195 L 404 193 L 409 189 L 410 189 L 411 182 L 411 137 L 441 138 L 441 187 L 469 187 L 469 78 L 441 78 L 440 113 L 410 112 L 410 78 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>



            {/* A */}

            <g

              id="letter-a1"

              style={{ opacity: 0 }}

            >

              <path

                d="M 570 78 L 538 78 L 522 82 L 515 85 L 506 91 L 499 98 L 493 106 L 487 118 L 484 128 L 482 139 L 482 157 L 484 169 L 487 179 L 491 189 L 499 203 L 503 200 L 506 199 L 520 189 L 521 189 L 522 186 L 519 182 L 519 180 L 517 178 L 515 173 L 515 170 L 513 167 L 512 161 L 513 152 L 543 153 L 543 187 L 572 187 L 572 106 L 543 106 L 542 128 L 515 127 L 515 125 L 517 123 L 517 121 L 519 119 L 519 117 L 523 112 L 534 105 L 544 102 L 577 102 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>



            {/* N */}

            <g

              id="letter-n"

              style={{ opacity: 0 }}

            >

              <path

                d="M 591 78 L 591 187 L 620 187 L 621 119 L 631 132 L 651 155 L 651 187 L 679 187 L 679 78 L 651 78 L 650 114 L 638 101 L 634 95 L 619 78 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>



            {/* D */}

            <g

              id="letter-d"

              style={{ opacity: 0 }}

            >

              <path

                d="M 700 78 L 694 102 L 747 102 L 753 104 L 759 110 L 761 114 L 762 119 L 762 127 L 761 134 L 759 139 L 752 151 L 744 158 L 736 162 L 731 163 L 728 162 L 728 106 L 699 106 L 699 187 L 735 187 L 746 184 L 749 182 L 752 182 L 754 180 L 756 180 L 758 178 L 760 178 L 774 167 L 781 158 L 787 146 L 791 131 L 791 112 L 789 103 L 787 98 L 783 92 L 776 85 L 771 82 L 759 78 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>



            {/* R */}

            <g

              id="letter-r"

              style={{ opacity: 0 }}

            >

              <path

                d="M 805 79 L 804 82 L 804 86 L 800 97 L 799 102 L 854 102 L 856 103 L 860 107 L 860 111 L 856 118 L 850 124 L 845 128 L 841 130 L 834 136 L 833 106 L 804 106 L 804 187 L 833 187 L 834 136 L 838 143 L 839 147 L 841 149 L 841 151 L 843 153 L 843 155 L 852 171 L 859 182 L 874 202 L 877 204 L 883 200 L 886 197 L 898 189 L 899 189 L 900 187 L 895 180 L 893 179 L 891 175 L 882 164 L 869 142 L 870 139 L 873 138 L 877 135 L 884 128 L 889 121 L 892 112 L 892 101 L 891 96 L 886 87 L 880 82 L 870 78 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>



            {/* A */}

            <g

              id="letter-a2"

              style={{ opacity: 0 }}

            >

              <path

                d="M 988 78 L 955 78 L 945 80 L 933 85 L 924 91 L 915 100 L 910 107 L 904 120 L 901 131 L 900 138 L 900 158 L 901 166 L 903 170 L 903 174 L 910 192 L 917 203 L 925 198 L 931 193 L 940 188 L 939 185 L 936 181 L 930 164 L 929 156 L 930 152 L 961 153 L 961 187 L 990 187 L 990 106 L 961 106 L 960 128 L 932 127 L 938 115 L 944 109 L 954 104 L 962 102 L 994 102 L 994 99 L 990 88 L 990 84 L 988 80 Z"

                fill="#700016"

                fillRule="evenodd"

              />

            </g>

          </g>

        </svg>

      </div>



      <style jsx>{`

        .chandra-preloader {

          position: absolute;

          inset: 0;



          width: 100%;

          height: 100%;



          z-index: 900;



          overflow: hidden;



          pointer-events: none;

          user-select: none;

        }



        /*

         * HERO reveal layer.

         */

        .preloader-mask-svg {

          position: absolute;

          inset: 0;



          width: 100%;

          height: 100%;



          z-index: 2;



          overflow: visible;



          pointer-events: none;

        }



        /*

         * Full black screen that prevents

         * Hero footage appearing before

         * the diamond is centred.

         */

        .preloader-black-cover {

          position: absolute;

          inset: 0;



          z-index: 3;



          background: #070807;



          opacity: 1;



          pointer-events: none;

        }



        /*

         * Original horizontal logo container.

         *

         * IMPORTANT:

         * We are NOT moving this DOM element.

         *

         * Motion happens inside the SVG in

         * logo-symbol-shift so SVG proportions

         * remain identical.

         */

        .preloader-brand {

          position: absolute;



          top: 50%;

          left: 50%;



          transform:

            translate(-50%, -50%);



          z-index: 4;



          width: min(90vw, 560px);



          pointer-events: none;

        }



        .brand-svg {

          display: block;



          width: 100%;

          height: auto;



          overflow: visible;

        }



        .preloader-anniversary {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 1.4vh, 16px);
          text-align: center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .preloader-anniversary-number {
          display: block;
          font-family: var(--font-display-condensed);
          font-size: clamp(96px, 18vw, 220px);
          font-weight: 800;
          line-height: 0.78;
          letter-spacing: -0.045em;
          color: var(--color-white);
        }

        .preloader-anniversary-copy {
          display: block;
          font-family: var(--font-body);
          font-size: clamp(13px, 1.5vw, 20px);
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.22em;
          color: var(--color-gold);
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
          will-change: transform, opacity, filter;
        }

        @media (max-width: 767px) {

          .preloader-brand {

            width: min(92vw, 480px);

          }

          .preloader-anniversary-number {
            font-size: clamp(88px, 28vw, 150px);
          }

          .preloader-anniversary-copy {
            padding-left: 0.22em;
            font-size: 12px;
          }

        }

      `}</style>

    </div>

  );

};