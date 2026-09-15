import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CompatibilitySearchDemo } from './components/CompatibilitySearchDemo';
import { Features } from './components/Features';
import { CategoriesGrid } from './components/CategoriesGrid';
import { AppScreensShowcase } from './components/AppScreensShowcase';
import { HowItWorks } from './components/HowItWorks';
import { BetaAccessBanner } from './components/BetaAccessBanner';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';

const REAL_APP_LOGIN_URL = 'https://app.rapidpieces.com/login';

export default function App() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadPlatform, setDownloadPlatform] = useState<'ios' | 'android' | 'all'>('all');

  // D'anciens supports (QR code imprimé sur la brochure) pointent vers #register,
  // qui affichait autrefois un formulaire local factice. On redirige maintenant
  // vers la vraie page d'inscription de l'application.
  useEffect(() => {
    if (window.location.hash === '#register') {
      window.location.replace(REAL_APP_LOGIN_URL);
    }
  }, []);

  const handleOpenDownloadModal = (platform: 'ios' | 'android' | 'all' = 'all') => {
    setDownloadPlatform(platform);
    setIsDownloadModalOpen(true);
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Sticky Top Navigation Bar */}
      <Navbar onOpenDownloadModal={handleOpenDownloadModal} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Interactive App Mockup & Store Buttons */}
        <Hero onOpenDownloadModal={handleOpenDownloadModal} />

        {/* 2. Interactive License Plate Compatibility Search Demonstrator */}
        <CompatibilitySearchDemo onOpenDownloadModal={handleOpenDownloadModal} />

        {/* 3. Core App Advantages & Pillars */}
        <Features onOpenDownloadModal={handleOpenDownloadModal} />

        {/* 4. Car Parts Categories & OEM Partner Brands */}
        <CategoriesGrid onOpenDownloadModal={handleOpenDownloadModal} />

        {/* 5. Mobile App Screens & Feature Highlights Deep Dive */}
        <AppScreensShowcase onOpenDownloadModal={handleOpenDownloadModal} />

        {/* 6. 3-Step Ordering & Repair Process */}
        <HowItWorks onOpenDownloadModal={handleOpenDownloadModal} />

        {/* 7. Early Access VIP Pre-registration & -15% Coupon Banner */}
        <BetaAccessBanner />

        {/* 8. Verified Driver & Mechanic Testimonials */}
        <Testimonials />

        {/* 9. Frequently Asked Questions (FAQ) */}
        <FAQ />

        {/* 10. Contact & Partnership Inquiries */}
        <ContactSection />
      </main>

      {/* Footer with Legal, Carriers & Payment Icons */}
      <Footer onOpenDownloadModal={handleOpenDownloadModal} />

      {/* Download & QR Code Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={handleCloseDownloadModal}
        defaultPlatform={downloadPlatform}
      />
    </div>
  );
}
