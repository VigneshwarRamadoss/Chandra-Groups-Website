'use client';

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { TrustedClients } from '@/components/TrustedClients';
import { Philosophy } from '@/components/Philosophy';
import { CompanyTimeline } from '@/components/CompanyTimeline';
import { About } from '@/components/About';
import { Timeline } from '@/components/Timeline';
import { FeaturedExperience } from '@/components/FeaturedExperience';
import { EventExperiences } from '@/components/EventExperiences';
import { Process } from '@/components/Process';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { EnquiryModal } from '@/components/EnquiryModal';
import { SmoothWheelScroll } from '@/components/SmoothWheelScroll';

export default function Home() {
  const [
    enquiryOpen,
    setEnquiryOpen,
  ] = useState(false);

  const [
    isMediaReady,
    setIsMediaReady,
  ] = useState(false);

  useEffect(() => {
    /*
     * Safety fallback for slow networks.
     */
    const safetyTimer =
      setTimeout(() => {
        setIsMediaReady(
          true
        );
      }, 2500);

    return () =>
      clearTimeout(
        safetyTimer
      );
  }, []);

  const handleMediaReady =
    useCallback(() => {
      setIsMediaReady(
        true
      );
    }, []);

  return (
    <>
      <SmoothWheelScroll />
      {/* HEADER NAVIGATION */}

      <Navigation
        onOpenEnquiry={() =>
          setEnquiryOpen(
            true
          )
        }
      />

      <main id="main-content">
        {/* 01 — HERO */}

        <Hero
          onOpenEnquiry={() =>
            setEnquiryOpen(
              true
            )
          }
          onMediaReady={
            handleMediaReady
          }
        />

        {/* 01.5 — TRUSTED CLIENTS */}

        <TrustedClients />

        {/* 02 — PHILOSOPHY */}

        <Philosophy />

        {/* 02.5 — ABOUT */}

        <About />
        <CompanyTimeline />

        {/* 02.75 — OUR TIMELINE */}

        <Timeline />

        {/* 03 — FEATURED EXPERIENCE */}

        <FeaturedExperience />

        {/* 04 — EVENT EXPERIENCES */}

        <EventExperiences />

        {/* 05 — PROCESS */}

        <Process />

        {/* 06 — FINAL CTA */}

        <FinalCTA
          onOpenEnquiry={() =>
            setEnquiryOpen(
              true
            )
          }
        />
      </main>

      {/* 07 — FOOTER */}

      <Footer />

      {/* OVERLAYS */}

      <EnquiryModal
        isOpen={
          enquiryOpen
        }
        onClose={() =>
          setEnquiryOpen(
            false
          )
        }
      />
    </>
  );
}