'use client';

import React from 'react';
import { siteContent } from '@/content/siteContent';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-black)',
        borderTop: '1px solid rgba(248, 247, 243, 0.08)',
        padding: '24px var(--page-pad-x)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Left Copyright */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.16em',
            color: 'var(--color-muted-dark)',
            textTransform: 'uppercase',
          }}
        >
          {siteContent.footer.copyright}
        </span>

        {/* Right Socials */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {siteContent.footer.socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: 'var(--color-muted-dark)',
                textTransform: 'uppercase',
                transition: 'color var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-dark)')}
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
