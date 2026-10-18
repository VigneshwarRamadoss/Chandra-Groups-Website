'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  introTrackRef: React.RefObject<HTMLElement | null>;
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
  introTrackRef,
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

  useEffect(() => {
    const container = containerRef.current;
    const preloaderVideo = videoRef.current;

    const track = introTrackRef.current;
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

    /*
     * Hero.tsx already owns this video.
     * We only make sure it is playing
     * before opening the diamond.
     */
    const heroVideo =
      document.querySelector<HTMLVideoElement>(
        '.hero-video'
      );

    if (
      !container ||
      !preloaderVideo ||
      !track ||
      !foreground ||
      !bootCover ||
      !blackOverlay ||
      !anniversary ||
      !maskPositionGroup ||
      !maskScaleGroup ||
      !borderPositionGroup ||
      !borderScaleGroup ||
      !borderSvg
    ) {
      return;
    }

    const MASK_SIZE = 120;
    const MASK_HALF = MASK_SIZE / 2;

    let finalScale = 1;
    let resizeFrame = 0;

    let introFinished = false;
    let playbackStarted = false;
    let firstFrameRevealed = false;

    /* =====================================================
       DIAMOND GEOMETRY
       ===================================================== */

    const calculateGeometry = () => {
      const width =
        container.clientWidth ||
        window.innerWidth;

      const height =
        container.clientHeight ||
        window.innerHeight;

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

    calculateGeometry();

    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const mediaQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );

    if (mediaQuery.matches) {
      maskScaleGroup.setAttribute(
        'transform',
        `scale(${finalScale})`
      );

      gsap.set(container, {
        display: 'none',
      });

      gsap.set(foreground, {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
      });

      if (navigation) {
        gsap.set(navigation, {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
        });
      }

      heroVideo
        ?.play()
        .catch(() => {});

      return;
    }

    /* =====================================================
       LOCK DOCUMENT WHILE INTRO RUNS
       ===================================================== */

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style
        .overflow;

    const previousScrollBehavior =
      document.documentElement.style
        .scrollBehavior;

    document.body.style.overflow =
      'hidden';

    document.documentElement.style.overflow =
      'hidden';

    document.documentElement.style.scrollBehavior =
      'auto';

    window.scrollTo(0, 0);

    const restoreScroll = () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      document.documentElement.style.scrollBehavior =
        previousScrollBehavior;
    };

    /* =====================================================
       INITIAL STATE
       ===================================================== */

    const ctx = gsap.context(() => {
      gsap.set(container, {
        opacity: 1,
        visibility: 'visible',
      });

      /*
       * Hard black on top from first frame.
       */
      gsap.set(bootCover, {
        opacity: 1,
      });

      /*
       * IMPORTANT:
       * Video remains invisible until its
       * first real decoded frame exists.
       */
      gsap.set(preloaderVideo, {
        opacity: 0,
        visibility: 'hidden',
      });

      /*
       * Full-screen black transition layer.
       */
      gsap.set(blackOverlay, {
        opacity: 1,
      });

      /*
       * 75+ hidden initially.
       */
      gsap.set(anniversary, {
        opacity: 0,
        y: 10,
        scale: 0.985,
        visibility: 'hidden',
      });

      /*
       * Small starting diamond.
       */
      gsap.set(maskScaleGroup, {
        attr: {
          transform: 'scale(1)',
        },
      });

      gsap.set(borderScaleGroup, {
        attr: {
          transform: 'scale(1)',
        },
      });

      gsap.set(borderSvg, {
        opacity: 0,
      });

      /*
       * Hero foreground stays hidden.
       */
      gsap.set(foreground, {
        opacity: 0,
        y: 12,
        pointerEvents: 'none',
      });

      if (navigation) {
        gsap.set(navigation, {
          opacity: 0,
          y: -6,
          pointerEvents: 'none',
        });
      }
    }, container);

    /* =====================================================
       FIRST VIDEO FRAME

       Fixes reload / bottom-up emergence.
       ===================================================== */

    const revealFirstVideoFrame = () => {
      if (firstFrameRevealed) {
        return;
      }

      firstFrameRevealed = true;

      const reveal = () => {
        /*
         * Video is already absolute fullscreen
         * before becoming visible.
         */
        gsap.set(preloaderVideo, {
          visibility: 'visible',
          opacity: 1,
        });

        /*
         * Wait for browser paint.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            gsap.to(bootCover, {
              opacity: 0,

              duration: 0.32,

              ease: 'power1.out',
            });
          });
        });
      };

      const videoWithCallback =
        preloaderVideo as VideoWithFrameCallback;

      /*
       * Best option:
       * wait for an actual decoded video frame.
       */
      if (
        typeof videoWithCallback
          .requestVideoFrameCallback ===
        'function'
      ) {
        videoWithCallback.requestVideoFrameCallback(
          () => {
            reveal();
          }
        );
      } else {
        /*
         * Safe fallback for older browsers.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(reveal);
        });
      }
    };

    /* =====================================================
       POST-VIDEO SEQUENCE
       ===================================================== */

    const startPostVideoSequence = () => {
      if (introFinished) {
        return;
      }

      introFinished = true;

      /*
       * Hero should already be loaded underneath,
       * but explicitly make sure it is playing
       * BEFORE opening the mask.
       */
      heroVideo
        ?.play()
        .catch(() => {});

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(foreground, {
            pointerEvents: 'auto',
          });

          if (navigation) {
            gsap.set(navigation, {
              pointerEvents: 'auto',
            });
          }

          container.style.display =
            'none';

          restoreScroll();
        },
      });

      /* =================================================
         1 — VIDEO ENDS ON BLACK
         ================================================= */

      /*
       * Short calm black beat.
       */
      tl.to({}, {
        duration: 0.18,
      });

      /* =================================================
         2 — 75+
         ================================================= */

      tl.set(anniversary, {
        visibility: 'visible',
      });

      tl.to(anniversary, {
        opacity: 1,

        y: 0,

        scale: 1,

        duration: 0.7,

        ease: 'power2.out',
      });

      /*
       * Hold statement.
       */
      tl.to({}, {
        duration: 1.6,
      });

      /* =================================================
         3 — 75+ FADES
         ================================================= */

      tl.to(anniversary, {
        opacity: 0,

        y: -6,

        duration: 0.65,

        ease: 'power1.inOut',
      });

      /*
       * Preloader video is already displaying
       * a black frame.
       *
       * Remove the video at the same time.
       */
      tl.to(
        preloaderVideo,
        {
          opacity: 0,

          duration: 0.35,

          ease: 'power1.inOut',
        },
        '<'
      );

      tl.set(anniversary, {
        visibility: 'hidden',
      });

      /* =================================================
         4 — GOLD DIAMOND APPEARS
         ================================================= */

      tl.to(borderSvg, {
        opacity: 1,

        duration: 0.38,

        ease: 'power2.out',
      });

      /*
       * Allow the outline to register.
       */
      tl.to({}, {
        duration: 0.2,
      });

      /* =================================================
         5 — HERO APPEARS INSIDE DIAMOND

         IMPORTANT LAYERING:

         Hero video
            ↓
         blackOverlay
            ↓
         mask SVG

         As blackOverlay disappears,
         mask SVG keeps everything black
         except its transparent diamond hole.
         ================================================= */

      tl.call(() => {
        heroVideo
          ?.play()
          .catch(() => {});
      });

      tl.to(blackOverlay, {
        opacity: 0,

        duration: 0.55,

        ease: 'power1.inOut',
      });

      /*
       * Small Hero-video diamond stays visible
       * before expansion.
       */
      tl.to({}, {
        duration: 0.38,
      });

      /* =================================================
         6 — EXPAND DIAMOND
         ================================================= */

      tl.to(maskScaleGroup, {
        attr: {
          transform: () =>
            `scale(${finalScale})`,
        },

        duration: 1.4,

        ease: 'power2.inOut',
      });

      /*
       * Gold outline follows exact same growth.
       */
      tl.to(
        borderScaleGroup,
        {
          attr: {
            transform: () =>
              `scale(${finalScale})`,
          },

          duration: 1.4,

          ease: 'power2.inOut',
        },
        '<'
      );

      /*
       * Fade border only near the end.
       */
      tl.to(
        borderSvg,
        {
          opacity: 0,

          duration: 0.5,

          ease: 'power1.out',
        },
        '-=0.5'
      );

      /* =================================================
         7 — HERO CONTENT
         ================================================= */

      tl.to(
        foreground,
        {
          opacity: 1,

          y: 0,

          duration: 0.62,

          ease: 'power2.out',
        },
        '-=0.42'
      );

      if (navigation) {
        tl.to(
          navigation,
          {
            opacity: 1,

            y: 0,

            duration: 0.62,

            ease: 'power2.out',
          },
          '<'
        );
      }

      tl.to({}, {
        duration: 0.12,
      });
    };

    /* =====================================================
       PRELOADER VIDEO PLAYBACK
       ===================================================== */

    const handlePlaying = () => {
      revealFirstVideoFrame();
    };

    const handleEnded = () => {
      /*
       * Do NOT seek.
       *
       * Keep exact final black frame.
       */
      preloaderVideo.pause();

      startPostVideoSequence();
    };

    preloaderVideo.addEventListener(
      'playing',
      handlePlaying
    );

    preloaderVideo.addEventListener(
      'ended',
      handleEnded
    );

    preloaderVideo.currentTime = 0;

    const startVideo = async () => {
      if (playbackStarted) {
        return;
      }

      playbackStarted = true;

      try {
        await preloaderVideo.play();
      } catch {
        /*
         * Never trap visitor behind black screen
         * if autoplay unexpectedly fails.
         */
        gsap.set(bootCover, {
          opacity: 0,
        });

        gsap.set(preloaderVideo, {
          opacity: 0,
          visibility: 'hidden',
        });

        startPostVideoSequence();
      }
    };

    if (preloaderVideo.readyState >= 3) {
      startVideo();
    } else {
      preloaderVideo.addEventListener(
        'canplay',
        startVideo,
        {
          once: true,
        }
      );
    }

    /* =====================================================
       RESIZE
       ===================================================== */

    const handleResize = () => {
      cancelAnimationFrame(
        resizeFrame
      );

      resizeFrame =
        requestAnimationFrame(() => {
          calculateGeometry();
        });
    };

    window.addEventListener(
      'resize',
      handleResize,
      {
        passive: true,
      }
    );

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      cancelAnimationFrame(
        resizeFrame
      );

      preloaderVideo.removeEventListener(
        'playing',
        handlePlaying
      );

      preloaderVideo.removeEventListener(
        'ended',
        handleEnded
      );

      preloaderVideo.removeEventListener(
        'canplay',
        startVideo
      );

      window.removeEventListener(
        'resize',
        handleResize
      );

      ctx.revert();

      restoreScroll();
    };
  }, [
    introTrackRef,
    heroForegroundRef,
  ]);

  return (
    <div
      ref={containerRef}
      className="chandra-preloader"
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

      {/* ===================================================
          PRELOADER VIDEO

          Inline positioning prevents the
          bottom-up reload jump.
          =================================================== */}

      <video
        ref={videoRef}

        muted
        playsInline
        preload="auto"

        className="preloader-video"

        style={{
          position: 'absolute',

          inset: 0,

          width: '100%',
          height: '100%',

          objectFit: 'cover',

          objectPosition:
            'center center',

          display: 'block',

          zIndex: 4,

          /*
           * Hidden on FIRST browser paint.
           *
           * JS reveals it only after the
           * first actual decoded frame.
           */
          opacity: 0,
          visibility: 'hidden',

          background: '#070807',

          pointerEvents: 'none',
        }}
      >
        <source
          src="/media/chandra_preloader.mp4"
          type="video/mp4"
        />
      </video>

      {/* ===================================================
          GOLD DIAMOND BORDER
          =================================================== */}

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

        .preloader-boot-cover {
          will-change: opacity;
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