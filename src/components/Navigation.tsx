'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import { siteContent } from '@/content/siteContent';

interface NavigationProps {
  onOpenEnquiry: () => void;
}

export const Navigation:
  React.FC<NavigationProps> = ({
    onOpenEnquiry,
  }) => {

    const [scrolled, setScrolled] =
      useState(false);

    const [
      mobileMenuOpen,
      setMobileMenuOpen,
    ] = useState(false);

    /*
     * Do NOT turn the nav background on after
     * only 50px anymore.
     *
     * The entire scroll-mask Hero needs a
     * transparent navigation.
     *
     * Background appears after Hero ends.
     */
    useEffect(() => {
      const handleScroll = () => {
        const hero =
          document.getElementById('home');

        if (!hero) {
          setScrolled(
            window.scrollY > 50
          );

          return;
        }

        const rect =
          hero.getBoundingClientRect();

        setScrolled(
          rect.bottom <= 80
        );
      };

      handleScroll();

      window.addEventListener(
        'scroll',
        handleScroll,
        {
          passive: true,
        }
      );

      return () => {
        window.removeEventListener(
          'scroll',
          handleScroll
        );
      };
    }, []);

    useEffect(() => {
      if (mobileMenuOpen) {
        document.body.style.overflow =
          'hidden';
      } else {
        document.body.style.overflow =
          '';
      }

      return () => {
        document.body.style.overflow =
          '';
      };
    }, [mobileMenuOpen]);

    const closeMenu = () =>
      setMobileMenuOpen(false);

    return (
      <header
        id="chandra-navigation"
        className="chandra-navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,

          width: '100%',

          zIndex: 100,

          backgroundColor:
            scrolled
              ? 'rgba(7,8,7,.94)'
              : 'transparent',

          borderBottom:
            scrolled
              ? '1px solid rgba(248,247,243,.08)'
              : '1px solid transparent',

          transition:
            'background-color 300ms ease, border-color 300ms ease',
        }}
      >
        <div
          style={{
            width: '100%',

            padding:
              '22px var(--page-pad-x)',

            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* BRAND */}
          <a
            href="#home"
            onClick={closeMenu}
            aria-label="CHANDRA Home"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span
              style={{
                fontFamily:
                  'var(--font-body)',
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.28em',
                color:
                  'var(--color-white)',
                textTransform:
                  'uppercase',
              }}
            >
              CHANDR
              {siteContent.brand.deltaChar}
            </span>

            <span
              style={{
                fontFamily:
                  'var(--font-body)',
                fontSize: '8px',
                fontWeight: 500,
                letterSpacing: '0.22em',
                color:
                  'var(--color-muted-dark)',
                textTransform:
                  'uppercase',
              }}
            >
              {siteContent.brand.tagline}
            </span>
          </a>

          {/* DESKTOP NAV */}
          <nav
            aria-label="Main Navigation"
            className="desktop-nav"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
              marginLeft: 'auto',
              marginRight: '64px',
            }}
          >
            {siteContent.navigation.map(
              (item) => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    fontFamily:
                      'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    color:
                      'var(--color-white)',
                    textTransform:
                      'uppercase',
                    opacity: 0.85,
                    transition:
                      'opacity 200ms ease, color 200ms ease',
                  }}
                  onMouseEnter={(e) =>
                    (
                      e.currentTarget
                        .style.opacity
                    ) = '1'
                  }
                  onMouseLeave={(e) =>
                    (
                      e.currentTarget
                        .style.opacity
                    ) = '0.85'
                  }
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* CTA / MOBILE */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <button
              onClick={onOpenEnquiry}
              className="btn-primary-gold desktop-cta"
              aria-label="Plan an Event Enquiry"
            >
              <span>
                PLAN AN EVENT
              </span>

              <span aria-hidden="true">
                →
              </span>
            </button>

            <button
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              className="mobile-toggle"
              aria-label={
                mobileMenuOpen
                  ? 'Close Navigation Menu'
                  : 'Open Navigation Menu'
              }
              aria-expanded={
                mobileMenuOpen
              }
              style={{
                display: 'none',
                padding: '8px',
                color:
                  'var(--color-white)',
                background:
                  'transparent',
                marginLeft: 'auto',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            style={{
              position: 'fixed',
              inset: 0,
              top: '72px',
              backgroundColor:
                'var(--color-black)',

              display: 'flex',
              flexDirection: 'column',
              justifyContent:
                'space-between',

              padding: '48px 32px',

              zIndex: 99,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
              }}
            >
              {siteContent.navigation.map(
                (item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeMenu}
                    style={{
                      fontFamily:
                        'var(--font-display)',
                      fontSize: '28px',
                      fontWeight: 400,
                      letterSpacing:
                        '0.04em',
                      color:
                        'var(--color-white)',
                      textTransform:
                        'uppercase',
                    }}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <button
                onClick={() => {
                  closeMenu();
                  onOpenEnquiry();
                }}
                className="btn-primary-gold"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '13px',
                }}
              >
                <span>
                  PLAN AN EVENT
                </span>

                <span>→</span>
              </button>

              <span
                style={{
                  fontSize: '11px',
                  letterSpacing:
                    '0.14em',
                  color:
                    'var(--color-muted-dark)',
                }}
              >
                {siteContent.brand.tagline}
              </span>
            </div>
          </div>
        )}

        <style jsx>{`
          /*
           * GSAP owns opacity / transform.
           * React never overwrites them.
           */
          .chandra-navigation {
            opacity: 0;
            transform:
              translateY(-6px);

            pointer-events: none;

            will-change:
              opacity,
              transform;
          }

          @media (min-width: 900px) {
            .desktop-nav {
              display: flex !important;
            }

            .desktop-cta {
              display:
                inline-flex !important;
            }

            .mobile-toggle {
              display: none !important;
            }
          }

          @media (max-width: 899px) {
            .desktop-nav {
              display: none !important;
            }

            .desktop-cta {
              display: none !important;
            }

            .mobile-toggle {
              display: block !important;
            }
          }
        `}</style>
      </header>
    );
  };