'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '@/content/siteContent';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const introTitleRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const introTitle = introTitleRef.current;
    const visual = visualRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (
      !section ||
      !introTitle ||
      !visual ||
      !image ||
      !content
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    /*
     * ============================================================
     * REDUCED MOTION
     * ============================================================
     */
    if (reducedMotion.matches) {
      gsap.set(introTitle, {
        opacity: 0,
      });

      gsap.set(visual, {
        left: '42%',
        top: '0%',
        xPercent: 0,
        yPercent: 0,
        scale: 1,
      });

      gsap.set(content, {
        opacity: 1,
        x: 0,
        pointerEvents: 'auto',
      });

      gsap.set(image, {
        scale: 1,
      });

      return;
    }

    const ctx = gsap.context(() => {
      /*
       * ============================================================
       * INITIAL STATE
       * ============================================================
       *
       * IMPORTANT:
       *
       * The image container ALREADY has its final aspect ratio:
       *
       * 58% viewport width
       * 100svh height
       *
       * We only SCALE it down.
       *
       * Therefore:
       *
       * rectangle → rectangle
       *
       * NOT:
       *
       * rectangle → square → full-height rectangle
       */

      gsap.set(introTitle, {
        opacity: 1,
      });

      gsap.set(visual, {
        left: '50%',
        top: '56%',

        xPercent: -50,
        yPercent: -50,

        scale: 0.58,
      });

      gsap.set(image, {
        scale: 1.04,
      });

      /*
       * Final copy hidden initially.
       */
      gsap.set(content, {
        opacity: 0,
        x: -28,
        pointerEvents: 'none',
      });

      /*
       * ============================================================
       * SCROLL TIMELINE
       * ============================================================
       */

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none',
        },

        scrollTrigger: {
          trigger: section,

          start: 'top top',
          end: 'bottom bottom',

          scrub: 0.45,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            content.style.pointerEvents =
              self.progress >= 0.65
                ? 'auto'
                : 'none';
          },
        },
      });

      /*
       * ============================================================
       * 0.00 → 0.18
       *
       * HOLD
       *
       * Large OUR PHILOSOPHY stays clearly visible.
       * ============================================================
       */

      timeline.to(
        {},
        {
          duration: 0.18,
        }
      );

      /*
       * ============================================================
       * 0.18 → 0.36
       *
       * OUR PHILOSOPHY fades IN PLACE.
       *
       * NO Y MOVEMENT.
       * NO SLIDING BEHIND NAVBAR.
       * ============================================================
       */

      timeline.to(
        introTitle,
        {
          opacity: 0,
          duration: 0.18,
          ease: 'none',
        },
        0.18
      );

      /*
       * Image begins coming toward the viewer.
       *
       * Same aspect ratio.
       */
      timeline.to(
        visual,
        {
          scale: 0.68,
          duration: 0.18,
          ease: 'power1.inOut',
        },
        0.18
      );

      /*
       * ============================================================
       * 0.30 → 0.68
       *
       * IMAGE EXPANDS + MOVES TO RIGHT.
       *
       * Because its actual width/height never change,
       * there is NO shape morph.
       * ============================================================
       */

      timeline.to(
        visual,
        {
          left: '42%',
          top: '0%',

          xPercent: 0,
          yPercent: 0,

          scale: 1,

          duration: 0.38,

          ease: 'power2.inOut',
        },
        0.30
      );

      /*
       * Internal image settles as container expands.
       */
      timeline.to(
        image,
        {
          scale: 1,
          duration: 0.38,
          ease: 'power2.inOut',
        },
        0.30
      );

      /*
       * ============================================================
       * 0.54 → 0.80
       *
       * LEFT PHILOSOPHY COPY ENTERS.
       * ============================================================
       */

      timeline.to(
        content,
        {
          opacity: 1,
          x: 0,

          duration: 0.26,

          ease: 'power2.out',
        },
        0.54
      );

      /*
       * ============================================================
       * 0.80 → 1.00
       *
       * FINAL SPLIT HOLD
       * ============================================================
       */

      timeline.to(
        {},
        {
          duration: 0.20,
        },
        0.80
      );
    }, section);

    const refreshFrame =
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

    return () => {
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      aria-label="CHANDRA Philosophy"
      className="philosophy-section"
    >
      {/* ==========================================================
          STICKY VIEWPORT
          ========================================================== */}

      <div className="philosophy-stage">

        {/* ========================================================
            INITIAL LARGE TITLE
            ======================================================== */}

        <div
          ref={introTitleRef}
          className="philosophy-intro-title"
        >
          <span className="intro-index">
            01
          </span>

          <span className="intro-label">
            {siteContent.philosophy.eyebrow}
          </span>

          <span
            className="intro-rule"
            aria-hidden="true"
          />
        </div>

        {/* ========================================================
            FINAL LEFT CONTENT
            ======================================================== */}

        <div
          ref={contentRef}
          className="philosophy-content"
        >
          {/* Small eyebrow retains ORIGINAL size */}
          <div className="philosophy-eyebrow">
            <span>
              {siteContent.philosophy.eyebrow}
            </span>

            <div
              className="philosophy-rule"
              aria-hidden="true"
            />
          </div>

          {/* Headline */}
          <h2 className="philosophy-headline">
            <span>
              {
                siteContent.philosophy
                  .headlineLine1
              }
            </span>

            <span>
              {
                siteContent.philosophy
                  .headlineLine2
              }
            </span>
          </h2>

          {/* Supporting statement */}
          <p className="philosophy-subline">
            {siteContent.philosophy.subline}
          </p>

          {/* Body */}
          <p className="philosophy-body">
            {siteContent.philosophy.body}
          </p>

          {/* CTA */}
          <a
            href="#approach"
            className="philosophy-cta"
            aria-label="See Our Approach to Experiences"
          >
            <span>
              {siteContent.philosophy.cta}
            </span>

            <span aria-hidden="true">
              →
            </span>
          </a>
        </div>

        {/* ========================================================
            IMAGE

            One single panel.

            Its aspect ratio NEVER changes.

            Start:
            centred + scale(.58)

            End:
            right side + scale(1)
            ======================================================== */}

        <div
          ref={visualRef}
          className="philosophy-visual"
        >
          <img
            ref={imageRef}
            src="/media/philosophy-production.webp"
            alt="Chandra production specialist moving backstage through an illuminated corridor toward the live stage"
            loading="lazy"
            className="philosophy-image"
          />

          {/* Cinematic vignette */}
          <div
            className="philosophy-vignette"
            aria-hidden="true"
          />

          {/* Subtle edge treatment */}
          <div
            className="philosophy-edge-gradient"
            aria-hidden="true"
          />

          {/* Existing visual words */}
          <div
            className="philosophy-image-meta"
            aria-hidden="true"
          >
            <span>IDEAS</span>
            <span>PEOPLE</span>
            <span>EXPERIENCES</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ========================================================
           SCROLL TRACK
           ======================================================== */

        .philosophy-section {
          position: relative;

          width: 100%;
          height: 240svh;

          background:
            var(--color-ivory);

          color:
            var(--color-black);
        }

        .philosophy-stage {
          position: sticky;

          top: 0;

          width: 100%;
          height: 100svh;

          overflow: hidden;

          background:
            var(--color-ivory);
        }

        /* ========================================================
           INITIAL "OUR PHILOSOPHY"
           ======================================================== */

        .philosophy-intro-title {
          position: absolute;

          /*
           * Intentionally below fixed navbar.
           *
           * It will fade IN PLACE rather than
           * travelling underneath the navbar.
           */
          top:
            clamp(
              118px,
              15vh,
              160px
            );

          left: 50%;

          transform:
            translateX(-50%);

          z-index: 20;

          display: flex;
          align-items: center;

          gap: 18px;

          white-space: nowrap;

          will-change:
            opacity;
        }

        .intro-index {
          font-family:
            var(--font-mono);

          font-size: 10px;

          font-weight: 500;

          letter-spacing: 0.18em;

          color:
            var(--color-gold);

          opacity: 0.85;
        }

        /*
         * BIGGER INITIAL TITLE
         *
         * Previously around 13–16px.
         * Now intentionally more editorial.
         */
        .intro-label {
          font-family:
            var(--font-body);

          font-size:
            clamp(
              20px,
              1.7vw,
              27px
            );

          font-weight: 600;

          letter-spacing:
            0.25em;

          line-height: 1;

          text-transform: uppercase;

          color:
            var(--color-black);
        }

        .intro-rule {
          width: 52px;
          height: 1px;

          background:
            var(--color-gold);

          opacity: 0.75;
        }

        /* ========================================================
           FINAL LEFT CONTENT
           ======================================================== */

        .philosophy-content {
          position: absolute;

          z-index: 10;

          left: 0;
          top: 0;

          width: 42%;
          height: 100%;

          padding:
            clamp(
              100px,
              12vh,
              138px
            )
            clamp(
              48px,
              6vw,
              110px
            )
            clamp(
              56px,
              7vh,
              84px
            );

          display: flex;
          flex-direction: column;

          justify-content: center;

          will-change:
            opacity,
            transform;
        }

        /* ========================================================
           FINAL SMALL EYEBROW

           IMPORTANT:
           Keep original section font size.
           ======================================================== */

        .philosophy-eyebrow {
          display: flex;

          align-items: center;

          gap: 16px;

          margin-bottom: 22px;
        }

        .philosophy-eyebrow span {
          font-family:
            var(--font-body);

          /*
           * ORIGINAL SIZE RETAINED.
           */
          font-size: 11px;

          font-weight: 500;

          letter-spacing: 0.22em;

          color:
            var(--color-black);

          text-transform: uppercase;
        }

        .philosophy-rule {
          width: 36px;
          height: 1px;

          background:
            var(--color-gold);

          opacity: 0.85;
        }

        /* ========================================================
           HEADLINE
           ======================================================== */

        .philosophy-headline {
          margin:
            0 0 24px;

          display: flex;
          flex-direction: column;

          font-family:
            var(--font-serif);

          font-size:
            clamp(
              42px,
              5vw,
              68px
            );

          font-weight: 400;

          line-height: 0.96;

          letter-spacing:
            -0.022em;

          color:
            var(--color-black);
        }

        .philosophy-headline span {
          display: block;
        }

        /* ========================================================
           SUPPORTING STATEMENT
           ======================================================== */

        .philosophy-subline {
          max-width: 430px;

          margin:
            0 0 20px;

          font-family:
            var(--font-body);

          font-size: 11.5px;

          font-weight: 600;

          line-height: 1.5;

          letter-spacing: 0.2em;

          text-transform: uppercase;

          color:
            var(--color-black);
        }

        .philosophy-body {
          max-width: 440px;

          margin:
            0 0 32px;

          font-family:
            var(--font-body);

          font-size:
            clamp(
              14.5px,
              1.1vw,
              16.5px
            );

          line-height: 1.65;

          color:
            var(--color-muted-light);
        }

        /* ========================================================
           CTA
           ======================================================== */

        .philosophy-cta {
          width: fit-content;

          display: inline-flex;

          align-items: center;

          gap: 14px;

          position: relative;

          padding-bottom: 6px;

          font-family:
            var(--font-body);

          font-size: 11.5px;

          font-weight: 600;

          letter-spacing: 0.18em;

          text-transform: uppercase;

          text-decoration: none;

          color:
            var(--color-black);
        }

        .philosophy-cta::after {
          content: '';

          position: absolute;

          left: 0;
          bottom: 0;

          width: 100%;
          height: 1px;

          background:
            var(--color-gold);

          transform:
            scaleX(0.4);

          transform-origin:
            left;

          transition:
            transform
            0.4s
            var(--ease-cinematic);
        }

        .philosophy-cta:hover::after {
          transform:
            scaleX(1);
        }

        /* ========================================================
           IMAGE

           CRITICAL CHANGE:

           Width + height remain CONSTANT.

           Only transform changes.

           Therefore there is no rectangle →
           square → rectangle morph.
           ======================================================== */

        .philosophy-visual {
          position: absolute;

          z-index: 5;

          /*
           * FINAL SIZE EXISTS FROM FRAME 1.
           *
           * Starting visual only SCALEs this
           * same rectangular panel down.
           */
          width: 58%;
          height: 100svh;

          overflow: hidden;

          background:
            var(--color-charcoal);

          transform-origin:
            center center;

          will-change:
            left,
            top,
            transform;
        }

        .philosophy-image {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          /*
           * Keep existing composition.
           */
          object-position:
            center 38%;

          will-change:
            transform;
        }

        /* ========================================================
           IMAGE VIGNETTE
           ======================================================== */

        .philosophy-vignette {
          position: absolute;

          inset: 0;

          z-index: 2;

          pointer-events: none;

          background:
            linear-gradient(
              180deg,

              rgba(
                7,
                8,
                7,
                0.25
              )
              0%,

              transparent
              32%,

              transparent
              68%,

              rgba(
                7,
                8,
                7,
                0.55
              )
              100%
            );
        }

        /* ========================================================
           LEFT IMAGE EDGE
           ======================================================== */

        .philosophy-edge-gradient {
          position: absolute;

          inset: 0;

          z-index: 3;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,

              rgba(
                7,
                8,
                7,
                0.14
              )
              0%,

              transparent
              16%
            );
        }

        /* ========================================================
           IMAGE META
           ======================================================== */

        .philosophy-image-meta {
          position: absolute;

          right:
            clamp(
              24px,
              3vw,
              48px
            );

          bottom:
            clamp(
              24px,
              4vh,
              48px
            );

          z-index: 5;

          display: flex;

          flex-direction: column;

          align-items: flex-end;

          gap: 7px;

          pointer-events: none;
        }

        .philosophy-image-meta span {
          font-family:
            var(--font-mono);

          font-size: 9px;

          font-weight: 500;

          letter-spacing:
            0.22em;

          color:
            rgba(
              248,
              247,
              243,
              0.72
            );

          text-transform: uppercase;
        }

        /* ========================================================
           MOBILE / TABLET

           Keep mobile natural instead of forcing
           desktop cinematic scroll choreography.
           ======================================================== */

        @media (max-width: 900px) {
          .philosophy-section {
            height: auto;

            padding:
              72px
              var(
                --page-pad-x,
                24px
              );
          }

          .philosophy-stage {
            position: relative;

            height: auto;

            overflow: visible;

            display: flex;

            flex-direction: column;

            gap: 36px;
          }

          .philosophy-intro-title {
            position: relative;

            top: auto;
            left: auto;

            transform:
              none !important;

            opacity:
              1 !important;

            align-self:
              flex-start;

            order: 1;
          }

          /*
           * Slightly smaller than desktop
           * but still stronger than old version.
           */
          .intro-label {
            font-size:
              clamp(
                18px,
                5vw,
                24px
              );
          }

          .philosophy-visual {
            position: relative !important;

            left: auto !important;
            top: auto !important;

            width: 100% !important;

            /*
             * Mobile gets stable image ratio.
             */
            height: auto !important;

            aspect-ratio:
              4 / 5;

            transform:
              none !important;

            order: 2;
          }

          .philosophy-image {
            transform:
              none !important;
          }

          .philosophy-content {
            position: relative;

            left: auto;
            top: auto;

            width: 100%;
            height: auto;

            padding: 0;

            opacity:
              1 !important;

            transform:
              none !important;

            pointer-events:
              auto !important;

            order: 3;
          }

          .philosophy-headline {
            font-size:
              clamp(
                42px,
                11vw,
                62px
              );
          }

          .philosophy-image-meta {
            right: 18px;
            bottom: 18px;
          }
        }

        /* ========================================================
           REDUCED MOTION
           ======================================================== */

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .philosophy-section {
            height: 100svh;
          }

          .philosophy-intro-title {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};