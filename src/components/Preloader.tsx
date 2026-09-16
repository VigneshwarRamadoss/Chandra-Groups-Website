'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { siteContent } from '@/content/siteContent';

interface PreloaderProps {
  isMediaReady: boolean;
  onPreloaderComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  isMediaReady,
  onPreloaderComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackOverlayRef = useRef<HTMLDivElement>(null);
  const maskEmblemGroupRef = useRef<SVGGElement>(null);
  const brandGroupRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasTriggeredRef = useRef(false);

  // Initialize client dimensions safely after mount
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!isMediaReady || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Accessibility fallback for reduced motion
    if (mediaQuery.matches) {
      if (brandGroupRef.current) {
        gsap.to(brandGroupRef.current, { opacity: 1, duration: 0.3 });
      }
      setTimeout(() => {
        onPreloaderComplete();
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              if (containerRef.current) {
                containerRef.current.style.display = 'none';
              }
            },
          });
        }
      }, 500);
      return;
    }

    // Viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Measure actual rendered bounding box and center of the mask emblem
    let cx = vw / 2;
    let cy = vh / 2;
    let baseRadiusX = 60;
    let baseRadiusY = 60;

    if (maskEmblemGroupRef.current) {
      const bbox = maskEmblemGroupRef.current.getBoundingClientRect();
      if (bbox.width > 0 && bbox.height > 0) {
        cx = bbox.left + bbox.width / 2;
        cy = bbox.top + bbox.height / 2;
        baseRadiusX = bbox.width / 2;
        baseRadiusY = bbox.height / 2;
      }
    }

    // Exact scale factor required for each of the four viewport corners
    const sTL = Math.abs(0 - cx) / baseRadiusX + Math.abs(0 - cy) / baseRadiusY;
    const sTR = Math.abs(vw - cx) / baseRadiusX + Math.abs(0 - cy) / baseRadiusY;
    const sBL = Math.abs(0 - cx) / baseRadiusX + Math.abs(vh - cy) / baseRadiusY;
    const sBR = Math.abs(vw - cx) / baseRadiusX + Math.abs(vh - cy) / baseRadiusY;

    // Farthest corner determines the base required scale
    const maxRequiredScale = Math.max(sTL, sTR, sBL, sBR);

    // Apply 15% safety overscan to ensure all 4 corners are completely uncovered
    const finalScale = maxRequiredScale * 1.15;

    // Master GSAP Timeline sequence
    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      },
    });

    timelineRef.current = tl;

    // 0.00s–0.30s: Brand mark & wordmark fade/scale into view
    tl.to(brandGroupRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
    })
    .to(blackOverlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
    }, "<")
      // 0.30s–0.65s: Brief brand hold
      .to({}, { duration: 0.35 })
      // 0.65s–1.55s: Mask expands smoothly + initial wordmark fades out
      .to(
        brandGroupRef.current,
        {
          opacity: 0,
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.in',
        },
        'expand'
      )
      .to(
        maskEmblemGroupRef.current,
        {
          scale: finalScale,
          duration: 0.9,
          ease: 'power3.inOut',
        },
        'expand'
      )
      // 1.45s: Signal parent that Hero text & Navigation can begin fading in
      .call(() => {
        onPreloaderComplete();
      })
      // 1.55s–1.85s: Container background fades out completely
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isMediaReady, onPreloaderComplete]);

  const vw = dimensions.width;
  const vh = dimensions.height;
  const cx = vw / 2;
  const cy = vh / 2;

  // Base rendered emblem dimensions
  const baseSize = 120;
  const halfBase = baseSize / 2;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading Chandra Experience"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 900,
        backgroundColor: 'transparent',
        pointerEvents: 'auto',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Initial Solid Black Screen Overlay */}
      <div
        ref={blackOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#070807',
          zIndex: 905,
          pointerEvents: 'none',
        }}
      />

      {/* SVG Mask Container */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <mask id="chandra-emblem-mask" maskUnits="userSpaceOnUse">
            {/* White background preserves the black overlay */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black emblem cutout shape reveals underlying Hero video using approved CHANDRA mark */}
            <g
              ref={maskEmblemGroupRef}
              transform={`translate(${cx - halfBase}, ${cy - halfBase}) scale(1)`}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              <svg
                width={baseSize}
                height={baseSize}
                viewBox="0 0 352 352"
                fill="black"
              >
                <path d="M 174 0 L 176 1 L 184 1 L 194 4 L 204 10 L 338 142 L 346 153 L 351 167 L 351 183 L 350 184 L 350 188 L 343 203 L 245 303 L 207 341 L 200 346 L 187 351 L 166 351 L 159 349 L 147 342 L 9 205 L 1 188 L 1 184 L 0 183 L 1 166 L 5 155 L 12 145 L 146 10 L 159 3 L 166 1 L 173 1 Z" />
              </svg>
            </g>
          </mask>
        </defs>

        {/* Masked Near-Black Overlay */}
        <rect
          width="100%"
          height="100%"
          fill="#070807"
          mask="url(#chandra-emblem-mask)"
        />
      </svg>

      {/* Initial Branded Hold Stage (Emblem & Wordmark) */}
      <div
        ref={brandGroupRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.95)',
          opacity: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          pointerEvents: 'none',
          zIndex: 910,
        }}
      >
        {/* Approved Brand Emblem Icon (Champagne Gold Accent) */}
        <div
          style={{
            width: '120px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 352 352"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Rounded Diamond Border */}
            <path
              d="M 174 0 L 176 1 L 184 1 L 194 4 L 204 10 L 338 142 L 346 153 L 351 167 L 351 183 L 350 184 L 350 188 L 343 203 L 245 303 L 207 341 L 200 346 L 187 351 L 166 351 L 159 349 L 147 342 L 9 205 L 1 188 L 1 184 L 0 183 L 1 166 L 5 155 L 12 145 L 146 10 L 159 3 L 166 1 L 173 1 Z"
              stroke="#C6A15B"
              strokeWidth="4"
              fill="none"
            />
            {/* Inner Accent Line */}
            <path
              d="M 175 4 L 176 5 L 184 5 L 193 8 L 201 13 L 209 20 L 337 147 L 343 156 L 347 169 L 347 182 L 344 192 L 339 201 L 223 319 L 205 337 L 194 344 L 184 347 L 168 347 L 155 342 L 149 338 L 13 203 L 8 195 L 5 186 L 5 180 L 4 179 L 5 167 L 13 150 L 149 13 L 157 8 L 166 5 L 174 5 Z"
              stroke="rgba(198, 161, 91, 0.4)"
              strokeWidth="2"
              fill="none"
            />
            {/* Internal CHANDRA Symbol */}
            <path
              d="M 170 115 L 187 115 L 191 116 L 198 119 L 201 123 L 201 125 L 199 127 L 197 127 L 191 122 L 181 119 L 170 120 L 166 122 L 163 122 L 155 127 L 140 142 L 134 154 L 130 166 L 130 194 L 133 202 L 142 212 L 152 217 L 168 217 L 176 215 L 181 212 L 187 206 L 190 200 L 191 190 L 189 187 L 185 183 L 183 183 L 181 185 L 181 198 L 184 203 L 183 206 L 160 206 L 158 204 L 164 198 L 167 193 L 169 185 L 169 179 L 165 178 L 159 186 L 152 187 L 150 185 L 150 178 L 158 171 L 174 170 L 176 167 L 177 161 L 181 153 L 187 147 L 188 142 L 184 141 L 183 142 L 173 143 L 167 145 L 159 151 L 154 151 L 152 147 L 156 143 L 168 137 L 202 136 L 216 129 L 229 128 L 230 129 L 237 129 L 244 133 L 246 137 L 246 145 L 242 149 L 237 151 L 225 151 L 208 144 L 199 143 L 190 153 L 189 157 L 190 158 L 194 158 L 201 155 L 209 155 L 214 160 L 215 172 L 214 173 L 213 184 L 211 190 L 211 200 L 214 203 L 222 202 L 223 201 L 223 192 L 225 190 L 227 190 L 229 192 L 229 200 L 227 203 L 225 204 L 199 204 L 201 191 L 205 182 L 206 163 L 204 160 L 196 160 L 188 163 L 185 167 L 185 172 L 187 174 L 199 174 L 199 179 L 193 181 L 193 184 L 195 187 L 195 194 L 196 195 L 195 202 L 189 213 L 179 220 L 169 223 L 149 223 L 148 222 L 144 222 L 129 214 L 123 207 L 120 201 L 117 189 L 117 168 L 118 167 L 119 158 L 124 147 L 136 131 L 148 121 L 151 121 L 154 119 L 160 118 L 164 116 L 169 116 Z"
              fill="#C6A15B"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Wordmark & Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '0.32em',
              color: 'var(--color-ivory)',
              textTransform: 'uppercase',
            }}
          >
            CHANDR{siteContent.brand.deltaChar}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              opacity: 0.9,
            }}
          >
            {siteContent.brand.tagline}
          </span>
        </div>
      </div>
    </div>
  );
};
