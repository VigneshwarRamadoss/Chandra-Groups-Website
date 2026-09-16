'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { TrustedClients } from '@/components/TrustedClients';
import { Philosophy } from '@/components/Philosophy';
import { About } from '@/components/About';
import { FeaturedExperience } from '@/components/FeaturedExperience';
import { EventExperiences } from '@/components/EventExperiences';
import { Process } from '@/components/Process';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { EnquiryModal } from '@/components/EnquiryModal';

export default function Home() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <Navigation onOpenEnquiry={() => setEnquiryOpen(true)} />

      <main id="main-content">
        {/* 01 — HERO */}
        <Hero onOpenEnquiry={() => setEnquiryOpen(true)} />

        {/* 01.5 — TRUSTED CLIENTS RAIL */}
        <TrustedClients />

        {/* 02 — MORE THAN EVENTS / PHILOSOPHY */}
        <Philosophy />

        {/* 02.5 — ABOUT CHANDRA / CINEMATIC SPLIT-SCREEN SCROLL STORY */}
        <About />

        {/* 03 — FEATURED EXPERIENCE */}
        <FeaturedExperience />

        {/* 04 — EVERY EVENT. A NEW STORY / EVENT EXPERIENCES */}
        <EventExperiences />

        {/* 05 — HOW WE BRING IT TO LIFE / PROCESS */}
        <Process />

        {/* 06 — FINAL EXPERIENCE CTA */}
        <FinalCTA onOpenEnquiry={() => setEnquiryOpen(true)} />
      </main>

      {/* 07 — FOOTER */}
      <Footer />

      {/* Overlays / Modals */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </>
  );
}
