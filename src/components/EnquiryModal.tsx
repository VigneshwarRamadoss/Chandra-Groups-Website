'use client';

import React, { useState, useEffect, useRef } from 'react';
import { siteContent } from '@/content/siteContent';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    contact: '',
    eventType: 'Product Launch',
    city: '',
    brief: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      dialog.close();
      document.body.style.overflow = '';
      setSubmitted(false);
    }
  }, [isOpen]);

  // Handle Esc key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Isolated submission handler (ready for real endpoint wiring)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-labelledby="enquiry-dialog-title"
      style={{
        border: '1px solid rgba(198, 161, 91, 0.4)',
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-white)',
        padding: 'clamp(28px, 4vw, 48px)',
        maxWidth: '560px',
        width: '92%',
        borderRadius: '2px',
        margin: 'auto',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
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
            {siteContent.brand.name}
          </span>
          <h3
            id="enquiry-dialog-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Plan An Experience
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

      {submitted ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '12px', color: 'var(--color-white)' }}>
            Enquiry Received
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--color-muted-dark)', lineHeight: 1.6, marginBottom: '24px' }}>
            Thank you for reaching out to CHANDRA. Our executive production team will review your brief and contact you shortly.
          </p>
          <button onClick={onClose} className="btn-primary-gold" style={{ width: '100%' }}>
            <span>CLOSE</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Your Name *
            </label>
            <input
              ref={firstInputRef}
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'rgba(7, 8, 7, 0.6)',
                border: '1px solid rgba(248, 247, 243, 0.14)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Organisation
              </label>
              <input
                type="text"
                value={formData.organisation}
                onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(7, 8, 7, 0.6)',
                  border: '1px solid rgba(248, 247, 243, 0.14)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Phone or Email *
              </label>
              <input
                required
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(7, 8, 7, 0.6)',
                  border: '1px solid rgba(248, 247, 243, 0.14)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Event Category
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-black)',
                  border: '1px solid rgba(248, 247, 243, 0.14)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                {siteContent.experiences.categories.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
                City / Location
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(7, 8, 7, 0.6)',
                  border: '1px solid rgba(248, 247, 243, 0.14)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--color-muted-dark)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Project Vision / Brief
            </label>
            <textarea
              rows={3}
              value={formData.brief}
              onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
              placeholder="Tell us about the scale, audience, or experience you want to create..."
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'rgba(7, 8, 7, 0.6)',
                border: '1px solid rgba(248, 247, 243, 0.14)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-gold"
            style={{ width: '100%', padding: '14px', marginTop: '6px' }}
          >
            <span>{isSubmitting ? 'SUBMITTING BRIEF...' : 'SUBMIT EVENT BRIEF →'}</span>
          </button>
        </form>
      )}
    </dialog>
  );
};
