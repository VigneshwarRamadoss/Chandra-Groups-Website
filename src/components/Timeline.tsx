'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type TimelineItem = {
  id: string;
  period: string;
  titleLine1: string;
  titleLine2?: string;
  description: string;
  image: string;
  imagePosition?: string;
};

const timelineItems: TimelineItem[] = [
  {
    id: '1949-1975',
    period: '1949 – 1975',
    titleLine1: 'The Beginning',
    description:
      'The journey began in 1949 — built through hands-on work, reliability and relationships that became the foundation of Chandra Groups.',
    image: '/media/pic 1.png',
    imagePosition: 'center center',
  },

  {
    id: '1976-1999',
    period: '1976 – 1999',
    titleLine1: 'Building',
    titleLine2: 'The Event Floor',
    description:
      'From exhibitions and lighting to furniture, pandals and structures, Chandra steadily expanded the capabilities behind large-scale events.',
    image: '/media/pic 2.png',
    imagePosition: 'center center',
  },

  {
    id: '2000-2009',
    period: '2000 – 2009',
    titleLine1: 'Engineering',
    titleLine2: 'The Experience',
    description:
      'A decade of infrastructure innovation — from modular flooring and German structures to temporary A/C and exhibition systems.',
    image: '/media/pic 3.png',
    imagePosition: 'center center',
  },

  {
    id: '2010-2019',
    period: '2010 – 2019',
    titleLine1: 'Scale &',
    titleLine2: 'Recognition',
    description:
      'Chandra moved into larger productions, major public events and complex temporary infrastructure — building scale, experience and industry recognition.',
    image: '/media/pic 4.png',
    imagePosition: 'center center',
  },

  {
    id: '2020-2026',
    period: '2020 – 2026',
    titleLine1: 'Resilience →',
    titleLine2: 'Expansion',
    description:
      'From emergency infrastructure during COVID to concerts, engineered galleries and new markets, Chandra continued evolving beyond traditional event production.',
    image: '/media/pic 5.png',
    imagePosition: 'center center',
  },
];

