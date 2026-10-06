'use client';

import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { SmoothScrollProvider } from '@/components/SmoothScroll';
import { CursorProvider } from '@/components/CustomCursor';
import GrainOverlay from '@/components/GrainOverlay';
import LiquidRipple from '@/components/LiquidRipple';
import ScrollProgress from '@/components/ScrollProgress';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import VelocityMarquee from '@/components/VelocityMarquee';
import About from '@/components/About';
import Services from '@/components/Services';
import Work from '@/components/Work';
import GithubCTA from '@/components/GithubCTA';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { ToastContainer, showToast } from '@/components/Toast';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoaded = useCallback(() => setIsLoaded(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <CursorProvider>
          <GrainOverlay />
          <LiquidRipple />
          <ScrollProgress />
          <Preloader onComplete={handleLoaded} />

          <div className="relative min-h-screen overflow-x-clip bg-[#0E0E0E] text-[#F5F5F5] selection:bg-[#7B5CFF] selection:text-white">
            <Navbar isLoaded={isLoaded} />
            <main>
              <Hero isLoaded={isLoaded} />
              <VelocityMarquee />
              <About />
              <Skills />
              <Experience />
              <Work />
              <GithubCTA />
              <Education />
              <Services />
              <Contact onShowToast={showToast} />
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </CursorProvider>
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
