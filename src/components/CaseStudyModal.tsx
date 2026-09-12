'use client';

import React, { useEffect, useRef } from 'react';
import { siteContent } from '@/content/siteContent';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose, onOpenEnquiry }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="casestudy-dialog-title"
      style={{
        border: '1px solid rgba(198, 161, 91, 0.4)',
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        padding: 'clamp(24px, 4vw, 44px)',
        maxWidth: '680px',
        width: '92%',
        borderRadius: '2px',
        margin: 'auto',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            {siteContent.featured.eyebrow}
          </span>
          <h3
            id="casestudy-dialog-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {siteContent.featured.title}
          </h3>
        </div>

        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-white)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div style={{ position: 'relative', aspectRatio: '16 / 9', marginBottom: '24px', overflow: 'hidden', borderRadius: '2px' }}>
        <img
          src="/media/featured-launch.webp"
          alt="Automotive product launch preview"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--color-muted-dark)' }}>
          {siteContent.featured.caseStudySummary.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid rgba(248, 247, 243, 0.08)', paddingTop: '16px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase' }}>Scope</span>
            <span style={{ fontSize: '12px', color: 'var(--color-white)', fontWeight: 500 }}>{siteContent.featured.caseStudySummary.scope}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase' }}>Location</span>
            <span style={{ fontSize: '12px', color: 'var(--color-white)', fontWeight: 500 }}>{siteContent.featured.caseStudySummary.location}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '14px' }}>
        <button
          onClick={() => {
            onClose();
            onOpenEnquiry();
          }}
          className="btn-primary-gold"
          style={{ flex: 1 }}
        >
          <span>PLAN A SIMILAR EVENT</span>
          <span>→</span>
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '12px 20px',
            border: '1px solid rgba(248, 247, 243, 0.2)',
            color: 'var(--color-white)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          CLOSE
        </button>
      </div>
    </dialog>
  );
};
