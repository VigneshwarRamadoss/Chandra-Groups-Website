'use client';

import React, {
  useLayoutEffect,
  useRef,
} from 'react';

import gsap from 'gsap';

interface PreloaderProps {
  heroForegroundRef: React.RefObject<HTMLDivElement | null>;
}

/* ============================================================
   SHARED DIAMOND
   Used by both the Hero mask and gold border.
   ============================================================ */

const DIAMOND_PATH =
  'M 174 0 L 176 1 L 184 1 L 194 4 L 204 10 L 338 142 L 346 153 L 351 167 L 351 183 L 350 184 L 350 188 L 343 203 L 245 303 L 207 341 L 200 346 L 187 351 L 166 351 L 159 349 L 147 342 L 9 205 L 1 188 L 1 184 L 0 183 L 1 166 L 5 155 L 12 145 L 146 10 L 159 3 L 166 1 L 173 1 Z';

const LOGO_SVG =
  '/media/chandra-preloader-logo.svg';

/*
 * Both mask and gold border start
 * at exactly this size.
 */
const REVEAL_SIZE = 120;

const LOGO_VIEWBOX_WIDTH = 1122;
const LOGO_VIEWBOX_HEIGHT = 1428;

export const Preloader: React.FC<PreloaderProps> = ({
  heroForegroundRef,
}) => {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const blackOverlayRef =
    useRef<HTMLDivElement>(null);

  const logoStageRef =
    useRef<HTMLDivElement>(null);

  const logoSvgRef =
    useRef<SVGSVGElement>(null);

  const logoSymbolRef =
    useRef<SVGGElement>(null);

  const logoWordingRef =
    useRef<SVGGElement>(null);

  /* HERO MASK */

  const maskPositionGroupRef =
    useRef<SVGGElement>(null);

  const maskScaleGroupRef =
    useRef<SVGGElement>(null);

  /* GOLD BORDER */

  const borderPositionGroupRef =
    useRef<SVGGElement>(null);

  const borderScaleGroupRef =
    useRef<SVGGElement>(null);

  const borderSvgRef =
    useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const container =
      containerRef.current;

    const foreground =
      heroForegroundRef.current;

    const blackOverlay =
      blackOverlayRef.current;

    const logoStage =
      logoStageRef.current;

    const logoSvg =
      logoSvgRef.current;

    const logoSymbol =
      logoSymbolRef.current;

    const logoWording =
      logoWordingRef.current;

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

    if (
      !container ||
      !foreground ||
      !blackOverlay ||
      !logoStage ||
      !logoSvg ||
      !logoSymbol ||
      !logoWording ||
      !maskPositionGroup ||
      !maskScaleGroup ||
      !borderPositionGroup ||
      !borderScaleGroup ||
      !borderSvg
    ) {
      return;
    }

    const content =
      navigation
        ? [foreground, navigation]
        : [foreground];

    const mediaQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );

    /* ============================================================
       SKIP PRELOADER
       ============================================================ */

    if (
      mediaQuery.matches ||
      window.location.hash ||
      window.scrollY > 0
    ) {
      gsap.set(content, {
        autoAlpha: 1,
        y: 0,
        pointerEvents: 'auto',
      });

      container.style.display =
        'none';

      return;
    }

    const root =
      document.documentElement;

    root.classList.add(
      'chandra-intro-active'
    );

    let finalScale = 1;

    let logoTargetX = 0;
    let logoTargetY = 0;
    let logoTargetScale = 1;

    let resizeFrame = 0;
    let finished = false;

    /* ============================================================
       SYMBOL LOCAL GEOMETRY
       ============================================================ */

    const symbolBBox =
      logoSymbol.getBBox();

    const symbolCenterX =
      symbolBBox.x +
      symbolBBox.width / 2;

    const symbolCenterY =
      symbolBBox.y +
      symbolBBox.height / 2;

    const symbolOrigin =
      `${symbolCenterX} ${symbolCenterY}`;

    /* ============================================================
       CALCULATE MASK + GOLD BORDER
       ============================================================ */

    const calculateMaskGeometry =
      () => {
        const width =
          container.clientWidth ||
          window.innerWidth;

        const height =
          container.clientHeight ||
          window.innerHeight;

        const cx =
          width / 2;

        const cy =
          height / 2;

        /*
         * Mask + border always share
         * exact screen centre.
         */

        maskPositionGroup.setAttribute(
          'transform',
          `translate(${cx} ${cy})`
        );

        borderPositionGroup.setAttribute(
          'transform',
          `translate(${cx} ${cy})`
        );

        const maskHalf =
          REVEAL_SIZE / 2;

        const sTL =
          Math.abs(cx) /
            maskHalf +
          Math.abs(cy) /
            maskHalf;

        const sTR =
          Math.abs(
            width - cx
          ) /
            maskHalf +
          Math.abs(cy) /
            maskHalf;

        const sBL =
          Math.abs(cx) /
            maskHalf +
          Math.abs(
            height - cy
          ) /
            maskHalf;

        const sBR =
          Math.abs(
            width - cx
          ) /
            maskHalf +
          Math.abs(
            height - cy
          ) /
            maskHalf;

        finalScale =
          Math.max(
            sTL,
            sTR,
            sBL,
            sBR
          ) * 1.15;
      };

    /* ============================================================
       LOGO → BORDER EXACT MATCH
       ============================================================ */

    const calculateLogoMatch =
      () => {
        const svgRect =
          logoSvg.getBoundingClientRect();

        if (
          svgRect.width <= 0 ||
          symbolBBox.width <= 0 ||
          symbolBBox.height <= 0
        ) {
          return;
        }

        /*
         * Convert CSS pixel target
         * into SVG units.
         */

        const unitsPerPixel =
          LOGO_VIEWBOX_WIDTH /
          svgRect.width;

        const targetSizeInSvgUnits =
          REVEAL_SIZE *
          unitsPerPixel;

        /*
         * Fit actual symbol inside
         * exact 120 × 120 reveal.
         */

        logoTargetScale =
          targetSizeInSvgUnits /
          Math.max(
            symbolBBox.width,
            symbolBBox.height
          );

        /*
         * Root SVG is centred.
         */

        const targetCenterX =
          LOGO_VIEWBOX_WIDTH / 2;

        const targetCenterY =
          LOGO_VIEWBOX_HEIGHT / 2;

        logoTargetX =
          targetCenterX -
          symbolCenterX;

        logoTargetY =
          targetCenterY -
          symbolCenterY;
      };

    calculateMaskGeometry();
    calculateLogoMatch();

    /* ============================================================
       CLEANUP
       ============================================================ */

    let ctx: gsap.Context;

    const handleResize =
      () => {
        cancelAnimationFrame(
          resizeFrame
        );

        resizeFrame =
          requestAnimationFrame(
            () => {
              calculateMaskGeometry();
              calculateLogoMatch();
            }
          );
      };

    const finishIntro =
      () => {
        if (finished) return;

        finished = true;

        window.removeEventListener(
          'resize',
          handleResize
        );

        mediaQuery.removeEventListener(
          'change',
          handleMotionChange
        );

        cancelAnimationFrame(
          resizeFrame
        );

        root.classList.remove(
          'chandra-intro-active'
        );

        gsap.set(content, {
          autoAlpha: 1,
          y: 0,
          pointerEvents: 'auto',
        });

        container.style.display =
          'none';
      };

    const handleMotionChange = (
      event: MediaQueryListEvent
    ) => {
      if (event.matches) {
        finishIntro();
      }
    };

    /* ============================================================
       GSAP
       ============================================================ */

    ctx = gsap.context(
      () => {
        /* HERO */

        gsap.set(content, {
          autoAlpha: 0,
          pointerEvents: 'none',
        });

        gsap.set(
          foreground,
          {
            y: 10,
          }
        );

        if (navigation) {
          gsap.set(
            navigation,
            {
              y: -6,
            }
          );
        }

        /* BLACK */

        gsap.set(
          blackOverlay,
          {
            opacity: 1,
          }
        );

        /* LOGO */

        gsap.set(
          logoStage,
          {
            autoAlpha: 1,
          }
        );

        gsap.set(
          logoSymbol,
          {
            autoAlpha: 0,

            x: 0,
            y: 0,

            scale: 0.92,

            svgOrigin:
              symbolOrigin,
          }
        );

        /* WORDING */

        gsap.set(
          logoWording,
          {
            autoAlpha: 0,

            y: 10,
          }
        );

        /* MASK */

        gsap.set(
          maskScaleGroup,
          {
            attr: {
              transform:
                'scale(1)',
            },
          }
        );

        /* GOLD BORDER */

        gsap.set(
          borderScaleGroup,
          {
            attr: {
              transform:
                'scale(1)',
            },
          }
        );

        gsap.set(
          borderSvg,
          {
            autoAlpha: 0,
          }
        );

        /* ========================================================
           MAIN SEQUENCE — SLOWER VERSION
           ======================================================== */

        const splash =
          gsap.timeline({
            defaults: {
              ease:
                'power2.out',
            },

            onComplete:
              finishIntro,
          });

        /* ========================================================
           01 — SYMBOL APPEARS
           ======================================================== */

        splash.to(
          logoSymbol,
          {
            autoAlpha: 1,

            scale: 1,

            duration: 1.1,

            ease:
              'power3.out',
          },
          0.15
        );

        /*
         * Hold symbol alone.
         */

        splash.to(
          {},
          {
            duration: 0.45,
          }
        );

        /* ========================================================
           02 — WORDING APPEARS
           ======================================================== */

        splash.to(
          logoWording,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.85,

            ease:
              'power2.out',
          }
        );

        /*
         * Keep full identity visible.
         */

        splash.to(
          {},
          {
            duration: 1.35,
          }
        );

        /* ========================================================
           03 — WORDING DISAPPEARS
           ======================================================== */

        splash.to(
          logoWording,
          {
            autoAlpha: 0,

            y: -8,

            duration: 0.65,

            ease:
              'power2.inOut',
          }
        );

        /* ========================================================
           04 — SYMBOL CENTRES + SHRINKS
           ======================================================== */

        splash.to(
          logoSymbol,
          {
            x: () =>
              logoTargetX,

            y: () =>
              logoTargetY,

            scale: () =>
              logoTargetScale,

            duration: 1.25,

            ease:
              'power3.inOut',
          },
          '-=0.02'
        );

        /*
         * Pause once logo reaches
         * exact mask size.
         */

        splash.to(
          {},
          {
            duration: 0.35,
          }
        );

        /* ========================================================
           05 — GOLD BORDER APPEARS
           ======================================================== */

        splash.to(
          borderSvg,
          {
            autoAlpha: 1,

            duration: 0.45,

            ease:
              'power2.out',
          }
        );

        /* ========================================================
           06 — SOLID LOGO FADES
           ======================================================== */

        splash.to(
          logoSymbol,
          {
            autoAlpha: 0,

            duration: 0.5,

            ease:
              'power2.inOut',
          },
          '-=0.06'
        );

        splash.set(
          logoStage,
          {
            autoAlpha: 0,
          }
        );

        /*
         * Let the gold border sit alone.
         */

        splash.to(
          {},
          {
            duration: 0.4,
          }
        );

        /* ========================================================
           07 — HERO APPEARS INSIDE DIAMOND
           ======================================================== */

        splash.addLabel(
          'heroReveal'
        );

        splash.to(
          blackOverlay,
          {
            opacity: 0,

            duration: 0.5,

            ease:
              'power1.inOut',
          },
          'heroReveal'
        );

        /* ========================================================
           08 — DIAMOND EXPANDS FULLSCREEN
           ======================================================== */

        splash.to(
          maskScaleGroup,
          {
            attr: {
              transform:
                () =>
                  `scale(${finalScale})`,
            },

            duration: 1.65,

            ease:
              'power3.inOut',
          },
          'heroReveal+=0.15'
        );

        splash.to(
          borderScaleGroup,
          {
            attr: {
              transform:
                () =>
                  `scale(${finalScale})`,
            },

            duration: 1.65,

            ease:
              'power3.inOut',
          },
          'heroReveal+=0.15'
        );

        /* ========================================================
           BORDER FADES DURING EXPANSION
           ======================================================== */

        splash.to(
          borderSvg,
          {
            autoAlpha: 0,

            duration: 0.5,

            ease:
              'power1.out',
          },
          'heroReveal+=1.02'
        );

        /* ========================================================
           HERO COPY + NAVIGATION
           ======================================================== */

        splash.to(
          content,
          {
            autoAlpha: 1,

            y: 0,

            duration: 0.7,

            ease:
              'power2.out',
          },
          'heroReveal+=0.95'
        );
      },
      container
    );

    /* ============================================================
       EVENTS
       ============================================================ */

    window.addEventListener(
      'resize',
      handleResize,
      {
        passive: true,
      }
    );

    mediaQuery.addEventListener(
      'change',
      handleMotionChange
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize
      );

      mediaQuery.removeEventListener(
        'change',
        handleMotionChange
      );

      cancelAnimationFrame(
        resizeFrame
      );

      root.classList.remove(
        'chandra-intro-active'
      );

      if (ctx) {
        ctx.revert();
      }
    };
  }, [heroForegroundRef]);

  /* ============================================================
     JSX
     ============================================================ */

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="chandra-preloader"
    >
      {/* ======================================================
          BLACK INTRO
          ====================================================== */}

      <div
        ref={
          blackOverlayRef
        }
        className="preloader-black-cover"
      />

      {/* ======================================================
          HERO MASK
          ====================================================== */}

      <svg
        className="preloader-mask-svg"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="chandra-emblem-mask"
            maskUnits="userSpaceOnUse"
          >
            <rect
              width="100%"
              height="100%"
              fill="white"
            />

            <g
              ref={
                maskPositionGroupRef
              }
              transform="translate(0 0)"
            >
              <g
                ref={
                  maskScaleGroupRef
                }
                transform="scale(1)"
              >
                <g
                  transform={`translate(${
                    -REVEAL_SIZE / 2
                  } ${
                    -REVEAL_SIZE / 2
                  })`}
                >
                  <svg
                    width={
                      REVEAL_SIZE
                    }
                    height={
                      REVEAL_SIZE
                    }
                    viewBox="0 0 352 352"
                    fill="black"
                  >
                    <path
                      d={
                        DIAMOND_PATH
                      }
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

      {/* ======================================================
          GOLD BORDER
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
              stdDeviation="1.7"
              result="blur"
            />

            <feMerge>
              <feMergeNode
                in="blur"
              />

              <feMergeNode
                in="SourceGraphic"
              />
            </feMerge>
          </filter>

          <linearGradient
            id="preloader-border-gold"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#FFF0A3"
            />

            <stop
              offset="28%"
              stopColor="#E4BD65"
            />

            <stop
              offset="60%"
              stopColor="#C7963F"
            />

            <stop
              offset="100%"
              stopColor="#F0CE79"
            />
          </linearGradient>
        </defs>

        <g
          ref={
            borderPositionGroupRef
          }
          transform="translate(0 0)"
        >
          <g
            ref={
              borderScaleGroupRef
            }
            transform="scale(1)"
          >
            <g
              transform={`translate(${
                -REVEAL_SIZE / 2
              } ${
                -REVEAL_SIZE / 2
              })`}
            >
              <svg
                width={
                  REVEAL_SIZE
                }
                height={
                  REVEAL_SIZE
                }
                viewBox="0 0 352 352"
                overflow="visible"
              >
                <path
                  d={
                    DIAMOND_PATH
                  }
                  fill="none"
                  stroke="url(#preloader-border-gold)"
                  strokeWidth="4"
                  vectorEffect="non-scaling-stroke"
                  filter="url(#diamond-gold-glow)"
                />
              </svg>
            </g>
          </g>
        </g>
      </svg>

      {/* ======================================================
          CHANDRA LOGO
          ====================================================== */}

      <div
        ref={logoStageRef}
        className="preloader-logo-stage"
      >
        <svg
          ref={logoSvgRef}
          className="preloader-logo-svg"
          viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SYMBOL */}

          <g
            ref={logoSymbolRef}
            id="preloader-logo-symbol"
          >
            <use
              href={`${LOGO_SVG}#logo-symbol`}
            />
          </g>

          {/* WORDING */}

          <g
            ref={logoWordingRef}
            id="preloader-logo-wording"
          >
            <use
              href={`${LOGO_SVG}#logo-wording`}
            />
          </g>
        </svg>
      </div>

      <style jsx>{`
        :global(html) {
          scrollbar-gutter:
            stable;
        }

        :global(
          html.chandra-intro-active
        ),
        :global(
          html.chandra-intro-active
            body
        ) {
          overflow:
            hidden;
        }

        /* ====================================================
           ROOT
           ==================================================== */

        .chandra-preloader {
          position:
            fixed;

          inset: 0;

          z-index: 900;

          width: 100vw;

          height: 100vh;
          height: 100dvh;

          overflow:
            hidden;

          background:
            transparent;

          pointer-events:
            none;

          user-select:
            none;
        }

        /* ====================================================
           BLACK
           ==================================================== */

        .preloader-black-cover {
          position:
            absolute;

          inset: 0;

          z-index: 2;

          background:
            #070807;

          opacity: 1;

          pointer-events:
            none;
        }

        /* ====================================================
           MASK
           ==================================================== */

        .preloader-mask-svg {
          position:
            absolute;

          inset: 0;

          z-index: 3;

          width: 100%;
          height: 100%;

          overflow:
            visible;

          pointer-events:
            none;
        }

        /* ====================================================
           INITIAL LOGO
           ==================================================== */

        .preloader-logo-stage {
          position:
            absolute;

          top: 50%;
          left: 50%;

          z-index: 4;

          width:
            min(
              46vw,
              320px
            );

          transform:
            translate(
              -50%,
              -50%
            );

          pointer-events:
            none;
        }

        .preloader-logo-svg {
          display:
            block;

          width: 100%;
          height: auto;

          overflow:
            visible;
        }

        /* ====================================================
           GOLD BORDER
           ==================================================== */

        .preloader-diamond-border {
          position:
            absolute;

          inset: 0;

          z-index: 5;

          width: 100%;
          height: 100%;

          overflow:
            visible;

          opacity: 0;

          pointer-events:
            none;
        }

        /* ====================================================
           MOBILE
           ==================================================== */

        @media (
          max-width: 767px
        ) {
          .preloader-logo-stage {
            width:
              min(
                64vw,
                280px
              );
          }
        }

        /* ====================================================
           SHORT SCREEN
           ==================================================== */

        @media (
          max-height: 700px
        ) and (
          min-width: 768px
        ) {
          .preloader-logo-stage {
            width:
              min(
                42vw,
                290px
              );
          }
        }

        /* ====================================================
           REDUCED MOTION
           ==================================================== */

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .preloader-logo-stage,
          .preloader-diamond-border {
            transition:
              none !important;
          }
        }
      `}</style>
    </div>
  );
};