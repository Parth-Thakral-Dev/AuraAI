import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesBento } from '../components/landing/FeaturesBento';
import { InteractivePreview } from '../components/landing/InteractivePreview';
import { CapabilitiesSection } from '../components/landing/CapabilitiesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CtaSection } from '../components/landing/CtaSection';
import { Footer } from '../components/common/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 flex flex-col selection:bg-white/20 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <FeaturesBento />
        <InteractivePreview />
        <CapabilitiesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