export const Timeline: React.FC = () => {
  const sectionRef =
    useRef<HTMLElement>(null);

  const activeIndexRef =
    useRef(0);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    entryProgress,
    setEntryProgress,
  ] = useState(0);

  const [
    reducedMotion,
    setReducedMotion,
  ] = useState(false);

  const totalItems =
    timelineItems.length;

  /* ============================================================
     ACTIVE INDEX REF
     ============================================================ */

  useEffect(() => {
    activeIndexRef.current =
      activeIndex;
  }, [activeIndex]);

  /* ============================================================
     REDUCED MOTION
     ============================================================ */

  useEffect(() => {
    const query =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );

    const update =
      () => {
        setReducedMotion(
          query.matches
        );
      };

    update();

    query.addEventListener?.(
      'change',
      update
    );

    return () => {
      query.removeEventListener?.(
        'change',
        update
      );
    };
  }, []);

  /* ============================================================
     SCROLL PROGRESS
     ============================================================ */

  useEffect(() => {
    let animationFrame = 0;

    let ticking = false;

    const clamp = (
      value: number,
      min: number,
      max: number
    ) =>
      Math.min(
        max,
        Math.max(
          min,
          value
        )
      );

    const handleScroll =
      () => {
        if (ticking) return;

        ticking = true;

        animationFrame =
          window.requestAnimationFrame(
            () => {
              const section =
                sectionRef.current;

              if (!section) {
                ticking =
                  false;

                return;
              }

              const rect =
                section.getBoundingClientRect();

              const viewportHeight =
                window.innerHeight;

              /* ===============================================
                 ABOUT → TIMELINE FADE TRANSITION
                 =============================================== */

              /*
               * Timeline begins fading in while its top
               * enters the lower part of the viewport.
               *
               * No center morph.
               * No shape reveal.
               *
               * Just:
               * blur → clean
               * transparent → visible
               */
              const entryStart =
                viewportHeight *
                0.92;

              const entryEnd =
                viewportHeight *
                0.2;

              const entry =
                clamp(
                  (
                    entryStart -
                    rect.top
                  ) /
                    (
                      entryStart -
                      entryEnd
                    ),
                  0,
                  1
                );

              setEntryProgress(
                reducedMotion
                  ? 1
                  : entry
              );

              /* ===============================================
                 INTERNAL TIMELINE STATE
                 =============================================== */

              const totalDistance =
                rect.height -
                viewportHeight;

              if (
                totalDistance >
                0
              ) {
                const travelled =
                  -rect.top;

                const progress =
                  clamp(
                    travelled /
                      totalDistance,
                    0,
                    1
                  );

                /*
                 * Five states.
                 *
                 * Nothing morphs here.
                 * We simply switch/crossfade:
                 *
                 * image
                 * year
                 * headline
                 * description
                 */
                const index =
                  Math.round(
                    progress *
                      (
                        totalItems -
                        1
                      )
                  );

                const safeIndex =
                  clamp(
                    index,
                    0,
                    totalItems -
                      1
                  );

                if (
                  safeIndex !==
                  activeIndexRef.current
                ) {
                  activeIndexRef.current =
                    safeIndex;

                  setActiveIndex(
                    safeIndex
                  );
                }
              }

              ticking =
                false;
            }
          );
      };

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );

      if (
        animationFrame
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, [
    reducedMotion,
    totalItems,
  ]);

  /* ============================================================
     CLICK YEAR
     ============================================================ */

  const scrollToIndex =
    useCallback(
      (
        index: number
      ) => {
        const section =
          sectionRef.current;

        if (!section) return;

        const safeIndex =
          Math.min(
            totalItems - 1,
            Math.max(
              0,
              index
            )
          );

        const rect =
          section.getBoundingClientRect();

        const sectionTop =
          window.scrollY +
          rect.top;

        const distance =
          section.offsetHeight -
          window.innerHeight;

        const progress =
          safeIndex /
          (
            totalItems -
            1
          );

        window.scrollTo({
          top:
            sectionTop +
            distance *
              progress,

          behavior:
            reducedMotion
              ? 'auto'
              : 'smooth',
        });
      },
      [
        reducedMotion,
        totalItems,
      ]
    );

  /* ============================================================
     ACTIVE PROGRESS POSITION
     ============================================================ */

  const progressPosition =
    totalItems > 1
      ? (
          activeIndex /
          (
            totalItems -
            1
          )
        ) * 80
      : 0;

  /* ============================================================
     ENTRY FADE VALUES
     ============================================================ */

  const entryOpacity =
    0.22 +
    entryProgress *
      0.78;

  const entryBlur =
    (
      1 -
      entryProgress
    ) * 8;

  const entryTranslate =
    (
      1 -
      entryProgress
    ) * 16;

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="chandra-timeline"
      aria-label="Chandra Groups timeline"
    >
      <div className="timeline-track">
        <div className="timeline-sticky">
          {/* ================================================
              ABOUT → TIMELINE FADE WRAPPER
              ================================================ */}

          <div
            className="timeline-entry-stage"
            style={{
              opacity:
                entryOpacity,

              filter:
                `blur(${entryBlur}px)`,

              transform:
                `translate3d(
                  0,
                  ${entryTranslate}px,
                  0
                )`,
            }}
          >
            {/* ==============================================
                BACKGROUND IMAGES
                ============================================== */}

            <div
              className="timeline-backgrounds"
              aria-hidden="true"
            >
              {timelineItems.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className={[
                      'timeline-background',

                      index ===
                      activeIndex
                        ? 'is-active'
                        : '',
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        ' '
                      )}
                  >
                    <img
                      src={
                        item.image
                      }
                      alt=""
                      loading="eager"
                      decoding="async"
                      draggable={
                        false
                      }
                      className="timeline-background__image"
                      style={{
                        objectPosition:
                          item.imagePosition ||
                          'center center',
                      }}
                    />
                  </div>
                )
              )}
            </div>

            {/* ==============================================
                OVERLAYS
                ============================================== */}

            <div
              className="timeline-overlay timeline-overlay--base"
              aria-hidden="true"
            />

            <div
              className="timeline-overlay timeline-overlay--left"
              aria-hidden="true"
            />

            <div
              className="timeline-overlay timeline-overlay--bottom"
              aria-hidden="true"
            />

            {/* ==============================================
                OUR TIMELINE
                ============================================== */}

            <header className="timeline-header">
              <h2 className="timeline-header__title">
                OUR TIMELINE
              </h2>
            </header>

            {/* ==============================================
                YEARS
                ============================================== */}

            <nav
              className="timeline-years"
              aria-label="Timeline periods"
            >
              {timelineItems.map(
                (
                  item,
                  index
                ) => {
                  const active =
                    index ===
                    activeIndex;

                  return (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      className={[
                        'timeline-year',

                        active
                          ? 'is-active'
                          : '',
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ' '
                        )}
                      onClick={() =>
                        scrollToIndex(
                          index
                        )
                      }
                      aria-current={
                        active
                          ? 'step'
                          : undefined
                      }
                    >
                      <span
                        className="timeline-year__dot"
                        aria-hidden="true"
                      />

                      <span className="timeline-year__label">
                        {
                          item.period
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </nav>

            {/* ==============================================
                COPY
                ============================================== */}

            <div className="timeline-content-stage">
              {timelineItems.map(
                (
                  item,
                  index
                ) => {
                  const active =
                    index ===
                    activeIndex;

                  return (
                    <article
                      key={
                        item.id
                      }
                      className={[
                        'timeline-content',

                        active
                          ? 'is-active'
                          : '',
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ' '
                        )}
                      aria-hidden={
                        !active
                      }
                    >
                      <h3 className="timeline-content__headline">
                        <span>
                          {
                            item.titleLine1
                          }
                        </span>

                        {item.titleLine2 && (
                          <span>
                            {
                              item.titleLine2
                            }
                          </span>
                        )}
                      </h3>

                      <p className="timeline-content__description">
                        {
                          item.description
                        }
                      </p>
                    </article>
                  );
                }
              )}
            </div>

            {/* ==============================================
                PROGRESS
                ============================================== */}

            <div
              className="timeline-progress"
              aria-hidden="true"
            >
              <span className="timeline-progress__number">
                {String(
                  activeIndex +
                    1
                ).padStart(
                  2,
                  '0'
                )}
              </span>

              <div className="timeline-progress__track">
                <span
                  className="timeline-progress__pill"
                  style={{
                    left:
                      `${progressPosition}%`,
                  }}
                />
              </div>

              <span className="timeline-progress__number">
                {String(
                  totalItems
                ).padStart(
                  2,
                  '0'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ============================================================
           ROOT
           ============================================================ */

        .chandra-timeline {
          position: relative;

          width: 100%;

          background:
            #070807;

          color:
            #f8f7f3;

          overflow:
            visible;

          border-top:
            1px solid
            rgba(
              248,
              247,
              243,
              0.05
            );
        }

        /* ============================================================
           SHORTER SCROLL EXPERIENCE
           ============================================================ */

        .timeline-track {
          position: relative;

          width: 100%;

          /*
           * Reduced from 500.
           *
           * User doesn't need to scroll
           * five huge screens.
           */
          height: 420vh;
          height: 420dvh;
        }

        /* ============================================================
           SINGLE VIEWPORT
           ============================================================ */

        .timeline-sticky {
          position: sticky;

          top: 0;

          width: 100%;

          height: 100vh;
          height: 100dvh;

          max-height:
            100dvh;

          overflow:
            hidden;

          background:
            #070807;

          isolation:
            isolate;
        }

        /* ============================================================
           ABOUT → TIMELINE FADE
           ============================================================ */

        .timeline-entry-stage {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          overflow:
            hidden;

          will-change:
            opacity,
            filter,
            transform;
        }

        /* ============================================================
           BACKGROUND
           SIMPLE CROSSFADE ONLY
           ============================================================ */

        .timeline-backgrounds {
          position: absolute;

          inset: 0;

          z-index: 0;

          overflow:
            hidden;

          background:
            #070807;
        }

        .timeline-background {
          position: absolute;

          inset: 0;

          opacity: 0;

          /*
           * NO MORPH.
           * NO CLIP PATH.
           * NO CENTER EXPANSION.
           */
          transition:
            opacity
              700ms
              var(
                --ease-cinematic
              );

          will-change:
            opacity;
        }

        .timeline-background.is-active {
          opacity: 1;
        }

        .timeline-background__image {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: cover;

          filter:
            brightness(
              0.84
            )
            contrast(
              1.02
            );

          user-select:
            none;

          pointer-events:
            none;
        }

        /* ============================================================
           OVERLAYS
           ============================================================ */

        .timeline-overlay {
          position: absolute;

          inset: 0;

          pointer-events:
            none;
        }

        .timeline-overlay--base {
          z-index: 2;

          background:
            rgba(
              7,
              8,
              7,
              0.06
            );
        }

        .timeline-overlay--left {
          z-index: 3;

          background:
            linear-gradient(
              90deg,

              rgba(
                  7,
                  8,
                  7,
                  0.9
                )
                0%,

              rgba(
                  7,
                  8,
                  7,
                  0.6
                )
                18%,

              rgba(
                  7,
                  8,
                  7,
                  0.2
                )
                38%,

              rgba(
                  7,
                  8,
                  7,
                  0
                )
                62%
            );
        }

        .timeline-overlay--bottom {
          z-index: 3;

          background:
            linear-gradient(
              180deg,

              rgba(
                  7,
                  8,
                  7,
                  0
                )
                45%,

              rgba(
                  7,
                  8,
                  7,
                  0.16
                )
                64%,

              rgba(
                  7,
                  8,
                  7,
                  0.68
                )
                100%
            );
        }

        /* ============================================================
           OUR TIMELINE
           SMALLER + LOWER OPACITY
           ============================================================ */

        .timeline-header {
          position: absolute;

          z-index: 10;

          top:
            clamp(
              22px,
              4.6dvh,
              42px
            );

          left: 50%;

          transform:
            translateX(
              -50%
            );

          pointer-events:
            none;

          white-space:
            nowrap;
        }

        .timeline-header__title {
          margin: 0;

          font-family:
            'Inter',
            'Helvetica Neue',
            Arial,
            sans-serif;

          font-size:
            clamp(
              23px,
              2.5vw,
              38px
            );

          font-weight: 600;

          line-height: 1;

          letter-spacing:
            0.18em;

          color:
            rgba(
              248,
              247,
              243,
              0.76
            );

          text-transform:
            uppercase;
        }

        /* ============================================================
           YEARS
           ============================================================ */

        .timeline-years {
          position: absolute;

          z-index: 10;

          left:
            clamp(
              28px,
              6.8vw,
              106px
            );

          top: 50%;

          transform:
            translateY(
              -50%
            );

          display: flex;

          flex-direction:
            column;

          align-items:
            flex-start;

          gap:
            clamp(
              16px,
              2.8dvh,
              25px
            );
        }

        .timeline-year {
          display: flex;

          align-items:
            center;

          gap: 11px;

          padding: 0;

          border: 0;

          background:
            transparent;

          color:
            rgba(
              248,
              247,
              243,
              0.25
            );

          font-family:
            'Inter',
            'Helvetica Neue',
            Arial,
            sans-serif;

          transition:
            color
              350ms
              var(
                --ease-ui
              );

          cursor: pointer;
        }

        .timeline-year:hover {
          color:
            rgba(
              248,
              247,
              243,
              0.55
            );
        }

        .timeline-year__dot {
          width: 5px;
          height: 5px;

          flex: 0 0 auto;

          border-radius:
            50%;

          background:
            #f8f7f3;

          opacity: 0;

          transform:
            scale(
              0.4
            );

          transition:
            opacity
              300ms
              var(
                --ease-ui
              ),
            transform
              300ms
              var(
                --ease-ui
              );
        }

        .timeline-year__label {
          font-size:
            clamp(
              13px,
              1.2vw,
              18px
            );

          font-weight: 400;

          line-height: 1;

          letter-spacing:
            -0.025em;

          white-space:
            nowrap;

          transition:
            font-size
              400ms
              var(
                --ease-ui
              ),
            font-weight
              300ms
              var(
                --ease-ui
              ),
            opacity
              300ms
              var(
                --ease-ui
              );
        }

        .timeline-year.is-active {
          color:
            rgba(
              248,
              247,
              243,
              0.94
            );
        }

        .timeline-year.is-active
          .timeline-year__dot {
          opacity: 1;

          transform:
            scale(
              1
            );
        }

        .timeline-year.is-active
          .timeline-year__label {
          font-size:
            clamp(
              19px,
              1.75vw,
              27px
            );

          font-weight: 700;
        }

        /* ============================================================
           CONTENT AREA
           ============================================================ */

        .timeline-content-stage {
          position: absolute;

          z-index: 10;

          left: 50%;

          bottom:
            clamp(
              76px,
              10dvh,
              96px
            );

          width:
            min(
              70vw,
              850px
            );

          height:
            clamp(
              125px,
              22dvh,
              180px
            );

          transform:
            translateX(
              -50%
            );

          pointer-events:
            none;
        }

        /* ============================================================
           CONTENT CHANGES
           SIMPLE FADE
           ============================================================ */

        .timeline-content {
          position: absolute;

          inset: 0;

          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            flex-end;

          text-align:
            center;

          opacity: 0;

          visibility:
            hidden;

          transform:
            translate3d(
              0,
              8px,
              0
            );

          transition:
            opacity
              520ms
              var(
                --ease-cinematic
              ),
            transform
              620ms
              var(
                --ease-cinematic
              ),
            visibility
              0s
              linear
              620ms;
        }

        .timeline-content.is-active {
          opacity: 1;

          visibility:
            visible;

          transform:
            translate3d(
              0,
              0,
              0
            );

          transition:
            opacity
              600ms
              var(
                --ease-cinematic
              ),
            transform
              700ms
              var(
                --ease-cinematic
              ),
            visibility
              0s;
        }

        /* ============================================================
           MAIN HEADING
           SLIGHTLY SMALLER
           ============================================================ */

        .timeline-content__headline {
          margin: 0;

          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          font-family:
            'Inter',
            'Helvetica Neue',
            Arial,
            sans-serif;

          font-size:
            clamp(
              40px,
              4.7vw,
              70px
            );

          font-weight: 600;

          line-height:
            0.97;

          letter-spacing:
            -0.05em;

          color:
            rgba(
              248,
              247,
              243,
              0.96
            );

          text-wrap:
            balance;
        }

        .timeline-content__headline
          span {
          display: block;
        }

        /* ============================================================
           DESCRIPTION
           MORE SPACE + LOWER OPACITY
           ============================================================ */

        .timeline-content__description {
          width:
            min(
              100%,
              650px
            );

          /*
           * More separation from heading.
           */
          margin:
            clamp(
              18px,
              2.4dvh,
              25px
            )
            auto
            0;

          font-family:
            'Inter',
            'Helvetica Neue',
            Arial,
            sans-serif;

          font-size:
            clamp(
              11px,
              0.86vw,
              13px
            );

          font-weight: 400;

          line-height:
            1.55;

          letter-spacing:
            -0.005em;

          color:
            rgba(
              248,
              247,
              243,
              0.48
            );

          text-wrap:
            balance;
        }

        /* ============================================================
           PROGRESS
           ============================================================ */

        .timeline-progress {
          position: absolute;

          z-index: 10;

          left: 50%;

          bottom:
            clamp(
              16px,
              3dvh,
              27px
            );

          width:
            min(
              28vw,
              350px
            );

          transform:
            translateX(
              -50%
            );

          display: grid;

          grid-template-columns:
            auto
            minmax(
              80px,
              1fr
            )
            auto;

          align-items:
            center;

          gap:
            14px;
        }

        .timeline-progress__number {
          font-family:
            'Inter',
            'Helvetica Neue',
            Arial,
            sans-serif;

          font-size:
            10px;

          font-weight: 500;

          color:
            rgba(
              248,
              247,
              243,
              0.48
            );
        }

        .timeline-progress__track {
          position: relative;

          width: 100%;

          height: 8px;
        }

        .timeline-progress__track::before {
          content: '';

          position:
            absolute;

          left: 0;
          right: 0;

          top: 50%;

          height: 1px;

          transform:
            translateY(
              -50%
            );

          background:
            rgba(
              248,
              247,
              243,
              0.2
            );
        }

        .timeline-progress__pill {
          position:
            absolute;

          top: 50%;

          width: 20%;

          height: 4px;

          transform:
            translateY(
              -50%
            );

          border-radius:
            999px;

          background:
            rgba(
              248,
              247,
              243,
              0.88
            );

          transition:
            left
              550ms
              var(
                --ease-cinematic
              );
        }

        /* ============================================================
           SHORT DESKTOP HEIGHT
           ============================================================ */

        @media (
          min-width: 768px
        ) and (
          max-height: 720px
        ) {
          .timeline-header {
            top: 18px;
          }

          .timeline-header__title {
            font-size:
              clamp(
                21px,
                2.2vw,
                31px
              );
          }

          .timeline-years {
            gap: 15px;
          }

          .timeline-year__label {
            font-size:
              12px;
          }

          .timeline-year.is-active
            .timeline-year__label {
            font-size:
              20px;
          }

          .timeline-content-stage {
            bottom: 55px;

            height:
              138px;
          }

          .timeline-content__headline {
            font-size:
              clamp(
                38px,
                4.2vw,
                58px
              );
          }

          .timeline-content__description {
            margin-top:
              15px;

            max-width:
              590px;

            font-size:
              10.5px;

            line-height:
              1.5;
          }

          .timeline-progress {
            bottom: 14px;

            width:
              min(
                26vw,
                320px
              );
          }
        }

        /* ============================================================
           MOBILE
           ============================================================ */

        @media (
          max-width: 767px
        ) {
          .timeline-track {
            height:
              420dvh;
          }

          .timeline-header {
            top: 20px;
          }

          .timeline-header__title {
            font-size:
              clamp(
                18px,
                5.5vw,
                23px
              );

            letter-spacing:
              0.16em;
          }

          .timeline-years {
            top:
              22dvh;

            left: 18px;

            transform:
              none;

            gap: 12px;
          }

          .timeline-year {
            gap: 8px;
          }

          .timeline-year__dot {
            width: 4px;
            height: 4px;
          }

          .timeline-year__label {
            font-size:
              11px;
          }

          .timeline-year.is-active
            .timeline-year__label {
            font-size:
              15px;
          }

          .timeline-content-stage {
            left: 18px;

            right: 18px;

            bottom: 62px;

            width: auto;

            height:
              160px;

            transform:
              none;
          }

          .timeline-content {
            align-items:
              flex-start;

            text-align:
              left;
          }

          .timeline-content__headline {
            align-items:
              flex-start;

            font-size:
              clamp(
                34px,
                10.5vw,
                48px
              );

            line-height:
              0.98;
          }

          .timeline-content__description {
            width: 100%;

            max-width:
              500px;

            margin:
              16px
              0
              0;

            font-size:
              11px;

            line-height:
              1.5;

            color:
              rgba(
                248,
                247,
                243,
                0.48
              );

            text-wrap:
              pretty;
          }

          .timeline-progress {
            left: 18px;

            right: 18px;

            bottom: 17px;

            width: auto;

            transform:
              none;

            grid-template-columns:
              22px
              1fr
              22px;

            gap: 9px;
          }

          .timeline-overlay--left {
            background:
              linear-gradient(
                90deg,

                rgba(
                    7,
                    8,
                    7,
                    0.88
                  )
                  0%,

                rgba(
                    7,
                    8,
                    7,
                    0.48
                  )
                  43%,

                rgba(
                    7,
                    8,
                    7,
                    0.04
                  )
                  100%
              );
          }

          .timeline-overlay--bottom {
            background:
              linear-gradient(
                180deg,

                rgba(
                    7,
                    8,
                    7,
                    0
                  )
                  26%,

                rgba(
                    7,
                    8,
                    7,
                    0.3
                  )
                  58%,

                rgba(
                    7,
                    8,
                    7,
                    0.82
                  )
                  100%
              );
          }
        }

        /* ============================================================
           REDUCED MOTION
           ============================================================ */

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .timeline-entry-stage {
            opacity:
              1 !important;

            filter:
              none !important;

            transform:
              none !important;
          }

          .timeline-background,
          .timeline-content,
          .timeline-year,
          .timeline-year__label,
          .timeline-progress__pill {
            transition:
              none !important;
          }
        }
      `}</style>
    </section>
  );
};