import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chandra-events.com'),
  title: 'CHANDRA — Events That Move People | Experience Production',
  description:
    'CHANDRA creates experiences at scale. Premium event production, corporate summits, global product launches, college festivals, and brand activations.',
  keywords: [
    'Event Management',
    'Experience Production',
    'Corporate Events',
    'Product Launch',
    'College Festival',
    'Brand Activation',
    'Stage Production',
    'CHANDRA',
  ],
  authors: [{ name: 'CHANDRA' }],
  openGraph: {
    title: 'CHANDRA — Events That Move People',
    description: 'High-production event management and cinematic live experiences at scale.',
    url: 'https://chandra-events.com',
    siteName: 'CHANDRA',
    images: [
      {
        url: '/media/hero-poster.webp',
        width: 1920,
        height: 1080,
        alt: 'CHANDRA Arena Event Production',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CHANDRA — Events That Move People',
    description: 'High-production event management and cinematic live experiences at scale.',
    images: ['/media/hero-poster.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#070807',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
