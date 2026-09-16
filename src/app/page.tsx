'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Preloader } from '@/components/Preloader';
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
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);

  // Read sessionStorage safely inside useEffect after client mount
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('chandra_preloader_seen');
      if (seen === 'true') {
        setIsPreloaderActive(false);
        setIsPreloaderComplete(true);
        setIsMediaReady(true);
        return;
      }
    } catch {
      // Ignore storage access errors
    }

    // Safety fallback timer for slow networks (max 2.5s wait for video ready event)
    const safetyTimer = setTimeout(() => {
      setIsMediaReady(true);
    }, 2500);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleMediaReady = useCallback(() => {
    setIsMediaReady(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloaderComplete(true);
    try {
      sessionStorage.setItem('chandra_preloader_seen', 'true');
    } catch {
      // Ignore storage access errors
    }
    // Unmount Preloader layer after completion
    setTimeout(() => {
      setIsPreloaderActive(false);
    }, 350);
  }, []);

  return (
    <>
      {/* 00 — CINEMATIC LOGO MASK PRELOADER */}
      {isPreloaderActive && (
        <Preloader
          isMediaReady={isMediaReady}
          onPreloaderComplete={handlePreloaderComplete}
        />
      )}

      {/* HEADER NAVIGATION */}
      <Navigation
        onOpenEnquiry={() => setEnquiryOpen(true)}
        isPreloaderComplete={isPreloaderComplete}
      />

      <main id="main-content">
        {/* 01 — HERO */}
        <Hero
          onOpenEnquiry={() => setEnquiryOpen(true)}
          onMediaReady={handleMediaReady}
          isPreloaderComplete={isPreloaderComplete}
        />

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
